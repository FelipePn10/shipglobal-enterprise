import clientPromise from "@/lib/mongo";

export async function getImportStatusStats(userId?: number, companyId?: number) {
  const client = await clientPromise;
  const collection = client.db().collection('imports');

  const matchStage: any = {};
  if (userId) matchStage.userId = userId;
  if (companyId) matchStage.companyId = companyId;

  return collection.aggregate([
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
              in: { $add: ['$$value', { $multiply: ['$$this.price', '$$this.quantity'] }] }
            }
          }
        }
      }
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        totalValue: 1,
        _id: 0
      }
    }
  ]).toArray();
}