import { createTransactionIndexes } from './indexes/transactions.index';
import { createImportIndexes } from './indexes/imports.index';

export async function initializeMongoDB() {
  try {
    await Promise.all([
      createTransactionIndexes(),
      createImportIndexes()
    ]);
    console.log('MongoDB indexes created successfully');
  } catch (error) {
    console.error('Failed to initialize MongoDB indexes:', error);
  }
}
