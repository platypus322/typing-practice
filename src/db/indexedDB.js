import { openDB } from 'idb';

export const initDB = async () => {
  return await openDB('TypingPracticeDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('results')) {
        db.createObjectStore('results', { keyPath: 'timestamp' });
      }
    },
  });
};

export const saveResult = async (result) => {
  const db = await initDB();
  await db.add('results', result);
};

export const getAllResults = async () => {
  const db = await initDB();
  return await db.getAll('results');
};