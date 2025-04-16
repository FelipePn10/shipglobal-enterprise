import clientPromise from '@/lib/mongo';
import { ObjectId, WithId } from 'mongodb';

type TransactionType = 'credit' | 'debit';

interface Transaction {
  _id?: ObjectId;
  userId: number;
  type: TransactionType;
  status: string;
  [key: string]: any;
}

interface ExtendedTransaction extends Transaction {
  createdAt: Date;
  updatedAt: Date;
}

export default class Transactions {
  private static readonly COLLECTION_NAME = 'transactions';

  static async create(transaction: Omit<Transaction, '_id'>): Promise<WithId<Transaction>> {
    const client = await clientPromise;
    const collection = client.db().collection<Transaction>(this.COLLECTION_NAME);
    
    const extendedTransaction: ExtendedTransaction = {
      ...(transaction as Transaction),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(extendedTransaction);

    return {
      _id: result.insertedId,
      ...extendedTransaction
    };
  }

  static async findByUserId(
    userId: number,
    filters: {
      type?: TransactionType;
      dateRange?: { start: Date; end: Date };
      status?: string;
    } = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: 'asc' | 'desc';
    } = {}
  ): Promise<WithId<Transaction>[]> {
    const client = await clientPromise;
    const collection = client.db().collection<Transaction>(this.COLLECTION_NAME);

    const query: any = { userId };

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    return collection.find(query)
      .sort({ createdAt: options.sort === 'asc' ? 1 : -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 100)
      .toArray();
  }

  static async updateStatus(
    transactionId: string,
    newStatus: string
  ): Promise<boolean> {
    const client = await clientPromise;
    const collection = client.db().collection<Transaction>(this.COLLECTION_NAME);

    const result = await collection.updateOne(
      { _id: new ObjectId(transactionId) },
      { $set: { status: newStatus, updatedAt: new Date() } }
    );

    return result.modifiedCount === 1;
  }
}

// Exportação correta da classe e métodos estáticos
export const TransactionCollection = {
  create: Transactions.create,
  findByUserId: Transactions.findByUserId,
  updateStatus: Transactions.updateStatus
};