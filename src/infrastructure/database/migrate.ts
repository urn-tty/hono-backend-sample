import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './db';

console.log('Running migrations...');
migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations completed!');

