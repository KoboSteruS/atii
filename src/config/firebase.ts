// Firebase конфигурация
// Получите эти данные из Firebase Console: https://console.firebase.google.com/
// Project Settings → Your apps → Web app → Config

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Конфигурация Firebase (замените на свои данные)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://your-project-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Инициализация Firebase только если конфиг настроен
let app: ReturnType<typeof initializeApp> | null = null;
let database: ReturnType<typeof getDatabase> | null = null;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "your-api-key") {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('Firebase инициализирован успешно');
  } catch (error) {
    console.warn('Ошибка инициализации Firebase:', error);
  }
} else {
  console.warn('Firebase не настроен. Используется только localStorage.');
}

export { database };
export default app;
