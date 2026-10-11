# BONSAI3D

Standalone NL/EN website: https://rubenschmeitz.github.io/bonsai3d/

The site is served directly from the root of the main branch using GitHub Pages.
Use `python3 -m http.server 8851` for local review. No build or dependencies are required.

The curated catalogue, finish choices, product galleries and product/finish links work in the browser.
The homepage is a short introduction with three category links. The full catalogue
is on `collectie.html`, finish comparisons on `afwerkingen.html`, and Ruben's
workshop, custom work and frequently asked questions on `atelier.html`. The exhibition
builder is on `opstelling.html`, with entrances on the homepage and shared navigation.
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
Their current v2 images depict detailed resin miniatures with individual painted
colour palettes. These are generated design proposals, not photographs of printed
or painted stock. Original v1 images are preserved beside the versioned derivatives.
The lamella pot, bark pot and openwork plateau remain outside the visible collection.

Twenty-one owner photographs have separate conventional corrections in
`assets/prints/natural/`: light tonal corrections, cropping, colour and sharpness.
Original public photographs are unchanged; corrected product views link to them.
Previous studio edits and generated finish images are preserved separately. The
current product views favour the natural photographs. Generated previews have
explicit labels and are not evidence of a newly printed product or physical result.

The builder reuses the earlier exhibition-v2 tree, natural-accent and jita assets.
Stands, pots and existing figures use conventional masks of own product photographs;
new miniatures use their generated transparent images. Every component can be omitted.
Removing a pot removes the illustrative tree; choosing a tree restores a suitable pot.
Miniatures can sit beside the display or on a pot; scale and attachment need agreement.
The jita scene and trees are illustrative. Natural accents and the card holder are
styling ideas, not additional catalogue SKUs. Product links open the current catalogue.
Shared URLs, reloads and language changes retain choices; a complete configuration
can be included in a downloadable or copied enquiry. No request is sent automatically.

The active renderer is `assets/collection.js`, with editorial sections in
`assets/collection-editorial.js`, the builder in `assets/composer.js`, and the
corresponding CSS files. All five entry pages are static and work on GitHub Pages.
[Design notes](DESIGN.md) describe the original visual direction and provenance.
