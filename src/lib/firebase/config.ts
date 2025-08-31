import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlhLhR87CMJ5lzMYrldBkC3-gkqqs7Vw0",
  authDomain: "jewelrygirvisystem.firebaseapp.com",
  databaseURL: "https://jewelrygirvisystem-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jewelrygirvisystem",
  storageBucket: "jewelrygirvisystem.firebasestorage.app",
  messagingSenderId: "276774336900",
  appId: "1:276774336900:web:06002ad30f59809e9185d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;
