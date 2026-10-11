# BONSAI3D

Standalone NL/EN website: https://rubenschmeitz.github.io/bonsai3d/

The site is served directly from the root of the main branch using GitHub Pages.
Use `python3 -m http.server 8851` for local review. No build or dependencies are required.

The curated catalogue, finish choices, product galleries and product/finish links work in the browser.
The homepage is a short introduction with three category links. The full catalogue
is on `collectie.html`, finish comparisons on `afwerkingen.html`, and Ruben's
workshop, custom work and frequently asked questions on `atelier.html`.
`voorbeelden.html` shows two static display examples based on our own photographs.
The interactive composer has been removed. Existing `opstelling.html` links redirect
to the examples page, preserving language and finish preferences.
All pages share navigation, language, chosen finish and saved selection. Category
links open a filtered catalogue, and the active page is marked in the navigation.
Direct page refreshes and existing homepage section links are supported on Pages.
Enquiries can be downloaded or copied; this static site does not submit them to a server.
There is no checkout or payment integration. Generated product visuals remain labelled.
Prices, availability and physical production variants remain subject to confirmation.

Private workshop data, manufacturing source paths, research archives and the other brand
are excluded. Font licences are included beside the fonts.

The October 2026 collection contains twenty objects: the eight existing products
and twelve new miniature design proposals, giving fourteen miniatures in total.
New miniatures are generated concepts, have not been printed and have no production
geometry. Size, finish, details and manufacturability are agreed through an enquiry.
Their current v3 images depict simple plain matte-black resin miniatures in everyday
workbench photography, with modest daylight and ordinary surface irregularities.
All twelve concepts offer only matte black. These are generated examples, not
photographs of existing printed stock. Earlier v1/v2 images and matching black
transparent derivatives are preserved separately; only v3 photographic examples
appear in the current concept galleries.
The lamella pot, bark pot and openwork plateau remain outside the visible collection.

Twenty-one owner photographs have separate conventional corrections in
`assets/prints/natural/`: light tonal corrections, cropping, colour and sharpness.
Original public photographs are unchanged; corrected product views link to them.
Previous studio edits and generated finish images are preserved separately. The
current product views favour the natural photographs. Generated previews have
explicit labels and are not evidence of a newly printed product or physical result.

Two images under `assets/examples/` illustrate a flowering bonsai on the owner's
wood-look table and a cascade on the matte-black open root stand. They were created
with built-in Imagegen using existing bonsai/product photographs as references.
They are labelled generated inspiration, with direct links to the existing objects.
Trees and other styling are examples; these pictures do not document a new physical
print or a supplied arrangement. The original images and all twenty catalogue
records are preserved. No scene selector, scene-sharing or composer enquiry remains.

The active renderer is `assets/collection.js`, with editorial sections in
`assets/collection-editorial.js` and `assets/collection.css`. The five content pages
and one redirect page are static and work on GitHub Pages.
[Design notes](DESIGN.md) describe the original visual direction and provenance.
