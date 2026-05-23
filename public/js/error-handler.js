// Feature: Global Error Catcher
window.onerror = function(msg, url, line) {
    console.error(`Error: ${msg} at ${line}`);
    showToast("Kuch galat hua! Please refresh karein.", "error");
    return true;
};

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
    document.body.innerHTML = "<h2 style='color:white; text-align:center;'>Firebase Load Nahi Hua! Internet check karein.</h2>";
}
