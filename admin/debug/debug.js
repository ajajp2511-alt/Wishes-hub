// Wishes Hub: Debugger Logic Engine
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Path Tester Logic
    const pathRes = document.getElementById('path-results');
    if (pathRes) {
        pathRes.innerHTML = `
            • Browser URL Path: <span class="warn">${window.location.pathname}</span><br>
            • Is inside 'debug' folder?: ${window.location.pathname.includes('/debug/') ? '<span class="success">Yes (Correct)</span>' : '<span class="error">No (Check Folder Structure)</span>'}<br>
            • Expected Dashboard Path: <span class="warn">/admin/index.html</span>
        `;
    }

    // 2. Storage Tester Logic
    const storageRes = document.getElementById('storage-results');
    if (storageRes) {
        try {
            localStorage.setItem('debug_test', 'working');
            const val = localStorage.getItem('debug_test');
            localStorage.removeItem('debug_test');
            
            if (val === 'working') {
                const loginStatus = localStorage.getItem('isAdminLoggedIn') === 'true' ? 'Logged In' : 'Logged Out';
                storageRes.innerHTML = `<span class="success">✅ LocalStorage handles properly!</span><br>• Current Admin Session Status: <b>${loginStatus}</b>`;
            } else {
                storageRes.innerHTML = `<span class="error">🚨 LocalStorage reading failed!</span>`;
            }
        } catch (e) {
            storageRes.innerHTML = `<span class="error">🚨 Storage Blocked: Cookies/LocalStorage disabled hain browser me!</span>`;
        }
    }

    // 3. Live API Tester Logic
    const testBtn = document.getElementById('run-api-test');
    if (testBtn) {
        testBtn.addEventListener('click', async () => {
            const apiRes = document.getElementById('api-results');
            const pwd = document.getElementById('test-password').value;
            
            if (!apiRes) return;
            apiRes.innerText = "⏳ Request bheji ja rahi hai...";
            
            try {
                const start = performance.now();
                const response = await fetch('/api/verify-pass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: pwd })
                });
                const end = performance.now();
                
                let data;
                try {
                    data = await response.json();
                } catch (jsonErr) {
                    data = "Response JSON nahi hai (Server crash ya galat route)!";
                }

                apiRes.innerHTML = `
Status Code : <span class="${response.status === 200 ? 'success' : 'error'}">${response.status}</span>
Time Taken  : ${Math.round(end - start)}ms
Server Reply: ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}

${response.status === 404 ? '<span class="error">🚨 ERROR 404: /api/verify-pass URL backend me nahi mili! Path galat hai ya backend running nahi hai.</span>' : ''}
${response.status === 200 ? '<span class="success">🎉 SUCCESS: Connection perfectly working! Redirect login check kijiye.</span>' : ''}
                `;
            } catch (err) {
                apiRes.innerHTML = `<span class="error">🚨 FETCH FAILED: Network Error! Network connect nahi ho paya.\nDetails: ${err.message}</span>\n\n<b>Sujhav:</b> Agar aap bina kisi Node.js ya dusre Backend server ke GitHub Pages jaisi static hosting use kar rahe hain, toh API work nahi karegi.`;
            }
        });
    }
});
