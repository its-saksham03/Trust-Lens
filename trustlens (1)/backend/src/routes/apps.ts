import { Router } from 'express';
import { db } from '../db';
import { installedApps, trustScores, alerts } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { calculateTrustScore } from '../services/trustScoreEngine';
import { scanLimiter } from '../middleware/rateLimiter';
import { triggerInstallAlert, triggerScoreChangeAlert } from '../services/notificationService';

const appRoutes = Router();
const scanRoutes = Router();

// APP ROUTES
appRoutes.get('/', async (req: any, res) => {
  const apps = await db.select().from(installedApps).where(eq(installedApps.userId, req.user.id));
  res.json(apps);
});

appRoutes.post('/', async (req: any, res) => {
  const { packageName, appName, category, iconUrl, permissions } = req.body;
  const [newApp] = await db.insert(installedApps).values({
    userId: req.user.id,
    packageName,
    appName,
    category,
    iconUrl,
  }).returning();

  // If you also want to generate a score instantly upon install:
  const scoreResult = calculateTrustScore({ ...newApp, permissions: permissions || [] });
  await db.insert(trustScores).values({
    appId: newApp.id,
    userId: req.user.id,
    ...scoreResult
  });

  // Trigger push notification for new install
  await triggerInstallAlert(req.user.id, newApp.id, newApp.appName, scoreResult.riskLevel);

  res.json(newApp);
});

appRoutes.delete('/:id', async (req: any, res) => {
  await db.update(installedApps).set({ isActive: false }).where(eq(installedApps.id, req.params.id));
  res.json({ success: true, message: "App removed" });
});

appRoutes.get('/:id', async (req: any, res) => {
  const apps = await db.select().from(installedApps).where(eq(installedApps.id, req.params.id));
  if(apps.length === 0) return res.status(404).json({ error: "App not found" });
  
  const scores = await db.select().from(trustScores).where(eq(trustScores.appId, apps[0].id)).orderBy(desc(trustScores.scannedAt));
  res.json({ ...apps[0], trustScore: scores[0] });
});

// SCAN ROUTES
scanRoutes.post('/:appId', scanLimiter, async (req: any, res) => {
   const appId = req.params.appId;
   const apps = await db.select().from(installedApps).where(eq(installedApps.id, appId));
   if(apps.length === 0) return res.status(404).json({ error: "App not found" });

   const appData = apps[0];
   const requestedPermissions = req.body.permissions || [];
   
   // 1. Fetch old score
   const oldScores = await db.select().from(trustScores)
      .where(eq(trustScores.appId, appId))
      .orderBy(desc(trustScores.scannedAt))
      .limit(1);
   const oldScore = oldScores.length > 0 ? oldScores[0] : null;

   // 2. Compute new score
   const scoreResult = calculateTrustScore({ ...appData, permissions: requestedPermissions });

   // 3. Save new score
   const [newScore] = await db.insert(trustScores).values({
     appId: appData.id,
     userId: req.user.id,
     ...scoreResult
   }).returning();

   // 4. Evaluate Score Drops
   if (oldScore && oldScore.overallScore > scoreResult.overallScore) {
       const drop = oldScore.overallScore - scoreResult.overallScore;
       // Only trigger alert if drop is significant (>10) or risk level worsens
       if (drop > 10 || oldScore.riskLevel !== scoreResult.riskLevel) {
           await triggerScoreChangeAlert(req.user.id, appData.id, appData.appName, drop, scoreResult.riskLevel);
       }
   }

   res.json(newScore);
});

scanRoutes.get('/history', async (req: any, res) => {
   // return generic history
   res.json([]);
});

export { appRoutes, scanRoutes };
