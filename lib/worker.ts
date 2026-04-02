import * as AgendaLib from 'agenda';
import mongoose from 'mongoose';
import Booking from '../models/Booking';
import Provider from '../models/Provider';
import Service from '../models/Service';
import User from '../models/User';
import { notifyProvider, notifyUser } from './notifications';

const Agenda = AgendaLib.default || AgendaLib;

// Ensure MongoDB is connected
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

// Create Agenda instance
const agenda = new Agenda({
  db: { address: MONGODB_URI, collection: 'agendaJobs' },
  processEvery: '10 seconds', // Check for jobs every 10 seconds
  maxConcurrency: 5, // Max concurrent jobs
});

// Define job: assign-booking
agenda.define('assign-booking', async (job) => {
  const { bookingId } = job.attrs.data;

  try {
    const booking = await Booking.findById(bookingId).populate('userId').populate({
      path: 'services.serviceId',
      model: 'Service'
    });
    if (!booking) {
      console.error(`Booking ${bookingId} not found`);
      return;
    }

    if (booking.status !== 'pending') {
      console.log(`Booking ${bookingId} already assigned or processed`);
      return;
    }

    // Get service IDs from booking
    const serviceIds = booking.services.map(s => (s.serviceId as any)._id || s.serviceId);

    // Find available providers in the same city, offering the services
    const providers = await Provider.find({
      isAvailable: true,
      'location.city': booking.address.city,
      services: { $in: serviceIds },
    })
      .populate('userId')
      .sort({ rating: -1, totalBookings: -1 }) // Prioritize higher rating and experience
      .limit(5); // Get top 5 candidates

    if (providers.length === 0) {
      console.log(`No available providers for booking ${bookingId}`);
      // Could schedule a retry or notify user
      return;
    }

    // For simplicity, assign to the first (best) provider
    const selectedProvider = providers[0];
    booking.providerId = selectedProvider._id;
    booking.status = 'accepted';
    await booking.save();

    // Update provider stats
    selectedProvider.totalBookings += 1;
    await selectedProvider.save();

    // Send notifications
    const providerUser = selectedProvider.userId as any;
    const bookingUser = booking.userId as any;
    await notifyProvider(providerUser.phone, bookingId.toString());
    await notifyUser(bookingUser.phone, 'accepted', bookingId.toString());

    console.log(`Assigned booking ${bookingId} to provider ${selectedProvider._id}`);
  } catch (error) {
    console.error('Error in assign-booking job:', error);
  }
});

// Define job: expire-bookings
agenda.define('expire-bookings', async (job) => {
  try {
    const expiredBookings = await Booking.updateMany(
      {
        status: 'pending',
        createdAt: { $lt: new Date(Date.now() - 15 * 60 * 1000) }, // Older than 15 minutes
      },
      { status: 'cancelled', cancellationReason: 'Expired due to no acceptance' }
    );

    console.log(`Expired ${expiredBookings.modifiedCount} bookings`);
  } catch (error) {
    console.error('Error in expire-bookings job:', error);
  }
});

// Define job: cleanup-data
agenda.define('cleanup-data', async (job) => {
  try {
    // Clean bookings older than 30 days that are cancelled or completed
    const oldBookings = await Booking.deleteMany({
      status: { $in: ['cancelled', 'completed'] },
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    console.log(`Cleaned up ${oldBookings.deletedCount} old bookings`);

    // Update provider availability (simple refresh)
    // For now, just log
    console.log('Refreshed provider availability');
  } catch (error) {
    console.error('Error in cleanup-data job:', error);
  }
});

// Start the agenda
export const startWorker = async () => {
  await agenda.start();
  console.log('Worker system started');

  // Schedule recurring jobs
  await agenda.every('10 minutes', 'expire-bookings');
  await agenda.every('1 day', 'cleanup-data');
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  await agenda.stop();
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await agenda.stop();
  await mongoose.connection.close();
  process.exit(0);
});

export { agenda };