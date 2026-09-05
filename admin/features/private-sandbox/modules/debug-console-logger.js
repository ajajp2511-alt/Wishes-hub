export function logSandboxEvent(action, type = 'INFO') {
    console.log(`[SANDBOX CONSOLE - ${type}] ${new Date().toLocaleTimeString()} : ${action}`);
}
