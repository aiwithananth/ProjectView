import dotenv from 'dotenv';
dotenv.config();

const provider = process.env.DB_PROVIDER || 'sqlite';

let db;

if (provider === 'dynamodb') {
  // DynamoDB adapter (to be implemented in phase 6)
  const { default: dynamoAdapter } = await import('../lib/dynamoAdapter.js');
  db = dynamoAdapter;
} else {
  // Default to Prisma (SQLite)
  const { default: prisma } = await import('../lib/prisma.js');
  db = prisma;
}

export default db;

