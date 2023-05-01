import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"



const firebaseConfig = {
  apiKey: "AIzaSyCljEQ_mJnGhjkUxzcn_gPoElQnI5YkUas",
  authDomain: "pln-tanggap.firebaseapp.com",
  projectId: "pln-tanggap",
  storageBucket: "pln-tanggap.appspot.com",
  messagingSenderId: "267350375933",
  appId: "1:267350375933:web:dda0d735ea4af3fa002d94"
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const auth = getAuth(app);
export const database = getFirestore();