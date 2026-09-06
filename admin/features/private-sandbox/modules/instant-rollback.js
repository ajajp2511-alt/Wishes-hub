export function performInstantRollback(core) {
    core.featureFlags.forEach(f => f.status = true);
    return true;
}
