export function generateMarkdownChangelog(core) {
    const active = core.getFeatureFlags().filter(f => f.status).map(f => `- ${f.name} (${f.category})`).join('\n');
    return `### Wishes Hub Release Notes\n\n**Active Modules:**\n${active}`;
}
