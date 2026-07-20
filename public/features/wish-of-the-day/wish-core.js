const WishCore = {
    render() {
        const textElement = document.getElementById('daily-wish-text');
        if (!textElement) return;

        // Abhi ke liye hardcoded data, baad mein fetch() use kar sakte hain
        const data = { 
            "text": "Aaj ka din aapke liye khushiyon aur safalta se bhara ho!", 
            "author": "Wishes-hub Team" 
        };

        textElement.innerHTML = `
            <p>"${data.text}"</p>
            <small>— ${data.author}</small>
        `;
    }
};
export default WishCore;
