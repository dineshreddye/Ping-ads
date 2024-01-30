import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1o3FsWl9svG0lGHJmmzqUYPjDMP3wh9E",
  authDomain: "thepingads.firebaseapp.com",
  projectId: "thepingads",
  storageBucket: "thepingads.appspot.com",
  messagingSenderId: "785522688082",
  appId: "1:785522688082:web:320b029515c221c16fdf8b",
  measurementId: "G-4JEY9JQZVQ",
  databaseURL: "https://thepingads-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebase);
export const database = getDatabase(firebase);
