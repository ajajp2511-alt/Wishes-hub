// Feature: Global App Config
const AppConfig = {
    brandName: "Wishes Hub",
    studioName: "Patel Studio",
    categories: ["Birthday", "Anniversary", "Love", "Shayari", "Success"],
    exportQuality: 3, // 1=Normal, 2=HD, 3=4K
    watermarkEnabled: true
};

// Ise pure project mein export karke use karein
window.AppConfig = AppConfig;
