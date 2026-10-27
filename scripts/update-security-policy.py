#!/usr/bin/env python3
"""Refresh static CSP hashes after an intentional inline-script change."""
import base64
import hashlib
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
for page in sorted(ROOT.glob('*.html')):
    html = page.read_text()
    hashes = []
    for script in re.finditer(r'<script\b([^>]*)>(.*?)</script>', html, re.S):
        if not re.search(r'\bsrc\s*=', script[1]):
            digest = base64.b64encode(hashlib.sha256(script[2].encode()).digest()).decode()
            hashes.append("'sha256-" + digest + "'")
    contact = page.name == 'maatwerk.html'
    challenge = ' https://challenges.cloudflare.com' if contact else ''
    policy = '; '.join([
        "default-src 'self'",
        "script-src 'self' https://static.cloudflareinsights.com" + challenge + " " + ' '.join(hashes),
        "script-src-attr 'none'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        "connect-src 'self' https://cloudflareinsights.com" + (challenge + " https://contact.bonsai3d.nl" if contact else ""),
        "object-src 'none'", "base-uri 'none'", "form-action 'none'",
        ("frame-src https://challenges.cloudflare.com" if contact else "frame-src 'none'"), "worker-src 'none'", "upgrade-insecure-requests"
    ])
    replacement = '<meta http-equiv="Content-Security-Policy" content="' + policy + '">'
    updated, count = re.subn(r'<meta http-equiv="Content-Security-Policy" content="[^"]+">', replacement, html)
    if count != 1:
        raise ValueError(f'{page.name}: expected one existing CSP meta tag')
    if updated != html:
        page.write_text(updated)
        print('Updated', page.name)
