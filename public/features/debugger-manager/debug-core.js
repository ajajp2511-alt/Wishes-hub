const DebugCore = {
    init() {
        const debugBox = document.createElement('div');
        debugBox.id = 'debug-console';
        debugBox.style = "position:fixed; bottom:0; left:0; width:100%; background:black; color:lime; font-size:12px; padding:10px; z-index:9999; max-height:200px; overflow-y:scroll;";
        document.body.appendChild(debugBox);

        // Errors ko capture karna
        window.onerror = (msg, url, line) => {
            debugBox.innerHTML += `<p>Error: ${msg} at line ${line}</p>`;
        };
        
        console.log = (msg) => {
            debugBox.innerHTML += `<p>> ${msg}</p>`;
        };
    }
};
export default DebugCore;
