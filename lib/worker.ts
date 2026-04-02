import mongoose from 'mongoose';
import { connectToDatabase } from './mongodb';
import Booking from '../models/Booking';
import Provider from '../models/Provider';
import User from '../models/User';
import { notifyProvider, notifyUser } from './notifications';

// Job collection schema
const jobSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: mongoose.Schema.Types.Mixed,
  nextRunAt: { type: Date, default: new Date() },
  failCount: { type: Number, default: 0 },
  processed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const JobQueue = mongoose.models.JobQueue || mongoose.model('JobQueue', jobSchema);

// Job handlers
const jobHandlers: { [key: string]: (data: any) => Promise<void> } = {
  'assign-booking': assignBooking,
};

async function assignBooking(data: any) {
  const { bookingId } = data;

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

    // Find available providers in the same city
    const providers = await Provider.find({
      isAvailable: true,
      'location.city': booking.address.city,
      services: { $in: serviceIds },
    })
      .populate('userId')
      .sort({ rating: -1, totalBookings: -1 })
      .limit(5);

    if (providers.length === 0) {
      console.log(`No available providers for booking ${bookingId}`);
      return;
    }

    // Assign to best provider
    const selectedProvider = providers[0];
    booking.providerId = selectedProvider._id;
    booking.status = 'accepted';
    await booking.save();

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
}

async function expireBookings() {
  try {
    const result = await Booking.updateMany(
      {
        status: 'pending',
        createdAt: { $lt: new Date(Date.now() - 15 * 60 * 1000) },
      },
      { status: 'cancelled', cancellationReason: 'Expired due to no acceptance' }
    );

    console.log(`Expired ${result.modifiedCount} bookings`);
  } catch (error) {
    console.error('Error expiring bookings:', error);
  }
}

async function cleanupData() {
  try {
    const result = await Booking.deleteMany({
      status: { $in: ['cancelled', 'completed'] },
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    console.log(`Cleaned up ${result.deletedCount} old bookings`);
  } catch (error) {
    console.error('Error cleaning data:', error);
  }
}

async function processJobs() {
  try {
    const job = await JobQueue.findOne({ processed: false, nextRunAt: { $lte: new Date() } });

    if (job) {
      const handler = jobHandlers[job.name];
      if (handler) {
        await handler(job.data);
      }
      job.processed = true;
      await job.save();
      console.log(`Processed job: ${job.name}`);
    }
  } catch (error) {
    console.error('Error processing job:', error);
  }
}

export async function startWorker() {
  try {
    await connectToDatabase();
    console.log('Worker system started');

    // Process jobs every 5 seconds
    setInterval(processJobs, 5000);

    // Expire bookings every 10 minutes
    setInterval(expireBookings, 10 * 60 * 1000);

    // Cleanup every day
    setInterval(cleanupData, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error('Error starting worker:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start worker if this file is run directly
if (require.main === module) {
  startWorker();
}

export { JobQueue };