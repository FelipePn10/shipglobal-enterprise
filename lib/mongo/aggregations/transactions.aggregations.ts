import clientPromise from "@/lib/mongo";
import { CurrencyCode } from "@/types/balance";

export async function getUserTransactionSummary(
  userId: number,
  currency: CurrencyCode
) {
  const client = await clientPromise;
  const collection = client.db().collection('transactions');

  return collection.aggregate([
    {
      $match: {
        userId,
        currency,
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        lastDate: { $max: '$createdAt' }
      }
    },
    {
      $project: {
        type: '$_id',
        totalAmount: 1,
        count: 1,
        lastDate: 1,
        _id: 0
      }
    }
  ]).toArray();
}