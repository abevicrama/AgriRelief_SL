import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDhrOiYBez9kOalluhOUc-bUAGaKZKTGNU",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agrirelief-sl-2.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agrirelief-sl-2",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agrirelief-sl-2.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "673476788078",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:673476788078:web:f8bb95ace5528f58dacb7f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
