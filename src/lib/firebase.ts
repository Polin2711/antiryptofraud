import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    "projectId": "cryptofraud-buster",
    "appId": "1:625567619097:web:c4f8258c8156574e74f288",
    "storageBucket": "cryptofraud-buster.firebasestorage.app",
    "apiKey": "AIzaSyD_JJ-Rx9QAy3L_ldJlSN9g45Ii4uLj5Fc",
    "authDomain": "cryptofraud-buster.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "625567619097"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
