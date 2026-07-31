import { FAVORITES_CONFIG } from './favorites-config.js';

// Safe Dynamic Firebase Resolver (Prevents Module Crash if Firebase file/SDK fails)
async function getFirebaseInstances() {
  try {
    const firebaseModule = await import('../firebase-config.js');
    return {
      db: firebaseModule.db || null,
      auth: firebaseModule.auth || null
    };
  } catch (err) {
    console.warn("⚠️ Firebase Config unavailable, operating in LocalStorage mode:", err.message);
    return { db: null, auth: null };
  }
}

// Safe Helper: Get Current User with Promise
const getCurrentUser = async () => {
  const { auth } = await getFirebaseInstances();
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve) => {
    import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js')
      .then(({ onAuthStateChanged }) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      })
      .catch(() => resolve(null));
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
  const { db } = await getFirebaseInstances();

  if (user && db) {
    try {
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
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
  const { db } = await getFirebaseInstances();

  const collectionName = FAVORITES_CONFIG?.FIRESTORE_COLLECTION || 'user_favorites';
  const fieldName = FAVORITES_CONFIG?.FAV_FIELD_NAME || 'favorites';

  if (user && db) {
    try {
      const { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
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
      console.error("Firestore favorite toggle failed, falling back to local:", err);
    }
  }

  // Guest / Fallback LocalStorage logic
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

// Safe Sync Local Favs to Account on Login
getFirebaseInstances().then(({ auth }) => {
  if (auth) {
    import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js')
      .then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, async (user) => {
          const { db } = await getFirebaseInstances();
          if (user && db) {
            const localFavs = getLocalFavorites();
            if (localFavs.length > 0) {
              try {
                const { doc, setDoc, arrayUnion } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
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
      })
      .catch(() => {});
  }
});
