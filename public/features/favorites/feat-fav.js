// Feature: Heart/Save Wish Logic
window.toggleFavorite = (wishId) => {
    let favorites = JSON.parse(localStorage.getItem('myFavs')) || [];
    
    if (favorites.includes(wishId)) {
        favorites = favorites.filter(id => id !== wishId); // Remove if exists
        document.getElementById(`fav-${wishId}`).classList.remove('active');
    } else {
        favorites.push(wishId); // Add new
        document.getElementById(`fav-${wishId}`).classList.add('active');
    }
    
    localStorage.setItem('myFavs', JSON.stringify(favorites));
};

// Sirf favorite wishes dikhane ka logic
window.showOnlyFavs = () => {
    const favorites = JSON.parse(localStorage.getItem('myFavs')) || [];
    const favData = allWishes.filter(wish => favorites.includes(wish.id));
    renderWishes(favData);
};
