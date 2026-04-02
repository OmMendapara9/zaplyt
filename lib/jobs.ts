import { connectToDatabase } from './mongodb';
import mongoose from 'mongoose';

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

export interface JobData {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

/**
 * Enqueue a job to be processed by the worker
 */
export async function enqueueJob(jobName: string, jobData: unknown) {
  try {
    await connectToDatabase();
    
    const job = new JobQueue({
      name: jobName,
      data: jobData,
      nextRunAt: new Date(),
    });
    
    await job.save();
    console.log(`Job "${jobName}" enqueued`);
    return job;
  } catch (error) {
    console.error('Error enqueueing job:', error);
    throw error;
  }
}