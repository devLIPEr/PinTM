import * as admin from 'firebase-admin';
import { firebaseConfig, databaseURL, userFirebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail, signInWithCustomToken, verifyPasswordResetCode } from "firebase/auth";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebaseConfig)),
  databaseURL: databaseURL
});

export const firebaseDB = admin.firestore();
export const firebaseAuth = admin.auth();

const app = initializeApp(userFirebaseConfig)
export const auth = getAuth(app);
export const verifyCustomToken = (token: string) => {
  return signInWithCustomToken(auth, token);
}

export const sendPassEmail = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
}

export const verifyPassCode = async (code: string) => {
  return verifyPasswordResetCode(auth, code);
}