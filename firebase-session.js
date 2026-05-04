import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { initializeFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyBsvbEEHEgBuw9pDml-Om90mm8MLDw8gWs',
  authDomain: 'baghethan-ba325.firebaseapp.com',
  projectId: 'baghethan-ba325',
  storageBucket: 'baghethan-ba325.firebasestorage.app',
  messagingSenderId: '944819735112',
  appId: '1:944819735112:web:07315600da39377320667d'
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false
});

export function waitForSignedInUser(timeoutMs = 12000) {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  return new Promise((resolve, reject) => {
    let unsubscribe = () => {};
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error('auth-timeout'));
    }, timeoutMs);

    unsubscribe = onAuthStateChanged(
      auth,
      user => {
        clearTimeout(timer);
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error('auth-required'));
      },
      error => {
        clearTimeout(timer);
        unsubscribe();
        reject(error);
      }
    );
  });
}

export function logFirebaseError(context, error) {
  console.error(`${context}:`, error);
}
