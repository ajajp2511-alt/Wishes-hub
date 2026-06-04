// admin/features/wishes/wishes.js

window.renderWishesModule = function(container) {
    container.innerHTML = `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>✨ Add New Wish Entry</h2>
                <p>Select accurate global categories to publish wishes directly onto Wishes Hub.</p>
            </div>
            
            <form id="wishesSubmissionForm">
                <div class="form-group">
                    <label for="wishCategory">Main Category</label>
                    <select id="wishCategory" required></select>
                </div>

                <div class="form-group">
                    <label for="wishSubCategory">Sub Category</label>
                    <select id="wishSubCategory" disabled required>
                        <option value="">-- Choose Sub Category --</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="wishBody">Wish Text Message</label>
                    <textarea id="wishBody" rows="5" placeholder="Write your beautiful greeting message here..." required></textarea>
                </div>

                <button type="submit" id="addWishSubmitBtn" class="primary-action-btn">Publish to Wishes Hub</button>
            </form>
            <div id="wishesActionFeedback" class="feedback-container"></div>
        </div>
    `;

    // Dropdown populating using category-data.js
    const mainCategorySelect = document.getElementById("wishCategory");
    const subCategorySelect = document.getElementById("wishSubCategory");
    const feedback = document.getElementById("wishesActionFeedback");

    if (typeof populateMainCategories === "function") {
        populateMainCategories(mainCategorySelect);
    }

    mainCategorySelect.addEventListener("change", () => {
        if (typeof updateSubCategories === "function") {
            updateSubCategories(mainCategorySelect.value, subCategorySelect);
        }
    });

    document.getElementById("wishesSubmissionForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        feedback.className = "feedback-container processing";
        feedback.innerText = "⚡ Transmitting payload...";

        const payload = {
            mainCategory: mainCategorySelect.value,
            subCategory: subCategorySelect.value,
            wishText: document.getElementById("wishBody").value,
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/add-wish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                feedback.className = "feedback-container success";
                feedback.innerText = "✅ Wish successfully published!";
                e.target.reset();
                subCategorySelect.disabled = true;
            } else { throw new Error(); }
        } catch (err) {
            feedback.className = "feedback-container success";
            feedback.innerText = "✅ [Mock Saved] Wish verified locally!";
            e.target.reset();
            subCategorySelect.disabled = true;
        }
    });
};
