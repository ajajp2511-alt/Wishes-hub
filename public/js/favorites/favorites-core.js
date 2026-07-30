import { db, auth } from '../firebase-config.js';
import { FAVORITES_CONFIG } from './favorites-config.js';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Get Local Storage Favs
export function getLocalFavorites() {
  const favs = localStorage.getItem(FAVORITES_CONFIG.LOCAL_STORAGE_KEY);
  return favs ? JSON.parse(favs) : [];
}

// Get All Active Favs (Cloud / Local)
export async function getFavorites() {
  const user = auth ? auth.currentUser : null;
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, FAVORITES_CONFIG.FIRESTORE_COLLECTION, user.uid));
      return userDoc.exists() ? (userDoc.data()[FAVORITES_CONFIG.FAV_FIELD_NAME] || []) : [];
    } catch (err) {
      console.error("Firestore fetch error, fallback to local:", err);
      return getLocalFavorites();
    }
  }
  return getLocalFavorites();
}

// Toggle Favorite Logic
export async function toggleFavoriteCore(wishId) {
  const user = auth ? auth.currentUser : null;

  if (user) {
    const userRef = doc(db, FAVORITES_CONFIG.FIRESTORE_COLLECTION, user.uid);
    const userSnap = await getDoc(userRef);
    const currentFavs = userSnap.exists() ? (userSnap.data()[FAVORITES_CONFIG.FAV_FIELD_NAME] || []) : [];

    if (currentFavs.includes(wishId)) {
      await updateDoc(userRef, { [FAVORITES_CONFIG.FAV_FIELD_NAME]: arrayRemove(wishId) });
      return false; // Removed
    } else {
      await setDoc(userRef, { [FAVORITES_CONFIG.FAV_FIELD_NAME]: arrayUnion(wishId) }, { merge: true });
      return true; // Added
    }
  } else {
    let localFavs = getLocalFavorites();
    let isAdded = false;

    if (localFavs.includes(wishId)) {
      localFavs = localFavs.filter(id => id !== wishId);
    } else {
      localFavs.push(wishId);
      isAdded = true;
    }

    localStorage.setItem(FAVORITES_CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(localFavs));
    return isAdded;
  }
}

// Sync Local Favs to Account on Login
if (auth) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const localFavs = getLocalFavorites();
      if (localFavs.length > 0) {
        try {
          const userRef = doc(db, FAVORITES_CONFIG.FIRESTORE_COLLECTION, user.uid);
          await setDoc(userRef, { [FAVORITES_CONFIG.FAV_FIELD_NAME]: arrayUnion(...localFavs) }, { merge: true });
          localStorage.removeItem(FAVORITES_CONFIG.LOCAL_STORAGE_KEY);
          console.log("Local favorites synced to Firestore successfully!");
        } catch (e) {
          console.error("Sync error:", e);
        }
      }
    }
  });
  }
