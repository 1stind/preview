/**
 * Dark mode toggle — persists preference in localStorage.
 * Adds/removes the `dark` class on <html>, matching Tailwind's `darkMode: 'class'`.
 */
(function () {
  var STORAGE_KEY = 'theme';
  var DARK_CLASS = 'dark';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    var html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add(DARK_CLASS);
    } else {
      html.classList.remove(DARK_CLASS);
    }
  }

  function getPreferredTheme() {
    var stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function initToggle(button) {
    if (!button) return;

    // Set initial state
    var theme = getPreferredTheme();
    applyTheme(theme);
    updateButtonAria(button, theme);

    button.addEventListener('click', function () {
      var html = document.documentElement;
      var isDark = html.classList.contains(DARK_CLASS);
      var newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch (e) {
        // ignore
      }
      updateButtonAria(button, newTheme);
    });
  }

  function updateButtonAria(button, theme) {
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('aria-checked', theme === 'dark');
  }

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('theme-toggle');
    initToggle(toggle);
  });

  // Also expose for manual init if needed
  window.initThemeToggle = initToggle;
})();
