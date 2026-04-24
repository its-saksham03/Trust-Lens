import { Router } from 'express';
import { db } from '../db';
import { users, userPreferences } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/me', async (req: any, res) => {
  try {
    const user = req.user;
    const prefs = await db.select().from(userPreferences).where(eq(userPreferences.userId, user.id));
    res.json({ ...user, preferences: prefs[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/profile', async (req: any, res) => {
  try {
    const { name, phone, avatarUrl } = req.body;
    const [updatedUser] = await db.update(users)
      .set({ name, phone, avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, req.user.id))
      .returning();
    res.json(updatedUser);
  } catch(err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.put('/preferences', async (req: any, res) => {
  try {
    const { pushNotifications, breachAlerts, weeklyReport, installAlerts, fcmToken } = req.body;
    
    // Build update object dynamically to allow partial updates (e.g. just fcmToken)
    const updateData: any = { updatedAt: new Date() };
    if (pushNotifications !== undefined) updateData.pushNotifications = pushNotifications;
    if (breachAlerts !== undefined) updateData.breachAlerts = breachAlerts;
    if (weeklyReport !== undefined) updateData.weeklyReport = weeklyReport;
    if (installAlerts !== undefined) updateData.installAlerts = installAlerts;
    if (fcmToken !== undefined) updateData.fcmToken = fcmToken;

    const [updatedPrefs] = await db.update(userPreferences)
      .set(updateData)
      .where(eq(userPreferences.userId, req.user.id))
      .returning();
    res.json(updatedPrefs);
  } catch(err) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;
