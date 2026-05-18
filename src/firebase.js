import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoyMHIoXrAjcXRBlaCfKSNyEbc2WqT5tI",
  authDomain: "inventario-app-73dcb.firebaseapp.com",
  projectId: "inventario-app-73dcb",
  storageBucket: "inventario-app-73dcb.firebasestorage.app",
  messagingSenderId: "192733229492",
  appId: "1:192733229492:web:5760187a82eb68483b82e1"
};

const app =
  initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider =
  new GoogleAuthProvider();

export const db =
  getFirestore(app);