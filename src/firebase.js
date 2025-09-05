// firebase.js or firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: "AIzaSyBoX2zfgLUXr-dg8URn0zqjTb6uH0M8JDU",
  authDomain: "ecommerce-clone-ad49b.firebaseapp.com",
  projectId: "ecommerce-clone-ad49b",
  storageBucket: "ecommerce-clone-ad49b.appspot.com",
  messagingSenderId: "243169722304",
  appId: "1:243169722304:web:027cfad23ab13787301225"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBoX2zfgLUXr-dg8URn0zqjTb6uH0M8JDU",
//   authDomain: "ecommerce-clone-ad49b.firebaseapp.com",
//   projectId: "ecommerce-clone-ad49b",
//   storageBucket: "ecommerce-clone-ad49b.appspot.com", // This can remain for legacy, but is not used
//   messagingSenderId: "243169722304",
//   appId: "1:243169722304:web:027cfad23ab13787301225"
// };

const app = initializeApp(firebaseConfig);

// Optional App Check: enable if VITE_RECAPTCHA_KEY is defined
try {
  if (typeof window !== 'undefined') {
    if (location.hostname === 'localhost') {
      // eslint-disable-next-line no-undef
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    const siteKey = import.meta?.env?.VITE_RECAPTCHA_KEY;
    if (siteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
    }
  }
} catch (_) {
  // App Check is optional; ignore init failures
}

// 🔥 Firebase services you will use
export const db = getFirestore(app);               // Firestore DB
export const auth = getAuth(app);                  // Authentication
export const provider = new GoogleAuthProvider();  // Google Sign-In
