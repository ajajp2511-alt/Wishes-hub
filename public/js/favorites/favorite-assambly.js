import { toggleFavoriteCore, getFavorites } from './favorites-core.js';

export function assembleFavorites() {
  // Global Event Listener for Heart Button
  document.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (!favBtn) return;

    const wishId = favBtn.dataset.wishId;
    if (!wishId) return;

    // Fast UI Toggle Animation
    favBtn.classList.toggle('active');

    // Save Logic
    const isFav = await toggleFavoriteCore(wishId);
    
    if (isFav) {
      favBtn.classList.add('active');
    } else {
      favBtn.classList.remove('active');
    }
  });
}

// Sync UI Heart States on Page Load
export async function syncFavoritesUI() {
  const activeFavs = await getFavorites();
  const allFavBtns = document.querySelectorAll('.fav-btn');

  allFavBtns.forEach(btn => {
    const wishId = btn.dataset.wishId;
    if (activeFavs.includes(wishId)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
