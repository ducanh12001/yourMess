import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAS_3Vt7nrSI5bXZkcKckfowBuQ8nFtrxE",
    authDomain: "chatapp-1d941.firebaseapp.com",
    databaseURL: "https://chatapp-1d941-default-rtdb.firebaseio.com",
    projectId: "chatapp-1d941",
    storageBucket: "chatapp-1d941.appspot.com",
    messagingSenderId: "1054390515994",
    appId: "1:1054390515994:web:6a05ec03d77be8ecee14a3"
};

let app;
if (getApps.length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}
const auth = getAuth(app);
const db = getDatabase(app);
/*if (location.hostname === "localhost") {
    connectDatabaseEmulator(db, "localhost", 9000);
    connectAuthEmulator(auth, "http://localhost:9099");
}*/
const storage = getStorage(app);

//const messaging = getMessaging(app);

export { auth, db, storage }
