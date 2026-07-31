import { db, auth } from '../firebase-config.js';
import { FAVORITES_CONFIG } from './favorites-config.js';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Safe Helper: Get Current User with Promise (Prevents null user on page refresh)
const getCurrentUser = () => {
  return new Promise((resolve) => {
    if (!auth) return resolve(null);
    if (auth.currentUser) return resolve(auth.currentUser);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Get Local Storage Favs
export function getLocalFavorites() {
  try {
    const key = FAVORITES_CONFIG?.LOCAL_STORAGE_KEY || 'wishes_favorites';
    const favs = localStorage.getItem(key);
    return favs ? JSON.parse(favs) : [];
  } catch (err) {
    console.error("LocalStorage access error:", err);
    return [];
  }
}

// Get All Active Favs (Cloud / Local)
export async function getFavorites() {
  const user = await getCurrentUser();

  if (user && db) {
    try {
      const collectionName = FAVORITES_CONFIG?.FIRESTORE_COLLECTION || 'user_favorites';
      const fieldName = FAVORITES_CONFIG?.FAV_FIELD_NAME || 'favorites';

      const userDoc = await getDoc(doc(db, collectionName, user.uid));
      return userDoc.exists() ? (userDoc.data()[fieldName] || []) : [];
    } catch (err) {
      console.error("Firestore fetch error, falling back to local:", err);
      return getLocalFavorites();
    }
  }

  return getLocalFavorites();
}

// Toggle Favorite Logic
export async function toggleFavoriteCore(wishId) {
  if (!wishId) return false;
  const user = await getCurrentUser();

  const collectionName = FAVORITES_CONFIG?.FIRESTORE_COLLECTION || 'user_favorites';
  const fieldName = FAVORITES_CONFIG?.FAV_FIELD_NAME || 'favorites';

  if (user && db) {
    try {
      const userRef = doc(db, collectionName, user.uid);
      const userSnap = await getDoc(userRef);
      const currentFavs = userSnap.exists() ? (userSnap.data()[fieldName] || []) : [];

      if (currentFavs.includes(wishId)) {
        await updateDoc(userRef, { [fieldName]: arrayRemove(wishId) });
        return false; // Removed
      } else {
        await setDoc(userRef, { [fieldName]: arrayUnion(wishId) }, { merge: true });
        return true; // Added
      }
    } catch (err) {
      console.error("Firestore favorite toggle failed:", err);
      throw err; // Let caller revert UI
    }
  } else {
    // Guest LocalStorage fallback
    let localFavs = getLocalFavorites();
    let isAdded = false;

    if (localFavs.includes(wishId)) {
      localFavs = localFavs.filter(id => id !== wishId);
    } else {
      localFavs.push(wishId);
      isAdded = true;
    }

    const key = FAVORITES_CONFIG?.LOCAL_STORAGE_KEY || 'wishes_favorites';
    localStorage.setItem(key, JSON.stringify(localFavs));
    return isAdded;
  }
}

// Sync Local Favs to Account on Login
if (auth) {
  onAuthStateChanged(auth, async (user) => {
    if (user && db) {
      const localFavs = getLocalFavorites();
      if (localFavs.length > 0) {
        try {
          const collectionName = FAVORITES_CONFIG?.FIRESTORE_COLLECTION || 'user_favorites';
          const fieldName = FAVORITES_CONFIG?.FAV_FIELD_NAME || 'favorites';

          const userRef = doc(db, collectionName, user.uid);
          await setDoc(userRef, { [fieldName]: arrayUnion(...localFavs) }, { merge: true });
          
          const key = FAVORITES_CONFIG?.LOCAL_STORAGE_KEY || 'wishes_favorites';
          localStorage.removeItem(key);
          console.log("✅ Local favorites synced to Firestore successfully!");
        } catch (e) {
          console.error("Sync error:", e);
        }
      }
    }
  });
}
