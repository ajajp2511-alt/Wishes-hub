let isFavoritesInitialized = false;

export function assembleFavorites() {
  // Prevent duplicate listener registration
  if (isFavoritesInitialized) return;
  isFavoritesInitialized = true;

  // Global Event Listener (Event Delegation)
  document.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (!favBtn) return;

    const wishId = favBtn.dataset.wishId;
    if (!wishId) return;

    // Optimistic UI Update (Instant response)
    const wasActive = favBtn.classList.contains('active');
    favBtn.classList.toggle('active');

    try {
      // SAFE FIX: Dynamic import so top-level load never fails
      const { toggleFavoriteCore } = await import('./favorites-core.js');
      
      if (typeof toggleFavoriteCore === 'function') {
        const isFav = await toggleFavoriteCore(wishId);
        
        // Ensure UI stays in sync with actual result
        if (isFav) {
          favBtn.classList.add('active');
        } else {
          favBtn.classList.remove('active');
        }
      }
    } catch (err) {
      console.error("Favorite toggle failed, reverting UI:", err);
      // Revert back if network/storage failed
      favBtn.classList.toggle('active', wasActive);
    }
  });
}

// Sync UI Heart States on Page Load or Card Render
export async function syncFavoritesUI() {
  try {
    // SAFE FIX: Dynamic import for core logic
    const { getFavorites } = await import('./favorites-core.js');
    
    if (typeof getFavorites !== 'function') return;

    const activeFavs = await getFavorites();
    const allFavBtns = document.querySelectorAll('.fav-btn');

    if (!allFavBtns.length) return;

    allFavBtns.forEach(btn => {
      const wishId = btn.dataset.wishId;
      // SAFE FIX: Optional chaining Array.isArray check (null pointer safety)
      if (Array.isArray(activeFavs) && activeFavs.includes(wishId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  } catch (err) {
    console.warn("Could not sync favorites UI:", err.message);
  }
}
