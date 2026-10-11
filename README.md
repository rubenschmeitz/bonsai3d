# BONSAI3D

Standalone NL/EN website: https://rubenschmeitz.github.io/bonsai3d/

The site is served directly from the root of the main branch using GitHub Pages.
Use `python3 -m http.server 8851` for local review. No build or dependencies are required.

The curated catalogue, finish choices, product galleries and product/finish links work in the browser.
Enquiries can be downloaded or copied; this static site does not submit them to a server.
There is no checkout or payment integration. Generated product visuals remain labelled.
Prices, availability and physical production variants remain subject to confirmation.

Private workshop data, manufacturing source paths, research archives and the other brand
are excluded. Font licences are included beside the fonts.

The October 2026 collection now contains eight objects: six previously printed
stands, jitas and figures offered in wood-look and matte-black directions, plus
two pots with their original records, images and options unchanged. Experimental
tools, electronics and speculative concepts are outside the visible collection.
The lamella pot, bark pot and openwork plateau were also removed at the owner's request.

The large bonsai photographs use unaltered owner-supplied photographs of real
trees. Edited studio views and generated finish previews have separate labels.
New finish images are proposals, not evidence of a newly printed version. Every
finish preview links to the original print photograph. [Design notes](DESIGN.md)
describe the visual direction and provenance. Product and finish choices survive
reload and are included in the downloaded or copied enquiry.

The active renderer is `assets/collection.js`, with editorial sections in
`assets/collection-editorial.js` and styling in `assets/collection.css`. Previous
assets remain archived in the repository but are not loaded by `index.html`.
