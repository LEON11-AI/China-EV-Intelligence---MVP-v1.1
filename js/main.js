document.addEventListener('DOMContentLoaded', () => {
    // This variable will be accessible by other scripts on the page
    window.currentLang = localStorage.getItem('volt-china-lang') || 'en';

    // Make the main translation function globally accessible
    window.setLanguage = (lang) => {
        if (!translations[lang]) {
            console.error(`Language "${lang}" not found in translations.`);
            return;
        }

        window.currentLang = lang;
        localStorage.setItem('volt-china-lang', lang);

        // Update all static elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update the lang attribute of the html tag
        document.documentElement.lang = lang;

        // Update page title
        const pageKey = document.body.dataset.pageKey;
        if (pageKey && translations[lang][pageKey]) {
            document.title = translations[lang][pageKey];
        }
        
        // Dispatch a custom event to notify other scripts (like our database script)
        // that the language has changed.
        document.dispatchEvent(new CustomEvent('languageUpdated', { 
            detail: { lang: lang, translations: translations[lang] } 
        }));
    };

    // Find the language toggle button and set its event listener
    const langToggleButton = document.querySelector('.lang-toggle');
    if(langToggleButton) {
        langToggleButton.addEventListener('click', () => {
            const newLang = window.currentLang === 'en' ? 'zh-Hant' : 'en';
            window.setLanguage(newLang);
        });
    }

    // Set the initial language on page load
    window.setLanguage(window.currentLang);
});