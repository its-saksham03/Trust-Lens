import admin from 'firebase-admin';
import { db } from '../db';
import { alerts, userPreferences } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Core notification dispatcher combining Database Alerts and Firebase Cloud Messaging
 */
export const sendPushNotification = async (
  userId: string,
  type: 'new_install' | 'breach' | 'score_change' | 'dangerous_permission',
  title: string,
  body: string,
  appId?: string
) => {
  try {
    // 1. Create the persistent database alert (In-App Notification)
    await db.insert(alerts).values({
      userId,
      type,
      title,
      body,
      appId: appId || null,
    });

    // 2. Lookup user preferences and FCM routing token
    const prefs = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    if (prefs.length === 0) return;

    const p = prefs[0];

    // 3. User opt-out logic
    if (!p.pushNotifications) return; // Master switch
    if (type === 'new_install' && !p.installAlerts) return;
    if (type === 'breach' && !p.breachAlerts) return;
    
    // 4. Dispatch natively to device if token exists
    if (p.fcmToken && admin.apps.length > 0) {
      await admin.messaging().send({
        token: p.fcmToken,
        notification: {
          title,
          body,
        },
        data: {
          type,
          appId: appId || '',
        },
      });
      console.log(`[Notification] Push sent to user ${userId} for event ${type}`);
    }
  } catch (error) {
    console.error(`[Notification] Failed to send push to ${userId}:`, error);
  }
};

// Specialized Helper Functions
export const triggerInstallAlert = async (userId: string, appId: string, appName: string, riskLevel: string) => {
  const isHighRisk = riskLevel === 'dangerous' || riskLevel === 'risky';
  const title = isHighRisk ? `⚠️ High Risk App Installed` : `New App Scanned: ${appName}`;
  const body = isHighRisk 
    ? `${appName} has been classified as ${riskLevel.toUpperCase()}. Review its permissions immediately.` 
    : `TrustLens has verified ${appName} as ${riskLevel}.`;
    
  await sendPushNotification(userId, 'new_install', title, body, appId);
};

export const triggerScoreChangeAlert = async (userId: string, appId: string, appName: string, dropAmount: number, newRisk: string) => {
  const title = `🚨 Privacy Alert: ${appName}`;
  const body = `Trust Score dropped by ${dropAmount} points. App is now classified as ${newRisk.toUpperCase()}.`;
  await sendPushNotification(userId, 'score_change', title, body, appId);
};

export const triggerBreachAlert = async (userId: string, appName: string, severity: string) => {
  const title = `🚨 Data Breach Detected: ${appName}`;
  const body = `A ${severity.toUpperCase()} severity breach impacting ${appName} has been reported. Check your exposure.`;
  await sendPushNotification(userId, 'breach', title, body);
};
