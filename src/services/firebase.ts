import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2v-bpJA-TPvdEZDGL_mpskyyHLqVEVoo",
  authDomain: "sistema-askfo.firebaseapp.com",
  projectId: "sistema-askfo",
  storageBucket: "sistema-askfo.firebasestorage.app",
  messagingSenderId: "473657547988",
  appId: "1:473657547988:web:49ccbdadbdf8b5aa422f41",
  measurementId: "G-XPD2WWTH0D"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);