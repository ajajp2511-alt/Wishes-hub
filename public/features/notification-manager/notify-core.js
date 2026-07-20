const NotifyCore = {
    init() {
        console.log("NotificationManager: Ready.");
    },

    // UI par chota toast message dikhane ke liye
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:#333; color:#fff; padding:10px; border-radius:5px;";
        toast.innerText = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
};

export default NotifyCore;
