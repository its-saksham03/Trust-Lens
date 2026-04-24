import { Router } from 'express';
import { db } from '../db';
import { breaches, alerts, installedApps, users } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { triggerBreachAlert } from '../services/notificationService';

const breachRoutes = Router();
const alertRoutes = Router();
const legalRoutes = Router();

// BREACH ROUTES
breachRoutes.get('/', async (req, res) => {
  const allBreaches = await db.select().from(breaches);
  res.json(allBreaches);
});

breachRoutes.get('/:packageName', async (req, res) => {
  const appBreaches = await db.select().from(breaches).where(eq(breaches.packageName, req.params.packageName));
  res.json(appBreaches);
});

// Admin/System endpoint to trigger breach notifications for affected users
breachRoutes.post('/test-push', async (req: any, res) => {
  const { appName, severity } = req.body;
  
  // Find all users who have this app installed
  const affectedApps = await db.select().from(installedApps).where(eq(installedApps.appName, appName));
  const affectedUserIds = [...new Set(affectedApps.map(a => a.userId))];

  // Send push notifications to all affected users
  const promises = affectedUserIds.map(uid => triggerBreachAlert(uid, appName, severity));
  await Promise.all(promises);

  res.json({ success: true, notifiedUsers: affectedUserIds.length });
});

// ALERT ROUTES
alertRoutes.get('/', async (req: any, res) => {
  const userAlerts = await db.select().from(alerts).where(eq(alerts.userId, req.user.id));
  res.json(userAlerts);
});

alertRoutes.put('/:id/read', async (req: any, res) => {
  const [alert] = await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, req.params.id)).returning();
  res.json(alert);
});

alertRoutes.put('/read-all', async (req: any, res) => {
  await db.update(alerts).set({ isRead: true }).where(eq(alerts.userId, req.user.id));
  res.json({ success: true });
});

alertRoutes.delete('/:id', async (req: any, res) => {
  await db.delete(alerts).where(eq(alerts.id, req.params.id));
  res.json({ success: true });
});

// LEGAL ROUTES (Public)
legalRoutes.get('/terms', (req, res) => {
   res.send("TrustLens Terms and Conditions. By using this service you agree to our privacy policy...");
});

legalRoutes.get('/privacy', (req, res) => {
   res.send("TrustLens Privacy Policy. We analyze your apps but do not sell your personal data...");
});

export { breachRoutes, alertRoutes, legalRoutes };
