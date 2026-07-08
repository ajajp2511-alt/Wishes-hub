// Wishes Hub - Dark Mode Feature by Patel Studio
document.addEventListener("DOMContentLoaded", () => {
    const headerActions = document.getElementById("header-actions");
    
    if (headerActions) {
        // 1. Create a beautiful toggle button
        const toggleBtn = document.createElement("button");
        toggleBtn.id = "theme-toggle-btn";
        toggleBtn.style.background = "none";
        toggleBtn.style.border = "none";
        toggleBtn.style.fontSize = "1.3rem";
        toggleBtn.style.cursor = "pointer";
        toggleBtn.style.padding = "5px 10px";
        toggleBtn.style.transition = "transform 0.2s ease";
        
        // 2. Check user's previous preference from LocalStorage
        const currentTheme = localStorage.getItem("wishes-theme") || "light";
        
        if (currentTheme === "dark") {
            document.body.classList.add("dark-theme");
            toggleBtn.innerText = "☀️"; // Sun icon for light mode option
        } else {
            toggleBtn.innerText = "🌙"; // Moon icon for dark mode option
        }
        
        // 3. Inject the button inside header-actions safely
        headerActions.appendChild(toggleBtn);
        
        // 4. Click event listener to toggle themes
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            
            let theme = "light";
            if (document.body.classList.contains("dark-theme")) {
                theme = "dark";
                toggleBtn.innerText = "☀️";
            } else {
                toggleBtn.innerText = "🌙";
            }
            
            // Save selection so it persists on page reload
            localStorage.setItem("wishes-theme", theme);
            
            // Subtle button click effect
            toggleBtn.style.transform = "scale(1.2)";
            setTimeout(() => toggleBtn.style.transform = "scale(1)", 200);
        });
    }
});
