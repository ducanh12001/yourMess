import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDaj-vupg43NgRNXviq0ecBJNHjdUnAExg",
    authDomain: "yourmess-b3b58.firebaseapp.com",
    projectId: "yourmess-b3b58",
    storageBucket: "yourmess-b3b58.appspot.com",
    messagingSenderId: "716363994082",
    appId: "1:716363994082:web:658cd5270f321ee21adfbb"
};

let app;
if (getApps.length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage }
  