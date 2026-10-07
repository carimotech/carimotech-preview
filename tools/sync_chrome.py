#!/usr/bin/env python3
"""Rewrite the shared header and footer in every page.

Edit the nav/footer markup in tools/chrome.py, then run:
    python3 tools/sync_chrome.py
Only the text between the CHROME:NAV / CHROME:FOOTER markers is replaced.
"""
import os, re, sys
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
sys.path.insert(0, here)
import chrome

pages = sorted(f for f in os.listdir(root) if f.endswith('.html'))
for f in pages:
    p = os.path.join(root, f)
    t = open(p, encoding='utf-8').read()
    n = re.sub(r'<!-- CHROME:NAV:START.*?<!-- CHROME:NAV:END -->', lambda m: chrome.nav(f), t, flags=re.S)
    n = re.sub(r'<!-- CHROME:FOOTER:START.*?<!-- CHROME:FOOTER:END -->', lambda m: chrome.footer(), n, flags=re.S)
    if n != t:
        open(p, 'w', encoding='utf-8').write(n); print('updated', f)
    else:
        print('unchanged', f)
