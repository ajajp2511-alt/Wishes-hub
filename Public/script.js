let allPosts = [], brandLogoId = "";

// 1. Admin: Dynamic Sub-categories
window.updateSubCatOptions = (cat) => {
    const sub = document.getElementById('wSubCat');
    const options = {
        'Birthday': ['General', 'Brother', 'Sister', 'Friend', 'Mom/Dad'],
        'Love': ['Romantic', 'Girlfriend', 'Boyfriend', 'Wife/Husband'],
        'Shayari': ['Sad', 'Attitude', 'Motivation', 'Love Shayari']
    };
    sub.innerHTML = options[cat].map(s => `<option value="${s}">${s}</option>`).join('');
};

// 2. User: Category Filtering
window.filterData = (cat, element) => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    const filtered = (cat === 'All') ? allPosts : allPosts.filter(p => p.category === cat);
    renderPosts(filtered);
};

// 3. User: Live Style Engine
window.updateStyle = (id) => {
    const font = document.getElementById(`font-${id}`).value;
    const color = document.getElementById(`color-${id}`).value;
    const target = document.getElementById(`text-area-${id}`);
    target.style.fontFamily = font;
    target.style.color = color;
};

// 4. Render Engine (Branded + Quality + Style)
function renderPosts(data) {
    const watermarkUrl = brandLogoId ? `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${brandLogoId}` : '';
    
    document.getElementById('mainGrid').innerHTML = data.map(d => {
        const postImg = `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${d.telegram_id}`;
        return `
        <div class="card">
            <div id="capture-${d.id}" class="capture-area">
                <img src="${postImg}" class="card-img" crossorigin="anonymous">
                ${watermarkUrl ? `<img src="${watermarkUrl}" class="watermark-style">` : ''}
                <div class="card-body">
                    <span class="badge">${d.category} > ${d.subCategory || 'General'}</span>
                    <p id="text-area-${d.id}" class="font-preview">${d.text}</p>
                </div>
            </div>
            <div class="card-actions">
                <div class="style-bar">
                    <select id="font-${d.id}" onchange="updateStyle('${d.id}')">
                        <option value="sans-serif">Default Font</option>
                        <option value="'Dancing Script', cursive">Elegant</option>
                        <option value="'Pacifico', cursive">Retro</option>
                        <option value="'Montserrat', sans-serif">Modern</option>
                    </select>
                    <input type="color" id="color-${d.id}" onchange="updateStyle('${d.id}')" value="#2d3436">
                </div>
                <select id="quality-${d.id}" class="quality-select">
                    <option value="1">Standard</option>
                    <option value="2">High HD</option>
                    <option value="4">Ultra 4K</option>
                </select>
                <button onclick="downloadBranded('${d.id}')" class="btn-main">📥 Download Branded</button>
            </div>
        </div>`;
    }).join('');
}

// 5. High-Resolution Download
window.downloadBranded = (id) => {
    const scale = document.getElementById(`quality-${id}`).value;
    html2canvas(document.getElementById(`capture-${id}`), { 
        useCORS: true, 
        scale: parseInt(scale) 
    }).then(canvas => {
        let a = document.createElement('a');
        a.download = `WishesHub-${id}.png`;
        a.href = canvas.toDataURL("image/png", 1.0);
        a.click();
    });
};
