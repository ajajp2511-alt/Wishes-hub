export function getGeoblockHtmlMessage(lang = 'en') {
    const notices = {
        'en': 'Wishes Hub is currently not available in your region due to regulatory compliance policies.',
        'es': 'Wishes Hub no está disponible actualmente en su región debido a políticas de cumplimiento.',
        'zh': '由于合规政策，Wishes Hub 目前在您的地区不可用。'
    };
    return notices[lang] || notices['en'];
}
