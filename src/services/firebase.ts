import * as admin from "firebase-admin";

const firebaseConfig = require("../../firebase_credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export const db = admin.firestore();
