import clientPromise from '@/lib/mongo';
import { ObjectId, WithId, Filter } from 'mongodb';

// Define transaction types and statuses
type TransactionType = 'credit' | 'debit';
type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

// Define the base Transaction interface
interface Transaction {
  _id?: ObjectId;
  userId: number;
  type: TransactionType;
  status: TransactionStatus;
  amount?: number;
  description?: string;
}

// Define the extended Transaction with timestamps
interface ExtendedTransaction extends Transaction {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * MongoDB collection handler for transactions
 */
export default class Transactions {
  private static readonly COLLECTION_NAME = 'transactions';

  /**
   * Creates a new transaction in the database
   * @param transaction - Transaction data without _id
   * @returns Promise containing the created transaction with _id
   * @throws Error if the insert operation fails
   */
  static async create(transaction: Omit<Transaction, '_id'>): Promise<WithId<Transaction>> {
    // Validate input
    if (!transaction.userId || !transaction.type || !transaction.status) {
      throw new Error('userId, type, and status are required');
    }

    if (!['credit', 'debit'].includes(transaction.type)) {
      throw new Error('Invalid transaction type');
    }

    if (!['pending', 'completed', 'failed', 'cancelled'].includes(transaction.status)) {
      throw new Error('Invalid transaction status');
    }

    try {
      const client = await clientPromise;
      const collection = client.db().collection<Transaction>(this.COLLECTION_NAME);

      const extendedTransaction: ExtendedTransaction = {
        ...transaction,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(extendedTransaction);

      return {
        _id: result.insertedId,
        ...extendedTransaction,
      };
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw new Error('Failed to create transaction in MongoDB');
    }
  }

  /**
   * Finds transactions for a user with optional filters
   * @param userId - ID of the user
   * @param filters - Optional filters for type, date range, and status
   * @param options - Pagination and sorting options
   * @returns Promise containing an array of transactions
   * @throws Error if the query fails
   */
  static async findByUserId(
    userId: number,
    filters: {
      type?: TransactionType;
      dateRange?: { start: Date; end: Date };
      status?: TransactionStatus;
    } = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: 'asc' | 'desc';
    } = {}
  ): Promise<WithId<Transaction>[]> {
    // Validate input
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid userId');
    }

    try {
      const client = await clientPromise;
      const collection = client.db().collection<Transaction>(this.COLLECTION_NAME);

      // Define query with proper typing
      const query: Filter<Transaction> = { userId };

      if (filters.type) {
        query.type = filters.type;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.dateRange) {
        query.createdAt = {
          $gte: filters.dateRange.start,
          $lte: filters.dateRange.end,
        };
      }

      return await collection
        .find(query)
        .sort({ createdAt: options.sort === 'asc' ? 1 : -1 })
        .skip(options.skip ?? 0)
        .limit(options.limit ?? 100)
        .toArray();
    } catch (error) {
      console.error('Failed to find transactions:', error);
      throw new Error('Failed to query transactions from MongoDB');
    }
  }

  /**
   * Updates the status of a transaction
   * @param transactionId - ID of the transaction to update
   * @param newStatus - New status for the transaction
   * @returns Promise resolving to true if updated, false otherwise
   * @throws Error if the update operation fails
   */
  static async updateStatus(transactionId: string, newStatus: TransactionStatus): Promise<boolean> {
    // Validate input
    if (!ObjectId.isValid(transactionId)) {
      throw new Error('Invalid transactionId');
    }

    if (!['pending', 'completed', 'failed', 'cancelled'].includes(newStatus)) {
      throw new Error('Invalid transaction status');
    }

    try {
      const client = await clientPromise;
      const collection = client.db().collection<Transaction>(this.COLLECTION_NAME);

      const result = await collection.updateOne(
        { _id: new ObjectId(transactionId) },
        { $set: { status: newStatus, updatedAt: new Date() } }
      );

      return result.modifiedCount === 1;
    } catch (error) {
      console.error('Failed to update transaction status:', error);
      throw new Error('Failed to update transaction status in MongoDB');
    }
  }
}

// Export static methods for convenience
export const TransactionCollection = {
  create: Transactions.create,
  findByUserId: Transactions.findByUserId,
  updateStatus: Transactions.updateStatus,
};