import clientPromise from "@/lib/mongo";

export async function createImportIndexes() {
  const client = await clientPromise;
  const collection = client.db().collection('imports');

  await Promise.all([
    collection.createIndex({ importId: 1 }, { unique: true }),
    collection.createIndex({ userId: 1 }),
    collection.createIndex({ companyId: 1 }),
    collection.createIndex({ status: 1 }),
    collection.createIndex({ createdAt: -1 }),
    collection.createIndex({ 'metadata.mysqlImportId': 1 }, { unique: true, sparse: true })
  ]);
}