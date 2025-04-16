import { ObjectId } from 'mongodb';
import clientPromise from '../mongo';

interface AppLog {
  _id?: ObjectId;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context: {
    userId?: number;
    route?: string;
    method?: string;
    params?: Record<string, any>;
  };
  stack?: string;
  timestamp: Date;
}

export async function logToMongo(data: Omit<AppLog, '_id' | 'timestamp'>) {
  const client = await clientPromise;
  const collection = client.db().collection<AppLog>('logs');
  
  return collection.insertOne({
    ...data,
    timestamp: new Date()
  });
}