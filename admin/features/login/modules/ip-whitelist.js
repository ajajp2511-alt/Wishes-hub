/**
 * Wishes Hub - IP Whitelist & Geo-Fencing Module
 * Handles client IP validation and geographical access restrictions.
 */

export class IpWhitelistModule {
    constructor(customAllowedIps = [], customAllowedCountries = []) {
        // Allowed IP ranges or country codes (with defaults)
        this.allowedIps = customAllowedIps.length > 0 ? customAllowedIps : ['127.0.0.1', '192.168.1.100', '::1'];
        this.allowedCountries = customAllowedCountries.length > 0 ? customAllowedCountries : ['IN', 'US']; // ISO country codes
    }

    /**
     * Validate if current client IP / location is permitted to access the admin panel
     */
    async validateAccess() {
        try {
            // Simulating fetching client IP and Geo-location from public IP / server API
            // const response = await fetch('https://ipapi.co/json/');
            // const data = await response.json();
            
            await new Promise((resolve) => setTimeout(resolve, 400));

            const mockClientData = {
                ip: '127.0.0.1',
                country: 'IN'
            };

            const isIpAllowed = this.allowedIps.includes(mockClientData.ip);
            const isCountryAllowed = this.allowedCountries.includes(mockClientData.country);

            // Access granted if either IP matches OR Country matches (configurable based on policy)
            if (!isIpAllowed && !isCountryAllowed) {
                console.warn(`Access blocked for IP: ${mockClientData.ip} (${mockClientData.country})`);
                return {
                    allowed: false,
                    message: 'Access Restricted: Your IP address or region is not authorized to access the Admin Panel.'
                };
            }

            return { allowed: true };
        } catch (error) {
            console.error('IP Whitelist Verification Error:', error);
            
            // Fail Secure policy: Deny access if verification service throws an error
            return {
                allowed: false,
                message: 'Access Restricted: Unable to verify security compliance for your network.'
            };
        }
    }

    /**
     * Dynamically add an IP to the whitelist
     */
    addAllowedIp(ip) {
        if (ip && !this.allowedIps.includes(ip)) {
            this.allowedIps.push(ip);
        }
    }

    /**
     * Dynamically add a country code to the whitelist
     */
    addAllowedCountry(countryCode) {
        if (countryCode && !this.allowedCountries.includes(countryCode.toUpperCase())) {
            this.allowedCountries.push(countryCode.toUpperCase());
        }
    }
}
