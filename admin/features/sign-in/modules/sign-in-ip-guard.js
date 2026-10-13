/**
 * Admin Sign-In Module - IP & Device Guard
 * Verifies if the admin attempt comes from an authorized IP network and recognized device fingerprint.
 */

export class SignInIpGuard {
    static getDeviceFingerprint() {
        const userAgent = navigator.userAgent;
        const screenRes = `${window.screen.width}x${window.screen.height}`;
        const lang = navigator.language;
        return btoa(`${userAgent}|${screenRes}|${lang}`);
    }

    static async verifyAccessEnvironment(adminData) {
        try {
            const currentDeviceFp = this.getDeviceFingerprint();

            // Mock verification (Replace with backend IP lookup and whitelisted IP checks)
            const trustedDevices = adminData?.trustedDevices || [];
            const isDeviceRecognized = trustedDevices.includes(currentDeviceFp);

            return {
                isAllowed: true, // Set strictly to true or check against whitelisted subnet
                deviceFingerprint: currentDeviceFp,
                isNewDevice: !isDeviceRecognized,
                warning: !isDeviceRecognized ? 'Naye device se login try kiya gaya hai.' : null
            };
        } catch (err) {
            return { isAllowed: false, error: 'Environment check failed: ' + err.message };
        }
    }
}
