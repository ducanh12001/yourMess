import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: 'AIzaSyAN1difuOuCUO-1WgnNBHWZIzvtvSd_DPg',
    authDomain: 'chatapp-8baca.firebaseapp.com',
    databaseURL: 'https://chatapp-8baca-default-rtdb.firebaseio.com',
    projectId: 'chatapp-8baca',
    storageBucket: 'chatapp-8baca.appspot.com',
    messagingSenderId: '810727850476',
    appId: '1:810727850476:web:58ff01c04d4063816240c9',
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
  