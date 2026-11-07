#!/usr/bin/env python3
"""Generate the Italian, French and Spanish pages from the English ones.

English pages are the single source of truth. Translations live in
i18n/<lang>.json (names that stay English everywhere: i18n/keep.json):

    {
      "_shared":   { "<English text>": "<translation>", ... },   # any page
      "/":         { ... },                                      # homepage only
      "/research/": { ..., "js:Expand All Highlights": "..." },  # js: = string in an inline <script>
      ...
    }

A page is generated for a language as soon as that language has a section for
the page. Missing strings fall back to English and are reported.

Run after any change to an English page or a translation file:

    python3 i18n/build.py            # build + report
    python3 i18n/build.py --check    # report only, exit 1 if anything is missing

It also refreshes, in every page (English included), two managed blocks:
<!-- i18n:head --> (hreflang alternates) and <!-- i18n:menu --> (language menu).
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from extract import extract  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://jensenxyz.github.io'

# route -> English source file
PAGES = {
    '/': 'index.html',
    '/cv/': 'cv/index.html',
    '/research/': 'research/index.html',
    '/happyhour/': 'happyhour/index.html',
    '/vibesapp/': 'vibesapp/index.html',
    '/funkacoins/': 'funkacoins/index.html',
    '/metro/': 'metro/index.html',
    '/scantrust/': 'scantrust/index.html',
}
LANGS = ['en', 'it', 'fr', 'es']
NAMES = {'en': 'English', 'it': 'Italiano', 'fr': 'Français', 'es': 'Español'}
MENU_LABEL = {'en': 'Language', 'it': 'Lingua', 'fr': 'Langue', 'es': 'Idioma'}

HEAD_RE = re.compile(r'[ \t]*<!-- i18n:head -->.*?<!-- /i18n:head -->\n?', re.S)
MENU_RE = re.compile(r'[ \t]*<!-- i18n:menu -->.*?<!-- /i18n:menu -->\n?', re.S)


def load_translations():
    out = {}
    for lang in LANGS[1:]:
        p = os.path.join(ROOT, 'i18n', f'{lang}.json')
        out[lang] = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
    # French typography: non-breaking space before : ; ! ? and inside « »
    for sec in out.get('fr', {}).values():
        for k, v in sec.items():
            sec[k] = (v.replace(' :', '\u00a0:').replace(' ;', '\u00a0;').replace(' !', '\u00a0!')
                       .replace(' ?', '\u00a0?').replace('« ', '«\u00a0').replace(' »', '\u00a0»'))
    return out


def available(route, tr):
    """Languages that have this page."""
    return ['en'] + [l for l in LANGS[1:] if route in tr[l]]


def url(lang, route):
    return route if lang == 'en' else f'/{lang}{route}'


def head_block(route, langs):
    lines = ['    <!-- i18n:head -->']
    for l in langs:
        lines.append(f'    <link rel="alternate" hreflang="{l}" href="{SITE}{url(l, route)}">')
    lines.append(f'    <link rel="alternate" hreflang="x-default" href="{SITE}{route}">')
    lines.append('    <!-- /i18n:head -->')
    return '\n'.join(lines) + '\n'


def menu_block(route, langs, cur, indent):
    i = indent
    out = [f'{i}<!-- i18n:menu -->',
           f'{i}<details class="lang-menu">',
           f'{i}    <summary class="lang-menu-btn" aria-label="{MENU_LABEL[cur]}: {NAMES[cur]}" title="{MENU_LABEL[cur]}">{cur.upper()}</summary>',
           f'{i}    <ul class="lang-menu-list">']
    for l in langs:
        cur_attr = ' aria-current="page"' if l == cur else ''
        out.append(f'{i}        <li><a href="{url(l, route)}" hreflang="{l}" lang="{l}" data-lang="{l}"{cur_attr}>{NAMES[l]}</a></li>')
    out += [f'{i}    </ul>', f'{i}</details>', f'{i}<!-- /i18n:menu -->']
    return '\n'.join(out) + '\n'


def insert_blocks(html, route, langs, cur):
    html = HEAD_RE.sub('', html)
    html = MENU_RE.sub('', html)
    if len(langs) > 1:
        html = re.sub(r'(<script src="/theme\.js"></script>\n)', lambda m: m.group(1) + head_block(route, langs), html, count=1)
        m = re.search(r'\n([ \t]*)<button type="button" class="theme-toggle"', html)
        if m:
            html = html[:m.start() + 1] + menu_block(route, langs, cur, m.group(1)) + html[m.start() + 1:]
    return html


def absolutize(html, route):
    """Relative src/href -> absolute, so copies in /it/... still resolve."""
    base = route

    def fix(m):
        attr, q, v = m.group(1), m.group(2), m.group(3)
        if re.match(r'^(/|#|[a-z][a-z0-9+.-]*:|//|\{)', v, re.I) or not v:
            return m.group(0)
        return f'{attr}={q}{os.path.normpath(base + v).replace(os.sep, "/")}{q}'
    return re.sub(r'\b(src|href|poster|data-src)=(["\'])(.*?)\2', fix, html)


def localize_links(html, lang, tr):
    routes = {r.rstrip('/') or '/': r for r in PAGES}

    def fix(m):
        q, path, frag = m.group(1), m.group(2), m.group(3) or ''
        key = path.rstrip('/') or '/'
        r = routes.get(key)
        if r and r in tr[lang]:
            return f'href={q}{url(lang, r)}{frag}{q}'
        return m.group(0)
    return re.sub(r'href=(["\'])(/[a-z]*/?)(#[^"\']*)?\1', fix, html)


KEEP = set(json.load(open(os.path.join(ROOT, 'i18n', 'keep.json'), encoding='utf-8')))


def translate_page(src, route, lang, tr, missing):
    table = {k: k for k in KEEP}
    table.update(tr[lang].get('_shared', {}))
    table.update({k: v for k, v in tr[lang].get(route, {}).items() if not k.startswith('js:')})
    out, last = [], 0
    for s, e, text in extract(src):
        t = table.get(text)
        if t is None:
            missing.add(text)
            t = text
        out.append(src[last:s]); out.append(t); last = e
    out.append(src[last:])
    html = ''.join(out)
    # strings inside inline scripts
    for k, v in tr[lang].get(route, {}).items():
        if k.startswith('js:'):
            eng = k[3:]
            for q in ("'", '"', '`'):
                html = html.replace(f'{q}{eng}{q}', f'{q}{v}{q}')
    html = re.sub(r'<html lang="[^"]*"', f'<html lang="{lang}"', html, count=1)
    return html


def main(check_only=False):
    tr = load_translations()
    report = {}
    for route, rel in PAGES.items():
        path = os.path.join(ROOT, rel)
        en = open(path, encoding='utf-8').read()
        langs = available(route, tr)
        clean = MENU_RE.sub('', HEAD_RE.sub('', en))
        new_en = insert_blocks(clean, route, langs, 'en')
        if not check_only and new_en != en:
            open(path, 'w', encoding='utf-8').write(new_en)
        for lang in langs[1:]:
            missing = set()
            html = translate_page(clean, route, lang, tr, missing)
            html = absolutize(html, route)
            html = localize_links(html, lang, tr)
            html = insert_blocks(html, route, langs, lang)
            if missing:
                report[(lang, route)] = sorted(missing)
            if not check_only:
                outp = os.path.join(ROOT, lang, rel)
                os.makedirs(os.path.dirname(outp), exist_ok=True)
                open(outp, 'w', encoding='utf-8').write(html)
    for (lang, route), miss in report.items():
        print(f'[{lang}] {route}: {len(miss)} untranslated string(s), shown in English:')
        for m in miss[:50]:
            print('   -', m[:110].replace('\n', ' '))
    if not report:
        print('All generated pages fully translated.')
    return 1 if (check_only and report) else 0


if __name__ == '__main__':
    sys.exit(main('--check' in sys.argv))
