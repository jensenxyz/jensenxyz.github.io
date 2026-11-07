/*
 * Light / dark theme, plus the header language menu.
 * Load synchronously in <head> (before the stylesheet paints) so the saved
 * theme is applied before first render and the page never flashes.
 *   <script src="/theme.js"></script>
 * Default: follow the device setting. A click on any .theme-toggle button
 * switches theme and remembers the choice in localStorage.
 * Only pages that include this script get dark mode (data-theme attribute);
 * pages without it always render in light mode.
 */
(function () {
    var root = document.documentElement;
    var KEY = 'theme';
    var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function saved() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    var TITLES = {
        en: ['Switch to dark mode', 'Switch to light mode'],
        it: ['Passa alla modalità scura', 'Passa alla modalità chiara'],
        fr: ['Passer en mode sombre', 'Passer en mode clair'],
        es: ['Cambiar a modo oscuro', 'Cambiar a modo claro']
    };

    function syncButtons(theme) {
        var t = TITLES[(root.getAttribute('lang') || 'en').slice(0, 2)] || TITLES.en;
        var buttons = document.querySelectorAll('.theme-toggle');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            buttons[i].setAttribute('title', theme === 'dark' ? t[1] : t[0]);
        }
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        syncButtons(theme);
    }

    var choice = saved();
    apply(choice === 'dark' || choice === 'light' ? choice : (media && media.matches ? 'dark' : 'light'));

    // Follow live device changes until the visitor picks a theme themselves.
    if (media) {
        var onChange = function (e) { if (!saved()) apply(e.matches ? 'dark' : 'light'); };
        if (media.addEventListener) media.addEventListener('change', onChange);
        else if (media.addListener) media.addListener(onChange);
    }

    document.addEventListener('DOMContentLoaded', function () {
        syncButtons(root.getAttribute('data-theme'));
    });

    // Language menu (<details class="lang-menu">): remember the pick, close on outside click / Escape
    document.addEventListener('click', function (e) {
        var link = e.target.closest ? e.target.closest('.lang-menu a[data-lang]') : null;
        if (link) {
            try { localStorage.setItem('lang', link.getAttribute('data-lang')); } catch (err) { /* ignore */ }
        }
        var menus = document.querySelectorAll('.lang-menu[open]');
        for (var i = 0; i < menus.length; i++) {
            if (!menus[i].contains(e.target)) menus[i].removeAttribute('open');
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var menus = document.querySelectorAll('.lang-menu[open]');
        for (var i = 0; i < menus.length; i++) {
            menus[i].removeAttribute('open');
            var s = menus[i].querySelector('summary'); if (s) s.focus();
        }
    });

    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.theme-toggle') : null;
        if (!btn) return;
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (err) { /* private mode: still switches */ }
    });
})();
