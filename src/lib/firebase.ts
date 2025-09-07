
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "agrichain-r37ux",
  "appId": "1:281129452440:web:074a9e59d3708cbfe0e1ed",
  "storageBucket": "agrichain-r37ux.firebasestorage.app",
  "apiKey": "AIzaSyCt7OZ4_9wKDdISssdLoipl2ovsZkF5kX4",
  "authDomain": "agrichain-r37ux.firebaseapp.com",
  "messagingSenderId": "281129452440"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
