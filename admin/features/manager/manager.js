// admin/features/manager/manager.js

window.renderManagerModule = function(container) {
    container.innerHTML = `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>📋 Manage Published Wishes</h2>
                <p>View, edit, or delete wishes from the Wishes Hub database.</p>
            </div>
            
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Message</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="wishesTableBody">
                    <tr><td colspan="3" style="text-align:center;">Loading wishes...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    // Firebase se data fetch karne ka function
    fetchWishesData();
};

async function fetchWishesData() {
    const tbody = document.getElementById("wishesTableBody");
    
    // Yahan hum API call karenge jo Firebase se data layegi
    try {
        const response = await fetch('/api/get-wishes'); 
        const wishes = await response.json(); // Array of wishes

        tbody.innerHTML = "";
        wishes.forEach(wish => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${wish.mainCategory}</td>
                <td>${wish.wishText.substring(0, 30)}...</td>
                <td>
                    <button class="edit-btn" onclick="editWish('${wish.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteWish('${wish.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="3">Failed to load data.</td></tr>`;
    }
  }
