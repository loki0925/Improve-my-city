// This configuration is used by the Google Maps component to get an API key.
// It is now also used to initialize Firebase services.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// =================================================================================
// IMPORTANT: CREATE YOUR OWN FIREBASE PROJECT AND PASTE YOUR CONFIGURATION HERE
// 1. Go to console.firebase.google.com and create a new project.
// 2. Add a new Web App to your project.
// 3. Firebase will give you a `firebaseConfig` object. Copy it.
// 4. Replace the entire object below with the one you copied from your project.
// =================================================================================
export const firebaseConfig = {
   apiKey: "AIzaSyAtXJsbkjxxunPT0DuW51x_kHLqCV-LW1s",
  authDomain: "cityfix-app-8d21f.firebaseapp.com",
  projectId: "cityfix-app-8d21f",
  storageBucket: "cityfix-app-8d21f.appspot.com",
  messagingSenderId: "1029958752001",
  appId: "1:1029958752001:web:700368a08e23b96b8b2d00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);