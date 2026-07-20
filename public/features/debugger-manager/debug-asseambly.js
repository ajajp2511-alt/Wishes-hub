export default function initDebugger() {
    window.onerror = function(msg, url, line) {
        console.error("DEBUGGER CAUGHT:", msg, "at", line);
        // Mobile screen par error show karne ke liye
        const div = document.createElement('div');
        div.style.cssText = "position:fixed; bottom:0; background:red; color:white; width:100%; padding:10px;";
        div.innerHTML = "Error: " + msg;
        document.body.appendChild(div);
    };
}
