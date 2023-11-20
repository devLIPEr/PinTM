import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebaseConfig';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebaseConfig)),
  databaseURL: 'https://pintm-4b550-default-rtdb.firebaseio.com'
});

export const firebaseDB = admin.database();