import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth  } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getReactNativePersistence } from "firebase/auth/react-native"
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage"

const messagingServerKey = "AAAAPj9S_f0:APA91bH7vMbeKXGCqwvsgMs2g-dB1j5NPN_YaRda3VmgzFQeszTHP80HO2Ng559b_XscsPT0rIppBdI-Cq34IM_646Asuel84MmPEPzTLvXaR08idpz2s04BuZcZBtM-Q_ShpzXrurx9";
const messagingApiUrl = "https://fcm.googleapis.com/fcm/send";

const firebaseConfig = {
  apiKey: "AIzaSyADR9sca1GSQHXmFivh82jrReiQ8SkSMDE",
  authDomain: "pln-tanggap.firebaseapp.com",
  projectId: "pln-tanggap",
  storageBucket: "pln-tanggap.appspot.com",
  messagingSenderId: "267350375933",
  appId: "1:267350375933:web:dda0d735ea4af3fa002d94",
  databaseURL: "https://pln-tanggap-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});



const auth = getAuth(app);
const db = getDatabase(app);


export { messagingServerKey, messagingApiUrl, auth, db };
