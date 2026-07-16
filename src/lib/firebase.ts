import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDjzyDdqy_cSU_tjbKBoJtEtb4018dbfBY",
  authDomain: "gen-lang-client-0317300290.firebaseapp.com",
  projectId: "gen-lang-client-0317300290",
  storageBucket: "gen-lang-client-0317300290.firebasestorage.app",
  messagingSenderId: "255564581723",
  appId: "1:255564581723:web:5aaa7e7c2d1c07cfd2e87e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific custom database ID as the third argument
const db = initializeFirestore(app, {}, "ai-studio-vmsmakeupsalonbr-8b67707f-25ee-48af-bf51-5c411c707f8e");

// Initialize Storage
const storage = getStorage(app);

export { app, db, storage, collection, addDoc, getDocs, query, orderBy, ref, uploadBytes, getDownloadURL };
