import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firebase-firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBRNOOZ2--2Hs09NrdYCII81n86CBAjGVg",
    authDomain: "codeexp67.firebaseapp.com",
    projectId: "codeexp67",
    storageBucket: "codeexp67.appspot.com",
    messagingSenderId: "321582320097",
    appId: "1:321582320097:web:756ab1e5f4cc88b64a6aa0",
    measurementId: "G-L5CJ9E0PM5"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);