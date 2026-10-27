# Website security

This public static catalogue uses GitHub Pages, enforced HTTPS, local product
data and Cloudflare Web Analytics. It has no public account or payment endpoint.
The current enquiry flow builds text locally; it does not upload enquiries.

All HTML entry points set a Content Security Policy before resources load:

- Scripts load from this site or the configured Cloudflare beacon host only.
  Existing inline structured data and the legacy redirect have exact SHA-256
  hashes; injected inline scripts, event attributes and eval are not allowed.
- Connections are limited to this site and the analytics collection origin.
- Plugin objects, child frames, workers, base-URL overrides and native form
  submissions are blocked. The enquiry interface continues to handle its
  submit event locally and offers downloads, clipboard and mail links.
- Images can use local, data and blob URLs. Inline styles remain allowed for
  the current galleries and layout; this is not an unrestricted script policy.
- Subresources are upgraded to HTTPS. Cross-site referrers disclose the origin,
  not the visitor's query parameters or page path.

After intentionally changing an inline script or the homepage structured data,
run `python3 scripts/update-security-policy.py`, review the resulting policy
diffs, then run `npm run check` and `npm test`. Do not add unsafe-inline or
unsafe-eval to script-src to work around a failed check. Synthetic security tests
exercise blocked payloads without sending them to real third-party services.

## Hosting boundary

GitHub Pages controls the response headers and TLS configuration. Meta CSP cannot
set frame-ancestors, HSTS, X-Content-Type-Options or Permissions-Policy. In
particular, frame-src blocks frames within this site; it does not prevent another
site from framing this site. Do not claim clickjacking protection from this meta
policy. Additional server-header protection needs a supported hosting or proxy
configuration; placing a `_headers` file in this repository does not configure
GitHub Pages. No DNS/proxy migration is part of this change.

Self-hosted code and the permitted analytics script remain trusted. CSP cannot
protect against compromise of the publishing account or arbitrary changes to
allowed scripts. Protect publishing accounts with MFA and review releases.

Never publish private keys, access tokens, customer uploads or private source.
The public Cloudflare beacon identifier is a measurement identifier, not an
account credential. Dependency audits and browser checks are useful evidence,
not a guarantee that the website is free from vulnerabilities.
