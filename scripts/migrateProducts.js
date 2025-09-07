// scripts/migrateProducts.js
// One-time migration to copy all products from stores/{storeId}/products/{productId}
// into top-level products/{productId}. Safe to re-run.

import { initializeApp } from 'firebase/app';
import { getFirestore, collectionGroup, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

// IMPORTANT: Uses environment variables. Set these in your shell or .env file.
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Derive the parent storeId from a product document reference path.
 * Path shape: stores/{storeId}/products/{productId}
 */
function extractStoreId(productDocRef) {
  // parent() of the doc is 'products' collection, its parent is the 'stores/{storeId}' doc
  const productsCol = productDocRef.parent; // .../products
  const storeDoc = productsCol.parent; // .../stores/{storeId}
  return storeDoc?.id || null;
}

/**
 * Run migration.
 * - Reads every subcollection named 'products' using collectionGroup
 * - For each item, writes to top-level products/{productId}
 * - Preserves all fields and also sets storeId and productId
 * - Safe to re-run: uses setDoc with merge: true to avoid destructive overwrites
 */
export async function migrateProductsToTopLevel() {
  const migrated = { attempted: 0, written: 0, skipped: 0, errors: 0 };
  console.log('[migrate] Starting products migration...');

  const allProductsSnap = await getDocs(collectionGroup(db, 'products'));
  console.log(`[migrate] Found ${allProductsSnap.size} products in subcollections.`);

  for (const docSnap of allProductsSnap.docs) {
    migrated.attempted += 1;
    const productId = docSnap.id;

    try {
      const sourceData = docSnap.data();
      const storeId = sourceData.storeId || extractStoreId(docSnap.ref);

      if (!storeId) {
        console.warn(`[migrate] Skipping ${productId}: could not determine storeId.`);
        migrated.skipped += 1;
        continue;
      }

      // Prepare target ref at top-level products/{productId}
      const targetRef = doc(db, 'products', productId);
      const targetSnap = await getDoc(targetRef);

      // Compose payload: preserve fields, ensure storeId and productId present
      const payload = { ...sourceData, storeId, productId };

      // Safe to re-run: merge updates existing docs, and first write creates it
      await setDoc(targetRef, payload, { merge: true });

      if (targetSnap.exists()) {
        migrated.written += 1; // treated as updated
      } else {
        migrated.written += 1; // treated as created; same counter for simplicity
      }
    } catch (err) {
      migrated.errors += 1;
      console.error(`[migrate] Error migrating product ${productId}:`, err);
    }
  }

  console.log('[migrate] Done.', migrated);
  return migrated;
}

// Allow manual invocation when imported via a Node runner or bundler context
// Example run via node (with ESM enabled):
//   node --experimental-modules scripts/migrateProducts.js
// Or use: `node -e "import('./scripts/migrateProducts.js').then(m=>m.migrateProductsToTopLevel())"`
if (typeof window === 'undefined') {
  // Best-effort auto-run when executed directly in Node
  const isDirectRun = process?.argv?.[1]?.endsWith('migrateProducts.js');
  if (isDirectRun) {
    migrateProductsToTopLevel().then(() => process.exit(0)).catch(() => process.exit(1));
  }
}


