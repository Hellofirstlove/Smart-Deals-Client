// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCy1QggsBQU6J7QTEgP4__Lm4hPOLPftXA",
  authDomain: "smart-deals-d0d6f.firebaseapp.com",
  projectId: "smart-deals-d0d6f",
  storageBucket: "smart-deals-d0d6f.firebasestorage.app",
  messagingSenderId: "505439621014",
  appId: "1:505439621014:web:e1542ea7058da51f8957b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);