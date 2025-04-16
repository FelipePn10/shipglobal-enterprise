import clientPromise from "@/lib/mongo";

export async function createTransactionIndexes() {
  const client = await clientPromise;
  const collection = client.db().collection('transactions');

  await Promise.all([
    collection.createIndex({ userId: 1 }),
    collection.createIndex({ createdAt: -1 }),
    collection.createIndex({ type: 1, status: 1 }),
    collection.createIndex({ 'metadata.mysqlTransactionId': 1 }, { unique: true, sparse: true }),
    collection.createIndex({ 'metadata.paymentIntentId': 1 }, { sparse: true }),
    collection.createIndex({ amount: 1, currency: 1 })
  ]);
}