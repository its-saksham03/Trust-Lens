import { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { users, userPreferences } from '../db/schema';
import { eq } from 'drizzle-orm';
import admin from 'firebase-admin';

// Initialize firebase admin using env vars
if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch(e) {
    console.error("Firebase Admin initialization failed", e);
  }
}

export const firebaseAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      return;
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if(!admin.apps.length) {
       console.warn("Dev Mode fallback: No firebase admin configured correctly.");
       // To allow local dev without credentials to function partially if strictly needed
       // But per prompt rules: "Backend must verify Firebase ID tokens ... Return 401"
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;
    
    // Auto-create user if missing in PG
    let userMatches = await db.select().from(users).where(eq(users.firebaseUid, uid));
    if (userMatches.length === 0) {
      if(!email) {
          throw new Error("No email associated with token");
      }
      const [newUser] = await db.insert(users).values({
        firebaseUid: uid,
        email: email as string,
        name: name || 'User',
        avatarUrl: picture,
      }).returning();
      
      // Setup preferences
      await db.insert(userPreferences).values({ userId: newUser.id });
      userMatches = [newUser];
    }
    
    (req as any).user = userMatches[0];
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
