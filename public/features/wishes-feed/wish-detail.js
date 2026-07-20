const WishDetails = {
    open(wishData) {
        const modal = document.createElement('div');
        modal.style.cssText = "position:fixed; top:20%; left:10%; width:80%; background:white; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.5);";
        modal.innerHTML = `
            <h3>${wishData.title}</h3>
            <p>${wishData.text}</p>
            <button onclick="this.parentElement.remove()">Close</button>
            <button>Share</button>
        `;
        document.body.appendChild(modal);
    }
};

export default WishDetails;
