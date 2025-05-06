import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDlA03ATEtN8K2iXCKqglICPxCXYQLQ-Zo",
    authDomain: "lex-ai-5e1f9.firebaseapp.com",
    projectId: "lex-ai-5e1f9",
    storageBucket: "lex-ai-5e1f9.firebasestorage.app",
    messagingSenderId: "688245421932",
    appId: "1:688245421932:web:c5ef5375904d32fe732549",
    measurementId: "G-F70376JC3X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 