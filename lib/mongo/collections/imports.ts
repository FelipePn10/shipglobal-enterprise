import clientPromise from '@/lib/mongo';
import { ImportOrder, ImportStatus } from '@/lib/mongoModels';
import { WithId, Filter, ObjectId } from 'mongodb';

/**
 * MongoDB collection handler for import orders
 */
export class ImportCollection {
  private static readonly COLLECTION_NAME = 'imports';

  /**
   * Creates a new import order in the database
   * @param order - Import order data without _id
   * @returns Promise containing the created import order with _id
   * @throws Error if the insert operation fails
   */
  static async create(order: Omit<ImportOrder, '_id'>): Promise<WithId<ImportOrder>> {
    // Validate input
    if (!order.userId && !order.companyId) {
      throw new Error('Either userId or companyId is required');
    }
    if (!order.importId || !order.status) {
      throw new Error('importId and status are required');
    }

    try {
      const client = await clientPromise;
      const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

      const importOrder: ImportOrder = {
        ...order,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(importOrder);

      return {
        _id: result.insertedId,
        ...importOrder,
      };
    } catch (error) {
      console.error('Failed to create import order:', error);
      throw new Error('Failed to create import order in MongoDB');
    }
  }

  /**
   * Finds import orders by userId or companyId
   * @param userId - Optional ID of the user
   * @param companyId - Optional ID of the company
   * @returns Promise containing an array of import orders
   * @throws Error if neither userId nor companyId is provided or if the query fails
   */
  static async findByUserOrCompany(
    userId?: number,
    companyId?: number
  ): Promise<WithId<ImportOrder>[]> {
    // Validate input
    if (!userId && !companyId) {
      throw new Error('Either userId or companyId must be provided');
    }

    try {
      const client = await clientPromise;
      const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

      const query: Filter<ImportOrder> = userId ? { userId } : { companyId: companyId! };

      return await collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      console.error('Failed to find import orders:', error);
      throw new Error('Failed to query import orders from MongoDB');
    }
  }

  /**
   * Updates the status and optionally the progress of an import order
   * @param importId - ID of the import order
   * @param newStatus - New status for the import order
   * @param progress - Optional progress percentage (0-100)
   * @returns Promise resolving to true if updated, false otherwise
   * @throws Error if the update operation fails
   */
  static async updateStatus(
    importId: string,
    newStatus: ImportStatus,
    progress?: number
  ): Promise<boolean> {
    // Validate input
    if (!importId) {
      throw new Error('importId is required');
    }
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      throw new Error('Progress must be between 0 and 100');
    }

    try {
      const client = await clientPromise;
      const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

      // Define update data with specific typing
      const updateData: Partial<ImportOrder> = {
        status: newStatus,
        updatedAt: new Date(),
      };

      if (progress !== undefined) {
        updateData.progress = progress;
      }

      const result = await collection.updateOne(
        { importId },
        { $set: updateData }
      );

      return result.modifiedCount === 1;
    } catch (error) {
      console.error('Failed to update import status:', error);
      throw new Error('Failed to update import status in MongoDB');
    }
  }

  /**
   * Finds an import order by its importId
   * @param importId - ID of the import order
   * @returns Promise containing the import order or null if not found
   * @throws Error if the query fails
   */
  static async findByImportId(importId: string): Promise<WithId<ImportOrder> | null> {
    // Validate input
    if (!importId) {
      throw new Error('importId is required');
    }

    try {
      const client = await clientPromise;
      const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

      return await collection.findOne({ importId });
    } catch (error) {
      console.error('Failed to find import order:', error);
      throw new Error('Failed to query import order from MongoDB');
    }
  }

  /**
   * Deletes an import order by its _id
   * @param id - MongoDB ObjectId of the import order
   * @returns Promise resolving to true if deleted, false if not found
   * @throws Error if the deletion fails
   */
  static async deleteById(id: string): Promise<boolean> {
    // Validate input
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }

    try {
      const client = await clientPromise;
      const collection = client.db().collection<ImportOrder>(this.COLLECTION_NAME);

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      return result.deletedCount === 1;
    } catch (error) {
      console.error('Failed to delete import order:', error);
      throw new Error('Failed to delete import order from MongoDB');
    }
  }
}

// Export static methods for convenience
export const ImportCollectionMethods = {
  create: ImportCollection.create,
  findByUserOrCompany: ImportCollection.findByUserOrCompany,
  updateStatus: ImportCollection.updateStatus,
  findByImportId: ImportCollection.findByImportId,
  deleteById: ImportCollection.deleteById,
};