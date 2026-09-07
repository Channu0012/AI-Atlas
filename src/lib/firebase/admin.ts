import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

let adminApp: App | null = null;
let adminFirestore: Firestore | null = null;
let adminAuth: Auth | null = null;

if (isFirebaseAdminConfigured && getApps().length === 0) {
  try {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
    adminFirestore = getFirestore(adminApp);
    adminAuth = getAuth(adminApp);
  } catch (err) {
    console.warn("Failed to initialize Firebase Admin SDK:", err);
  }
} else if (getApps().length > 0) {
  adminApp = getApp();
  adminFirestore = getFirestore(adminApp);
  adminAuth = getAuth(adminApp);
}

export { adminApp, adminFirestore, adminAuth };
