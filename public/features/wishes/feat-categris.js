// Wishes Hub: Dynamic Category Filter System
// Patel Studio - 2026

let activeCategory = "All"; // By default sabhi wishes dikhengi

function loadCategories() {
    console.log("Categories: Rendering Navigation Bar...");
    const categoryBar = document.getElementById('category-bar');
    
    if (!categoryBar) {
        console.warn("category-bar element nahi mila HTML me.");
        return;
    }

    if (typeof categoriesConfig === 'undefined') {
        console.error("categoriesConfig data load nahi hua! Path check karein.");
        return;
    }

    // 1. Sabse pehle ek "All" button banayenge saari wishes dikhane ke liye
    categoryBar.innerHTML = '';
    
    const allButton = document.createElement('button');
    allButton.innerText = "✨ All Wishes";
    styleCategoryButton(allButton, true); // Active style
    allButton.onclick = () => filterWishesByCategory("All", allButton);
    categoryBar.appendChild(allButton);

    // 2. Loop chalakar categoriesConfig ki saari main categories ke buttons banana
    Object.keys(categoriesConfig).forEach(categoryName => {
        const btn = document.createElement('button');
        btn.innerText = categoryName;
        styleCategoryButton(btn, false); // Default passive style
        btn.onclick = () => filterWishesByCategory(categoryName, btn);
        categoryBar.appendChild(btn);
    });
}

// Buttons ko Patel Studio Neon Theme dene ke liye styling function
function styleCategoryButton(button, isActive) {
    button.style.cssText = `
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid ${isActive ? '#00f2ff' : '#444'};
        background: ${isActive ? 'rgba(0, 242, 255, 0.1)' : '#222'};
        color: ${isActive ? '#00f2ff' : '#ccc'};
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    `;
}

// Click karne par filter karne wala core logic
function filterWishesByCategory(categoryName, clickedButton) {
    activeCategory = categoryName;
    console.log(`Filtering UI by Category: ${categoryName}`);

    // Saare buttons ke style ko reset karna aur clicked waale ko active karna
    const allButtons = document.querySelectorAll('#category-bar button');
    allButtons.forEach(btn => styleCategoryButton(btn, false));
    styleCategoryButton(clickedButton, true);

    // Frontend cards ko live filter karna
    const cards = document.querySelectorAll('.wish-card');
    cards.forEach(card => {
        // Card ke andar jo category text likha hai use check karna
        const cardCategoryTag = card.querySelector('span');
        if (!cardCategoryTag) return;

        const cardCategory = cardCategoryTag.innerText.trim();

        if (categoryName === "All" || cardCategory === categoryName) {
            card.style.display = "flex"; // Show card
        } else {
            card.style.display = "none"; // Hide card
        }
    });
}
