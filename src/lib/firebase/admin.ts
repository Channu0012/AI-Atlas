// Lazy dynamic initialization of Firebase Admin SDK to prevent serverless ESM/CJS bundling conflicts on Vercel

export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

let adminApp: any = null;
let adminFirestore: any = null;
let adminAuth: any = null;

if (isFirebaseAdminConfigured) {
  try {
    // Dynamic require so module is only evaluated if credentials actually exist in environment
    const { initializeApp, getApps, getApp, cert } = require("firebase-admin/app");
    const { getFirestore } = require("firebase-admin/firestore");

    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      });
    } else {
      adminApp = getApp();
    }
    adminFirestore = getFirestore(adminApp);
  } catch (err) {
    console.warn("Failed to initialize Firebase Admin SDK:", err);
  }
}

export { adminApp, adminFirestore, adminAuth };
