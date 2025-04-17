import { MongoClient, MongoClientOptions } from 'mongodb';

// Define configuration interface for better type safety
interface MongoConfig {
  uri: string;
  options?: MongoClientOptions;
}

// Extend globalThis for TypeScript global variable typing
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Validate environment variable
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// MongoDB connection configuration
const config: MongoConfig = {
  uri: MONGODB_URI,
  options: {
    maxPoolSize: 10,
    minPoolSize: 2,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 5000,
  },
};

/**
 * Creates and manages MongoDB client connection
 * Uses singleton pattern for connection pooling
 * @returns Promise<MongoClient> - Connected MongoDB client
 * @throws Error if connection fails
 */
async function createMongoClient(): Promise<MongoClient> {
  try {
    const client = new MongoClient(config.uri, config.options);
    return await client.connect();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

// Singleton connection promise
let clientPromise: Promise<MongoClient>;

// Handle development vs production environments
if (process.env.NODE_ENV === 'development') {
  // Reuse connection in development to prevent multiple connections during hot reload
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createMongoClient();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Create new connection in production
  clientPromise = createMongoClient();
}

// Export the connection promise
export default clientPromise;

/**
 * Closes the MongoDB connection
 * @returns Promise<void>
 * @throws Error if closing the connection fails
 */
export async function closeMongoConnection(): Promise<void> {
  try {
    const client = await clientPromise;
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}