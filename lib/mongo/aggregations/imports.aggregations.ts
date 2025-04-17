import clientPromise from '@/lib/mongo';
import { Filter } from 'mongodb';
import { ImportOrder, ImportStatus } from '@/lib/mongoModels';
interface ImportStatusStats {
  status: ImportStatus;
  count: number;
  totalValue: number;
}

/**
 * Aggregates import status statistics for a user or company
 * @param userId - Optional ID of the user
 * @param companyId - Optional ID of the company
 * @returns Promise containing an array of status statistics (status, count, totalValue)
 * @throws Error if neither userId nor companyId is provided or if the aggregation fails
 */
export async function getImportStatusStats(
  userId?: number,
  companyId?: number
): Promise<ImportStatusStats[]> {
  if (!userId && !companyId) {
    throw new Error('Either userId or companyId must be provided');
  }
  if (userId && (!Number.isInteger(userId) || userId <= 0)) {
    throw new Error('Invalid userId');
  }
  if (companyId && (!Number.isInteger(companyId) || companyId <= 0)) {
    throw new Error('Invalid companyId');
  }

  try {
    const client = await clientPromise;
    const collection = client.db().collection<ImportOrder>('imports');

    // Define match stage with proper typing
    const matchStage: Filter<ImportOrder> = {};
    if (userId) matchStage.userId = userId;
    if (companyId) matchStage.companyId = companyId;

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: {
            $sum: {
              $reduce: {
                input: '$items',
                initialValue: 0,
                in: {
                  $add: [
                    '$$value',
                    { $multiply: ['$$this.price', '$$this.quantity'] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          totalValue: 1,
          _id: 0,
        },
      },
    ];

    // Execute aggregation
    const result = await collection.aggregate<ImportStatusStats>(pipeline).toArray();
    return result;
  } catch (error) {
    console.error('Failed to aggregate import status stats:', error);
    throw new Error('Failed to retrieve import status statistics from MongoDB');
  }
}