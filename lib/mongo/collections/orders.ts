
import clientPromise from '@/lib/mongo';
import { CurrencyCode, ImportOrder } from '@/lib/mongoModels';
import { ObjectId, WithId } from 'mongodb';

export class OrderCollection {
  private static readonly COLLECTION_NAME = 'orders';

  static async createFromImport(importOrder: WithId<ImportOrder>): Promise<WithId<ImportOrder>> {
    const client = await clientPromise;
    const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);
    
    const result = await collection.insertOne({
      ...importOrder,
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      ...importOrder,
      _id: result.insertedId
    };
  }

  static async findByImportId(importId: string): Promise<WithId<ImportOrder> | null> {
    const client = await clientPromise;
    const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

    return collection.findOne({ importId });
  }

  static async updateItems(
    orderId: string,
    items: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
      currency: string;
    }>
  ): Promise<boolean> {
    const client = await clientPromise;
    const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { items: items.map(item => ({ ...item, sku: item.productId, currency: item.currency as CurrencyCode })), updatedAt: new Date() } }
    );

    return result.modifiedCount === 1;
  }
}