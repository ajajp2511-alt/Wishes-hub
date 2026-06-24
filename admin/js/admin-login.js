// Is file me baki sab same rahega, bas redirect ka path yeh update hoga:
if (response.status === 200) {
    if (statusText) statusText.innerText = "🔑 Success! Redirecting...";
    localStorage.setItem('isAdminLoggedIn', 'true');

    // Redirect to root index.html
    setTimeout(() => {
        window.location.href = "/admin/index.html";
    }, 500);
}
