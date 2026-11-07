"""Find translatable text in an English page.

A *segment* is a run of text plus inline formatting tags (strong, em, a, span,
br, ...) inside one block. Its exact source substring is the translation key,
and its byte offsets are kept so the build can replace it without touching
any other markup.
"""
import re
from html.parser import HTMLParser

INLINE = {'a', 'strong', 'b', 'em', 'i', 'u', 'span', 'br', 'sup', 'sub', 'small', 'mark', 'abbr', 'code', 'wbr'}
SKIP = {'script', 'style', 'svg', 'noscript', 'template'}
ATTRS = ('alt', 'title', 'aria-label', 'placeholder')
META = {'description', 'og:title', 'og:description', 'twitter:title', 'twitter:description', 'apple-mobile-web-app-title'}
NO_TEXT = re.compile(r'^[\s\d\W_]*$')        # numbers, punctuation, emoji only
VOID = {'br', 'wbr', 'img', 'meta', 'link', 'input', 'hr', 'source'}


class _P(HTMLParser):
    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src = src
        self.lines = [0]
        for m in re.finditer('\n', src):
            self.lines.append(m.end())
        self.skip = 0
        self.run = None          # [start, end, has_text]
        self.segments = []       # (start, end)
        self.attrs = []          # (start, end) of attribute values
        self.svg_text = 0        # inside <text>/<tspan> of an inline SVG

    def off(self):
        ln, col = self.getpos()
        return self.lines[ln - 1] + col

    def close_run(self):
        r, self.run = self.run, None
        if r and r['text']:
            self._emit(r['toks'])

    def _emit(self, toks):
        # toks: list of (kind, start, end, tag) with kind in text/open/close/void
        def blank(t):
            return t[0] == 'text' and not self.src[t[1]:t[2]].strip()
        # trim: leading blanks/closers/voids, trailing blanks/openers/voids
        while toks and (blank(toks[0]) or toks[0][0] in ('close', 'void')):
            toks = toks[1:]
        while toks and (blank(toks[-1]) or toks[-1][0] in ('open', 'void')):
            toks = toks[:-1]
        if not toks:
            return
        # drop empty elements at either end, e.g. a trailing <span class="icon"></span>
        if len(toks) >= 2 and toks[-1][0] == 'close' and toks[-2][0] == 'open' and toks[-2][3] == toks[-1][3]:
            return self._emit(toks[:-2])
        if len(toks) >= 2 and toks[0][0] == 'open' and toks[1][0] == 'close' and toks[0][3] == toks[1][3]:
            return self._emit(toks[2:])
        # drop unmatched openers at the start / closers at the end
        def balanced_pairs(tk):
            stack, pairs = [], {}
            for i, t in enumerate(tk):
                if t[0] == 'open':
                    stack.append(i)
                elif t[0] == 'close':
                    for j in range(len(stack) - 1, -1, -1):
                        if tk[stack[j]][3] == t[3]:
                            pairs[stack[j]] = i; pairs[i] = stack[j]; del stack[j:]; break
            return pairs
        pairs = balanced_pairs(toks)
        if toks[0][0] == 'open' and 0 not in pairs:
            return self._emit(toks[1:])
        if toks[-1][0] == 'close' and len(toks) - 1 not in pairs:
            return self._emit(toks[:-1])
        # top-level structure
        depth, top_text, top_elems, i = 0, False, [], 0
        while i < len(toks):
            t = toks[i]
            if depth == 0:
                if t[0] == 'text' and not blank(t):
                    top_text = True
                elif t[0] == 'open' and i in pairs:
                    top_elems.append((i, pairs[i])); i = pairs[i] + 1; continue
                elif t[0] in ('open', 'close'):
                    top_text = True   # unbalanced inline tag: keep the run whole
            i += 1
        if not top_text and top_elems:
            # only elements (e.g. several sibling links): translate each one's content
            for a, b in top_elems:
                self._emit(toks[a + 1:b])
            return
        s, e = toks[0][1], toks[-1][2]
        raw = self.src[s:e]
        s += len(raw) - len(raw.lstrip()); e -= len(raw) - len(raw.rstrip())
        plain = re.sub(r'<[^>]+>|&[a-z#0-9]+;', '', self.src[s:e])
        if len(re.findall(r'[^\W\d_]', plain)) >= 2:
            self.segments.append((s, e))

    def extend(self, start, end, kind='text', tag=None):
        if self.skip:
            return
        if self.run is None:
            self.run = {'toks': [], 'text': False}
        self.run['toks'].append((kind, start, end, tag))
        if kind == 'text' and self.src[start:end].strip():
            self.run['text'] = True

    def handle_starttag(self, tag, attrs):
        start = self.off(); raw = self.get_starttag_text(); end = start + len(raw)
        if not self.skip:
            self._attrs(tag, attrs, start, raw)
        if self.skip and tag in ('text', 'tspan'):
            self.svg_text += 1
            self.svg_text_start = end
            return
        if tag in SKIP:
            self.close_run()
            if tag not in VOID:
                self.skip += 1
            return
        if tag in INLINE:
            self.extend(start, end, 'void' if tag in VOID else 'open', tag)
        else:
            self.close_run()

    def handle_startendtag(self, tag, attrs):
        start = self.off(); raw = self.get_starttag_text(); end = start + len(raw)
        if not self.skip:
            self._attrs(tag, attrs, start, raw)
        if tag in INLINE:
            self.extend(start, end, 'void', tag)
        elif tag not in SKIP:
            self.close_run()

    def handle_endtag(self, tag):
        start = self.off(); end = self.src.index('>', start) + 1
        if self.skip and tag in ('text', 'tspan'):
            self.svg_text = max(0, self.svg_text - 1)
            inner = self.src[self.svg_text_start:start]
            if '<' not in inner and len(re.findall(r'[^\W\d_]', inner)) >= 2:
                a = self.svg_text_start + len(inner) - len(inner.lstrip())
                self.segments.append((a, a + len(inner.strip())))
            return
        if tag in SKIP:
            if self.skip:
                self.skip -= 1
            return
        if tag in INLINE:
            self.extend(start, end, 'close', tag)
        else:
            self.close_run()

    def handle_data(self, data):
        start = self.off()
        if self.skip and self.svg_text:
            return   # SVG <text> labels are taken whole at their end tag
        self.extend(start, start + len(data))

    def handle_entityref(self, name):
        start = self.off(); self.extend(start, start + len(name) + 2)

    def handle_charref(self, name):
        start = self.off(); self.extend(start, start + len(name) + 3)

    def handle_comment(self, data):
        self.close_run()

    def _attrs(self, tag, attrs, start, raw):
        d = dict(attrs)
        names = list(ATTRS)
        if tag == 'meta' and (d.get('name') in META or d.get('property') in META):
            names.append('content')
        for n in names:
            v = d.get(n)
            if not v or len(re.findall(r'[^\\W\\d_]', v)) < 2:
                continue
            m = re.search(r'\s' + re.escape(n) + r'\s*=\s*(["\'])(.*?)\1', raw, re.S)
            if m:
                self.attrs.append((start + m.start(2), start + m.end(2)))


def extract(src):
    p = _P(src)
    p.feed(src)
    p.close_run()
    spans = sorted(set(p.segments) | set(p.attrs))
    return [(s, e, src[s:e]) for s, e in spans]
