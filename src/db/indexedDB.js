// src/db/indexedDB.js
import { openDB } from 'idb';

export const initDB = async () => {
    return await openDB('TypingPracticeDB', 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('results')) {
                db.createObjectStore('results', { keyPath: 'timestamp' });
            }
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'id' });
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

export const saveSettings = async (settings) => {
    const db = await initDB();
    await db.put('settings', { id: 'user-settings', ...settings });
};

export const loadSettings = async () => {
    const db = await initDB();
    return await db.get('settings', 'user-settings');
};