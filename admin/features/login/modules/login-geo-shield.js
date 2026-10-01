/**
 * Login - Geo-Velocity Shield Sub-Module
 * Detects impossible travel speeds or suspicious remote IP changes.
 */

export class LoginGeoShield {
    static verifyGeoVelocity(lastLoginLocation, currentLoginLocation) {
        if (!lastLoginLocation || !currentLoginLocation) return { suspicious: false };

        // Mock distance & time delta calculation
        const timeDeltaHours = (Date.now() - lastLoginLocation.timestamp) / (1000 * 60 * 60);
        const assumedSpeedKmH = 900; // Average commercial flight speed
        const mockDistanceKm = lastLoginLocation.country !== currentLoginLocation.country ? 3000 : 50;

        const maxPossibleDistance = timeDeltaHours * assumedSpeedKmH;

        if (mockDistanceKm > maxPossibleDistance && timeDeltaHours < 5) {
            return {
                suspicious: true,
                reason: 'Impossible travel speed detected between consecutive logins.'
            };
        }

        return { suspicious: false };
    }
          }
