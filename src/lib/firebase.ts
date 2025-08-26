// Fill with your Firebase config and export initialized app/db/auth later
export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '000000000000',
    appId: '1:000000000000:web:xxxxxxxxxxxxxxxx',
    measurementId: 'G-XXXXXXX'
  }
  
  // Example (uncomment when ready):
  // import { initializeApp } from 'firebase/app'
  // import { getAuth } from 'firebase/auth'
  // import { getFirestore } from 'firebase/firestore'
  // import { getMessaging } from 'firebase/messaging'
  // import { getFunctions } from 'firebase/functions'
  // export const app = initializeApp(firebaseConfig)
  // export const auth = getAuth(app)
  // export const db = getFirestore(app)
  // export const messaging = getMessaging(app)
  // export const functions = getFunctions(app)
  