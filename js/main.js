let currentLang = localStorage.getItem('volt-china-lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('volt-china-lang', lang);
    const trans = translations[lang] || translations['en'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (trans[key]) {
            el.textContent = trans[key];
        }
    });
    document.documentElement.lang = lang;
    
    const pageKey = document.body.dataset.pageKey;
    if (pageKey && trans[pageKey]) {
        document.title = trans[pageKey];
    }
    document.dispatchEvent(new CustomEvent('languageUpdated', { detail: { lang: currentLang, translations: trans } }));
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'zh-Hant' : 'en';
            setLanguage(newLang);
        });
    });
    setLanguage(currentLang);
});