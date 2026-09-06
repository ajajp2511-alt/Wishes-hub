export function tripCircuitBreaker(flag) {
    flag.status = false;
    console.warn(`Circuit Breaker tripped! Auto-disabled ${flag.name} due to runtime anomalies.`);
}
