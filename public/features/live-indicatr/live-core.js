const LiveCore = {
    render() {
        const header = document.querySelector('header') || document.body;
        const indicator = document.createElement('div');
        indicator.style.cssText = "position:absolute; top:10px; right:10px; color:green; font-weight:bold;";
        indicator.innerHTML = "● Live";
        header.appendChild(indicator);
    }
};

export default LiveCore;
