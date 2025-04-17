import { ObjectId } from 'mongodb';
import clientPromise from '../mongo';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

// Define interface for AppLog with stricter typing
interface AppLog {
  _id?: ObjectId;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context: {
    userId?: number;
    route?: string;
    method?: HttpMethod;
    params?: Record<string, string | number | boolean | null>; 
  };
  stack?: string;
  timestamp: Date;
}

/**
 * Logs application data to MongoDB
 * @param data - Log data excluding _id and timestamp
 * @returns Promise containing the result of the insert operation
 * @throws Error if the insert operation fails
 */
export async function logToMongo(data: Omit<AppLog, '_id' | 'timestamp'>) {
  if (!data.level || !data.message) {
    throw new Error('Log level and message are required');
  }

  if (!['info', 'warn', 'error', 'debug'].includes(data.level)) {
    throw new Error('Invalid log level');
  }

  try {
    const client = await clientPromise;
    const collection = client.db().collection<AppLog>('logs');

    const logEntry: AppLog = {
      ...data,
      timestamp: new Date(),
    };

    return await collection.insertOne(logEntry);
  } catch (error) {
    console.error('Failed to log to MongoDB:', error);
    throw new Error('Failed to save log to MongoDB');
  }
}