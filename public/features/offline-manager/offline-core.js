const OfflineCore = {
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(() => console.log("Offline: Service Worker Registered."))
                    .catch(err => console.error("Offline: SW failed", err));
            });
        }
    }
};

export default OfflineCore;
