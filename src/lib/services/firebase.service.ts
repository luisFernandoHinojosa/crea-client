// src/lib/services/firebaseService.ts
import { firebaseConfig } from '$lib/config/firebase.config';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// Importa Firestore y Storage cuando los necesites
// import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage';


let app: FirebaseApp;
let auth: Auth;
// let firestore: Firestore;
// let storage: FirebaseStorage;

export function initializeFirebase(): void {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    // firestore = getFirestore(app);
    // storage = getStorage(app);
  }
}

// Llama a la inicialización una vez
initializeFirebase();

export { app, auth /*, firestore, storage */ };