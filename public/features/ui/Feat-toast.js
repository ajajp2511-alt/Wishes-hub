// Feature: Professional Toast Notifications
window.showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    // 3 second baad apne aap hat jaye
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};
