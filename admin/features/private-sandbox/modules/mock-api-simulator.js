export function simulateMockApiCall(endpoint) {
    return { status: 200, latencyMs: 42, endpoint, response: 'Mock payload synchronized successfully.' };
}
