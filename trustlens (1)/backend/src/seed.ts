import { db } from './db';
import { breaches } from './db/schema';
import { count } from 'drizzle-orm';

const INITIAL_BREACHES = [
  { appName: 'Facebook', breachYear: 2021, severity: 'Critical', affectedUsers: '533M users', source: 'Public Report' },
  { appName: 'LinkedIn', breachYear: 2021, severity: 'High', affectedUsers: '700M users', source: 'Public Report' },
  { appName: 'Canva', breachYear: 2019, severity: 'Medium', affectedUsers: '139M users', source: 'Public Report' },
  { appName: 'Dropbox', breachYear: 2012, severity: 'High', affectedUsers: '68M users', source: 'Public Report' },
  { appName: 'Snapchat', breachYear: 2014, severity: 'Medium', affectedUsers: '4.6M users', source: 'Public Report' },
  { appName: 'TikTok', breachYear: 2022, severity: 'Critical', affectedUsers: '1B users', source: 'Public Report' },
  { appName: 'Zoom', breachYear: 2020, severity: 'Medium', affectedUsers: '500K users', source: 'Public Report' }
];

export async function seedDatabase() {
  try {
    const existingBreaches = await db.select({ count: count() }).from(breaches);
    if (existingBreaches[0].count === 0) {
      console.log('Seeding initial breaches data...');
      await db.insert(breaches).values(INITIAL_BREACHES);
      console.log('Breaches seeded.');
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}
