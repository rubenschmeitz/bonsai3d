# BONSAI3D

Standalone NL/EN website: https://rubenschmeitz.github.io/bonsai3d/

The site is served directly from the root of the main branch using GitHub Pages.
Use `python3 -m http.server 8851` for local review. No build or dependencies are required.

The curated catalogue, finish choices, product galleries and product/finish links work in the browser.
The homepage is a short introduction with three category links. The full catalogue
is on `collectie.html`, finish comparisons on `afwerkingen.html`, and Ruben's
workshop, custom work and frequently asked questions on `atelier.html`.
`voorbeelden.html` shows six static display examples: two based on our own bonsai
photographs and four new mature-tree compositions using our stand and figure references.
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

The October 2026 collection contains twenty-eight objects: eight existing products,
twelve miniature design proposals and eight table/jita proposals. There are fourteen
miniatures and twelve tables/jitas in total.
New miniatures are generated concepts, have not been printed and have no production
geometry. Size, finish, details and manufacturability are agreed through an enquiry.
Their current exhibition images depict simple plain matte-black resin miniatures
with modest light and ordinary surface irregularities.
All twelve concepts offer only matte black. These are generated examples, not
photographs of existing printed stock. Earlier v1/v2 images and matching black
transparent derivatives are preserved separately. Earlier v3 workbench views
remain in the galleries beside the new exhibition images.
The lamella pot, bark pot and openwork plateau remain outside the visible collection.

Twenty-one owner photographs have separate conventional corrections in
`assets/prints/natural/`: light tonal corrections, cropping, colour and sharpness.
Original public photographs are unchanged; corrected product views link to them.
Previous studio edits and generated finish images are preserved separately. The
front-facing product views use generated exhibition settings; natural photographs remain in the galleries. Generated previews have
explicit labels and are not evidence of a newly printed product or physical result.

Two earlier images under `assets/examples/` illustrate a flowering bonsai on the owner's
wood-look table and a cascade on the matte-black open root stand. They were created
with built-in Imagegen using existing bonsai/product photographs as references.
They are labelled generated inspiration, with direct links to the existing objects.
Trees and other styling are examples; these pictures do not document a new physical
print or a supplied arrangement. The original images and existing catalogue objects are preserved; the jita
now uses the owner's actual photograph instead of the former generated organic view. No scene selector, scene-sharing or composer enquiry remains.

The active renderer is `assets/collection.js`, with editorial sections in
`assets/collection-editorial.js` and `assets/collection.css`. The five content pages
and one redirect page are static and work on GitHub Pages.
[Design notes](DESIGN.md) describe the original visual direction and provenance.

The exhibition imagery revision uses twenty product views, six additional finish
variants and two display examples under `assets/exhibition/`. Warm greige linen
panels, an ivory cloth-covered exhibition bench and soft light unify the collection.
These are generated background edits and remain explicitly labelled. Product
identities, pot colours/options, existing wood/black choices and black-only new
miniatures are preserved. Original images and prior derivatives remain available
in product galleries. Genuine workshop imagery remains in the atelier story;
there are currently no tools in the active catalogue. Full prompts and image
provenance are archived privately in the printing workspace research directory.

Four additional exhibition examples under `assets/exhibition/` feature generated
mature maple, pine and juniper trees. Two use wood-look stands/figures and two
use matte black. Existing stand forms, figure details and referenced pot designs
are retained. These are explicitly labelled generated inspiration; the new trees
are not the owner’s existing collection. Both the stand and figure link to the
matching product and finish. Full prompts, raw PNGs and source/output hashes are
archived in the private printing workspace research directory.

Four new display tables (bridge, octagonal, round and slim accent) and four jitas
(oval, long, faceted and round) each have wood-look and matte-black photographic
concept views under `assets/display-designs/`. Built-in Imagegen created the views
with the existing exhibition setting as a style reference. These remain explicitly
generated, unprinted design proposals; dimensions, load and manufacturability
require agreement for an eventual version. No production geometry is supplied.
The entry `jita` is now "Mijn jita" / "My jita", showing Ruben's original made
plate in its actual arrangement. Its original and lightly corrected photographs
are the active gallery. Previous generated organic variants are retained as
archived files but are no longer shown. Existing saved jita selections retain
their identity and use its documented wood-look finish. All other products, black-only
miniature options, static examples and original photo bytes are preserved.
