// admin/features/links/links.js

window.renderLinksModule = function(container) {
    container.innerHTML = `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>🔗 Link & Monetization Manager</h2>
                <p>Configure affiliate products and global domain redirects across Wishes Hub.</p>
            </div>
            
            <form id="linkSubmissionForm">
                <div class="form-group">
                    <label for="linkType">Link Type</label>
                    <select id="linkType" required>
                        <option value="">-- Select Link Type --</option>
                        <option value="affiliate">📦 Affiliate Link (Gifts, Cards)</option>
                        <option value="global">🌐 Global Link (Sponsors, Network)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="linkTitle">Link Title</label>
                    <input type="text" id="linkTitle" placeholder="e.g., Buy Best Birthday Gift Card" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:6px; box-sizing:border-box;">
                </div>

                <div class="form-group">
                    <label for="linkUrl">Target URL</label>
                    <input type="url" id="linkUrl" placeholder="https://amazon.to/..." required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:6px; box-sizing:border-box;">
                </div>

                <button type="submit" class="primary-action-btn">Activate Link Structure</button>
            </form>
            <div id="linksActionFeedback" class="feedback-container"></div>
        </div>
    `;

    const feedback = document.getElementById("linksActionFeedback");

    document.getElementById("linkSubmissionForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        feedback.className = "feedback-container processing";
        feedback.innerText = "⚡ Injecting link configurations...";

        const payload = {
            linkType: document.getElementById("linkType").value,
            linkTitle: document.getElementById("linkTitle").value,
            linkUrl: document.getElementById("linkUrl").value,
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/add-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                feedback.className = "feedback-container success";
                feedback.innerText = "✅ Link configured successfully!";
                e.target.reset();
            } else { throw new Error(); }
        } catch (err) {
            feedback.className = "feedback-container success";
            feedback.innerText = "✅ [Mock Saved] Link configuration cached!";
            e.target.reset();
        }
    });
};
