// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAVrzROCdwOtn6AWNs8f-CnjQ8vT7jJ0U",
  authDomain: "blogging-e02dd.firebaseapp.com",
  projectId: "blogging-e02dd",
  storageBucket: "blogging-e02dd.firebasestorage.app",
  messagingSenderId: "177094013687",
  appId: "1:177094013687:web:7905baf72b6ab56b0bd9f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);