document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const html = document.documentElement;

    const increaseFontButton = document.getElementById('btn-increase-font');
    const decreaseFontButton = document.getElementById('btn-decrease-font');
    const themeButtons = document.querySelectorAll('.theme-button');

    const accessibilityContainer = document.querySelector('.accessibility-container');
    const triggerButton = document.getElementById('accessibility-trigger-btn');
    const optionsPanel = document.getElementById('accessibility-options-panel');

    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 24;

    // chave -> classe no body
    const THEMES = {
        'default': '',
        'high-contrast': 'theme-high-contrast',
        'protanopia': 'theme-protanopia',
        'deuteranopia': 'theme-deuteranopia',
        'tritanopia': 'theme-tritanopia'
    };

    function clearAllThemeClasses() {
        Object.values(THEMES).forEach(cls => {
            if (cls) body.classList.remove(cls);
        });
    }

    function setThemeByKey(themeKey) {
        if (!THEMES.hasOwnProperty(themeKey)) themeKey = 'default';
        clearAllThemeClasses();
        const cls = THEMES[themeKey];
        console.log(`Aplicando classe: ${cls}`); // Log para depuração
        if (cls) body.classList.add(cls);
        localStorage.setItem('colorTheme', themeKey);
        updateActiveButton(themeKey);
    }

    function updateActiveButton(activeKey) {
        themeButtons.forEach(btn => {
            const btnKey = btn.dataset.theme || btn.id.replace('btn-theme-', '');
            if (btnKey === activeKey) btn.classList.add('active'); else btn.classList.remove('active');
        });
    }

    // evento: cada botão aplica o tema correspondente
    themeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const key = btn.dataset.theme || btn.id.replace('btn-theme-', '');
            setThemeByKey(key);
            // manter o painel aberto para o usuário ajustar outras opções
        });
    });

    // Font size handlers
    function changeFontSize(amount) {
        const currentSize = parseFloat(getComputedStyle(html).fontSize);
        const newSize = currentSize + amount;
        if (newSize >= MIN_FONT_SIZE && newSize <= MAX_FONT_SIZE) {
            html.style.fontSize = `${newSize}px`;
            localStorage.setItem('fontSize', newSize);
        }
    }
    if (increaseFontButton) increaseFontButton.addEventListener('click', () => changeFontSize(1));
    if (decreaseFontButton) decreaseFontButton.addEventListener('click', () => changeFontSize(-1));

    // Toggle painel
    function toggleAccessibilityPanel() {
        const isHidden = optionsPanel.classList.toggle('is-hidden');
        optionsPanel.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
        triggerButton.setAttribute('aria-expanded', (!isHidden).toString());
    }

    triggerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAccessibilityPanel();
    });

    // fechar clicando fora
    document.addEventListener('click', (event) => {
        if (!optionsPanel.classList.contains('is-hidden') && !accessibilityContainer.contains(event.target)) {
            optionsPanel.classList.add('is-hidden');
            optionsPanel.setAttribute('aria-hidden', 'true');
            triggerButton.setAttribute('aria-expanded', 'false');
        }
    });

    // fechar com ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape" && !optionsPanel.classList.contains('is-hidden')) {
            optionsPanel.classList.add('is-hidden');
            optionsPanel.setAttribute('aria-hidden', 'true');
            triggerButton.setAttribute('aria-expanded', 'false');
        }
    });

    // Carregar preferências salvas
    function loadPreferences() {
        const savedTheme = localStorage.getItem('colorTheme') || 'default';
        setThemeByKey(savedTheme);
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) html.style.fontSize = `${savedFontSize}px`;
    }
    loadPreferences();
});
