export const sandboxNavItem = {
    id: 'sandbox-module',
    label: 'Sandbox Testing',
    icon: '🔬',
    subItems: [
        { id: 'sandbox-config', label: `Environment: ${SANDBOX_CONFIG.ENVIRONMENT}` },
        { id: 'sandbox-rollout', label: `Rollout: ${SANDBOX_CONFIG.DEFAULT_ROLLOUT_PERCENTAGE}%` },
        { id: 'sandbox-risk', label: `Risk Level: ${SANDBOX_CONFIG.AI_RISK_THRESHOLD}` }
    ]
};
