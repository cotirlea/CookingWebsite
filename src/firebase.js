import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyCORD7oQBfYLXA-8180nAe6AEo9fnPEgvg",
  authDomain: "cooking-cite.firebaseapp.com",
  projectId: "cooking-cite",
  storageBucket: "cooking-cite.appspot.com",
  messagingSenderId: "90972727958",
  appId: "1:90972727958:web:be8d48c8368201918c30b7",
  measurementId: "G-GVZNHH0KN7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app};