import { initializeApp, getApp } from "@firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import { Firestore, connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { Functions, connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const isEmulator = process.env.REACT_APP_FIREBASE_DEVELOPMENT === "true";
/**
 * Production
 */
let auth: Auth;
let firestore: Firestore;
let functions: Functions;

if (isEmulator) {
  initializeApp(firebaseConfig);
  auth = getAuth(getApp());
  firestore = getFirestore(getApp());
  functions = getFunctions(getApp(), "asia-east2");

  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
} else {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  functions = getFunctions(app, "asia-east2");
}

/**
 * Testing
 */
export { auth, firestore, functions };
