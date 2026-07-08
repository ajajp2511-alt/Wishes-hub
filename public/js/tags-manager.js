/**
 * Wishes Hub - Main Categories Chips Generator
 * Location: js/tags-manager.js
 * Source: admin/features/wishes/category-data.js
 */

function renderMainCategoryChips() {
    const chipsContainer = document.getElementById('static-chips-container');
    if (!chipsContainer) return;

    // 1. 'All' chip default active rahega
    let htmlContent = `<span class="chip active" onclick="selectMainCategory('All')">All</span>`;

    // 2. Agar config file loaded hai, toh sirf uski Main Categories ke chips banenge
    if (typeof categoriesConfig !== 'undefined' && categoriesConfig !== null) {
        
        // Object.keys se direct mukhya naam ("Birthday", "Anniversary" etc.) milenge
        const mainCategories = Object.keys(categoriesConfig);

        htmlContent += mainCategories.map(categoryName => `
            <span class="chip" onclick="selectMainCategory('${categoryName}')">
                ${categoryName}
            </span>
        `).join('');
    }

    // Container me HTML set karna
    chipsContainer.innerHTML = htmlContent;
}

// Chip select hone par active state handle karne ke liye
function selectMainCategory(categoryName) {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => chip.classList.remove('active'));

    // Jo click hua usko active karo
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }

    console.log("Selected Category: " + categoryName);

    // 🔄 Yeh function aage wishes feed/content filter karne ke kaam aayega
    if (typeof filterWishesByCategory === 'function') {
        filterWishesByCategory(categoryName);
    }
}

// DOM load hote hi run karega
document.addEventListener('DOMContentLoaded', renderMainCategoryChips);
