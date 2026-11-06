/*
 * Light / dark theme.
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

    function syncButtons(theme) {
        var buttons = document.querySelectorAll('.theme-toggle');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            buttons[i].setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
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

    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.theme-toggle') : null;
        if (!btn) return;
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (err) { /* private mode: still switches */ }
    });
})();
