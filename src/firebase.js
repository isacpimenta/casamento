// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYE7Q-a8pgtWLEUXuXZAUFpSPxQqUXMxY",
  authDomain: "presenca-casamento.firebaseapp.com",
  projectId: "presenca-casamento",
  storageBucket: "presenca-casamento.firebasestorage.app",
  messagingSenderId: "471307588476",
  appId: "1:471307588476:web:4031d9cf63f6896f304af9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);