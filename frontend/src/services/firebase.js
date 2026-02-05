import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY_FIREBASE,
  authDomain: "trading-saas-29ca7.firebaseapp.com",
  projectId: "trading-saas-29ca7",
  storageBucket: "trading-saas-29ca7.firebasestorage.app",
  messagingSenderId: "1069494584334",
  appId: "1:1069494584334:web:25435226bee14fcb5fa85f",
  measurementId: "G-RX33QMEMSQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);