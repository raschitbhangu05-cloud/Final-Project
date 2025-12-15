(function () {
  const key = 'siteTheme'; 
  const checkboxId = 'themeToggle';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(key, theme); } catch (e) {}
  }

  function init() {
    let theme = 'dark';
    try {
      const stored = localStorage.getItem(key);
      if (stored === 'light' || stored === 'dark') theme = stored;
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
    } catch (e) {}

    applyTheme(theme);

    const toggle = document.getElementById(checkboxId);
    if (toggle) {
      toggle.checked = theme === 'light';
      toggle.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'light' : 'dark';
        applyTheme(newTheme);
        saveTheme(newTheme);
      });
    }

    if (document.querySelector('.theme-control')) {
      document.body.classList.add('has-theme-control');
    }

    window.__siteTheme = { get: () => (document.body.classList.contains('theme-light') ? 'light' : 'dark'), set: (t) => { applyTheme(t); saveTheme(t); } };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
