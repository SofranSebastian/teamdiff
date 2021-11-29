import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB5V08qRzexHyofw1aEqVnlhfuxHMqxty4",
    authDomain: "teamdiff-stackly-24478.firebaseapp.com",
    projectId: "teamdiff-stackly-24478",
    storageBucket: "teamdiff-stackly-24478.appspot.com",
    messagingSenderId: "631275236682",
    appId: "1:631275236682:web:f54bdaa6a1f244510de5b3",
    measurementId: "G-HEFWSMX049"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const usersCol = collection(db, "users");
export const bugsCol = collection(db, "bugs");