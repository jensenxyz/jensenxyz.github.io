"""Merge a batch of translations into i18n/<lang>.json (used while authoring).

usage: python3 i18n/merge.py batch.py   where batch.py defines BATCH = {lang: {route: {en: tr}}}
Refuses keys that don't match the English page exactly.
"""
import json, os, re, sys, runpy
from collections import Counter
sys.path.insert(0, os.path.dirname(__file__))
from extract import extract
from build import PAGES, ROOT
_b = runpy.run_path(sys.argv[1])
batch = _b['BATCH']
ALLOW_NUMBERS = set(_b.get('ALLOW_NUMBERS', ()))   # keys whose numbers legitimately differ (e.g. '3rd-party' -> 'terze parti')
keys = {r: {t for *_, t in extract(open(os.path.join(ROOT, f), encoding='utf-8').read())} for r, f in PAGES.items()}
allkeys = set().union(*keys.values())
bad = 0


def tags(x):
    return Counter(re.findall(r'</?([a-z0-9]+)', x))


def numbers(x):
    x = re.sub(r'<[^>]+>', '', x)
    return Counter(re.sub(r'[.,\u00a0\u202f ]', '', n) for n in re.findall(r'\d+(?:[.,\u00a0\u202f ]\d+)*', x))


for lang, secs in batch.items():
    p = os.path.join(ROOT, 'i18n', f'{lang}.json'); data = json.load(open(p, encoding='utf-8'))
    for route, tbl in secs.items():
        for k in tbl:
            pool = allkeys if route == '_shared' else keys[route]
            if not k.startswith('js:') and k not in pool:
                print(f'[{lang}] {route}: unknown key {k[:80]!r}'); bad += 1
            elif tags(k) != tags(tbl[k]):
                print(f'[{lang}] {route}: markup differs in {k[:60]!r}'); bad += 1
            elif numbers(k) != numbers(tbl[k]) and k not in ALLOW_NUMBERS:
                print(f'[{lang}] {route}: numbers differ in {k[:60]!r}: {dict(numbers(k))} vs {dict(numbers(tbl[k]))}'); bad += 1
        data.setdefault(route, {}).update(tbl)
    if not bad:
        json.dump(data, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2); open(p, 'a').write('\n')
print('merged' if not bad else f'{bad} bad keys, nothing written')
