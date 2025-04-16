import clientPromise from "@/lib/mongo";
import { ImportOrder, ImportStatus } from "@/lib/mongoModels";
import { WithId } from "mongodb";

export class ImportCollection {
  static findByImportId(id: string): any {
    throw new Error("Method not implemented.");
  }
  static deleteById(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  private static readonly COLLECTION_NAME = 'imports';

  static async create(order: Omit<ImportOrder, '_id'>): Promise<WithId<ImportOrder>> {
    const client = await clientPromise;
    const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);
    
    const result = await collection.insertOne({
      ...order,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      _id: result.insertedId,
      ...order
    };
  }

  static async findByUserOrCompany(
    userId?: number,
    companyId?: number
  ): Promise<WithId<ImportOrder>[]> {
    const client = await clientPromise;
    const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

    const query = userId ? { userId } : { companyId };

    return collection.find(query)
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async updateStatus(
    importId: string,
    newStatus: ImportStatus,
    progress?: number
  ): Promise<boolean> {
    const client = await clientPromise;
    const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

    const updateData: any = {
      status: newStatus,
      updatedAt: new Date()
    };

    if (progress !== undefined) {
      updateData.progress = progress;
    }

    const result = await collection.updateOne(
      { importId },
      { $set: updateData }
    );

    return result.modifiedCount === 1;
  }
}