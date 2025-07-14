// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-b814d.firebaseapp.com",
  projectId: "real-estate-b814d",
  storageBucket: "real-estate-b814d.firebasestorage.app",
  messagingSenderId: "562210415317",
  appId: "1:562210415317:web:3cb91c6e6afaed3c69f85c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);