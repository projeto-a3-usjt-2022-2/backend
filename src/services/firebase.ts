import * as admin from "firebase-admin";

const firebaseConfig = require("../../firebase_credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://app-guilhermina-clinicas.herokuapp.com",
});

export const db = admin.firestore();
