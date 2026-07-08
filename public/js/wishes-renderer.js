/**
 * Wishes Hub - Content Filtering & Rendering Logic
 * Location: js/wishes-renderer.js
 */

// 1. Ek example data array (Wishes Database)
// Har ek wish ke paas uski 'category' (Main Category) aur 'subcategory' honi chahiye
const wishesDatabase = [
    {
        id: 1,
        category: "Birthday",
        subcategory: "Friend",
        text: "Baar baar din ye aaye, baar baar dil ye gaaye! Happy Birthday mere bhai! 🎂🎉"
    },
    {
        id: 2,
        category: "Love & Romance",
        subcategory: "I Love You",
        text: "Tum jo aaye ho meri zindagi me, baat hi kuch aur ban gayi hai. I Love You! ❤️"
    },
    {
        id: 3,
        category: "Good Morning",
        subcategory: "Motivational",
        text: "Nayi subah, nayi umeed! Apne sapno ke peeche bhago, safalta jhak maar ke peeche aayegi. Good Morning! ☀️"
    },
    {
        id: 4,
        category: "Birthday",
        subcategory: "Best Friend",
        text: "Happy Birthday to my partner in crime! Chal ab jaldi se treat nikaal! 🍕🎁"
    }
];

// 2. Main Filter Function (Jo tags-manager.js se call hota hai)
function filterWishesByCategory(selectedCategory) {
    const wishesContainer = document.getElementById('wishes-container');
    if (!wishesContainer) return;

    // Loading state dikhane ke liye
    wishesContainer.innerHTML = '<div class="loading">Loading wishes...</div>';

    // Agar 'All' select hai toh saari wishes, nahi toh selected category se match karne wali wishes
    const filteredData = (selectedCategory === 'All') 
        ? wishesDatabase 
        : wishesDatabase.filter(wish => wish.category === selectedCategory);

    // Filtered data ko HTML me convert karke render karna
    renderWishesHTML(filteredData);
}

// 3. UI me wishes ke cards generate karne ka function
function renderWishesHTML(wishesArray) {
    const wishesContainer = document.getElementById('wishes-container');
    if (!wishesContainer) return;

    if (wishesArray.length === 0) {
        wishesContainer.innerHTML = '<div class="no-data">Is category me abhi koi wishes nahi hain.</div>';
        return;
    }

    // Har ek wish ke liye card design generate karna
    const htmlContent = wishesArray.map(wish => `
        <div class="wish-card" data-id="${wish.id}">
            <div class="wish-tag">${wish.category}</div>
            <p class="wish-text">${wish.text}</p>
            <div class="wish-actions">
                <button class="btn-copy" onclick="copyWishText('${wish.id}')">📋 Copy</button>
                <button class="btn-share" onclick="shareWishText('${wish.id}')">📲 Share</button>
            </div>
        </div>
    `).join('');

    wishesContainer.innerHTML = htmlContent;
}

// 4. Utility Functions: Copy karne ke liye
function copyWishText(id) {
    const wish = wishesDatabase.find(w => w.id == id);
    if (wish) {
        navigator.clipboard.writeText(wish.text);
        alert("Wish copy ho gayi h bhai!");
    }
}

// Page load hote hi pehle saari ('All') wishes screen par dikhni chahiye
document.addEventListener('DOMContentLoaded', () => {
    filterWishesByCategory('All');
});
