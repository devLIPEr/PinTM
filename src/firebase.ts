import * as admin from 'firebase-admin';
import { firebaseConfig, databaseURL, userFirebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from "firebase/auth";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebaseConfig)),
  databaseURL: databaseURL
});

export const firebaseDB = admin.firestore();
export const firebaseAuth = admin.auth();

const app = initializeApp(userFirebaseConfig)
export const verifyCustomToken = (token: string) => {
  return signInWithCustomToken(getAuth(app), token)
}