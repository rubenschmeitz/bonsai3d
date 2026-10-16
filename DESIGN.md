# Product images without captions — 16 October 2026

The user explicitly requests no text underneath product images, including
labels such as 'Productbeeld · nog niet geprint'. Render image areas without
figcaptions, image-status labels or expandable image-information notes throughout
the homepage, collection, atelier and product dialogs. Gallery controls and
descriptive alternative text remain available. Product names, prices and normal
product descriptions belong in their existing information areas. Keep technical
provenance and actual product stages in their data records.

Earlier design notes follow.

# Shop reference refinement — 14 October 2026

The user named Bonsai Plaza and Lodder Bonsai as references. Their live homepages
were reviewed, including Lodder’s linked Bonsai Shop. The interpretation uses
recognisable shop structure: clear collection actions, category shortcuts, search
and named product cards with guide prices and availability. The gallery now has
rectangular framing. Three primary navigation choices and two home sections remain.
Existing BONSAI3D colours, type, catalogue, media and provenance are retained.
No reference photos, branding, copy, sales promises or checkout behavior reused.

References inspected:
- https://www.bonsaiplaza.com/nl/ — search, category navigation, priced products.
- https://lodderbonsai.nl/ — large imagery and distinct collection actions.
- https://www.bonsaishop.nl/ — category entrances and product presentation.

Earlier design notes follow.

# Homepage imagery and simpler navigation — 14 October 2026

Primary navigation contains Collection, The atelier and Custom. The logo links
home. Finishes are part of the atelier, with a redirect for old finish URLs.
The homepage now includes three manually selectable product photographs and
three photographic category cards, with short links to the remaining categories.
Images retain generated/photo provenance and concept labels. Gallery controls
support keyboard arrows and announce the selected photograph. No automatic
rotation, new images or catalogue changes are introduced.

Earlier design notes follow.

# Compact homepage — 13 October 2026

The homepage now contains a short photographic introduction with collection and
custom enquiry actions, followed by six compact category links. Maker stories
stay on the atelier page and product detail sections stay in the collection.
The examples page, its old composer alias and navigation links have been removed.
Existing catalogue records, photographs and provenance labels are preserved.
The former exhibition anchor leads to the collection. YORI3D stays private/offline.

The following notes describe earlier revisions.

# Current atelier direction — 12 October 2026

BONSAI3D connects the movement and texture of a bonsai to its printed display
objects. The SVG mark combines branching lines with layered supports. Warm paper,
forest green, brown detail colour and expressive serif headlines distinguish
Ruben's small workshop from a generic product grid. Images fill the frame with
physical-looking printed objects and matching living trees, while preserving the
owner's original photographs separately. New designs remain generated proposals.

Six new black-resin miniature proposals feature carved bark, feathers, fur,
fabric seams, woven textures, miniature tools and integrated bases. Each image
uses close workshop photography beside a living bonsai, with satin-matte black
resin and modest cleanup traces. They are original generated concepts with no
production geometry or physical prints. Black-only options, EUR25–40 guide prices
and explicit plant exclusions appear in the collection and enquiry. The homepage
shows three and the examples page all six, preserving the four existing displays.
Original PNGs and the full prompts/provenance are saved privately under
`shop-design/research/detailed-miniatures-2026-10-12/`.

The signature additions explore twisted deadwood-root legs, irregular branch
lattices and topographic relief. New categories cover accent holders, suiseki
bases and exhibition accessories. These product ideas follow the owner's brief;
the Omiya Bonsai Art Museum's gallery description and Peter Warren's Mirai display
article informed the choice of exhibition elements. Their images/designs were
not reused. Sources: https://www.bonsai-art-museum.jp/en/facilities/service-3/
and https://bonsaimirai.com/blog/bonsai-display-pt-i .

The owner confirmed only pots currently in stock and requested estimated prices
between EUR10 and EUR100. Catalogue prices and custom calculator assumptions are
indicative. Raw black/grey uses the print colour; wood look requires additional
sanding, colour layers and surface work. Final cost, material, fit, load capacity
and manufacturing feasibility need discussion. No physical validation was done.

The four refined static examples from the concurrent exhibition revision remain
intact. The retired exhibition composer stays removed. The interactive custom
calculator is a separate enquiry aid. YORI3D remains private and offline.

---

## Historical design notes

# BONSAI3D design notes — October 2026

Current navigation revision: the interactive composer has been removed from all
pages and its JS/CSS retired. Two static generated display examples are shown on
`voorbeelden.html`; the homepage links there through a small text link. The examples
reference the owner’s actual trees and existing product shapes. Both are clearly
labelled generated inspiration. They do not create new pot variants or product
records, and the complete twenty-object catalogue and existing image bytes remain
unchanged. Old composer URLs lead to this static page. Historical design notes
below describe the earlier product and image work.

The website uses large photographs, plain sans-serif headings, white space,
quiet colours and direct navigation. A photographic introduction, two finish
stories and a concise product collection replace the illustrative scene builder
and sketchbook feed. Bilingual enquiries remain downloadable or copyable.

The homepage contains only the photographic introduction, three category links
and a compact finish/custom-work link row. The catalogue, finish comparison and
workshop/custom-work story have separate HTML pages. Desktop category previews
become compact image rows on phones. Persistent navigation marks the current
page; language, finish and enquiry selection carry across page navigation.
The catalogue and all pot records remain unchanged during this navigation edit.

Visual research included the current [Bonsai Mirai website](https://bonsaimirai.com/),
[Mirai Goods display collection](https://goods.bonsaimirai.com/collections/stands-frames)
and [Bonsai Empire](https://www.bonsaiempire.com/). No photographs, logos,
proprietary fonts, product designs or copy from those sites were reused.

Display research: [Peter Warren's Bonsai Display article for Mirai](https://bonsaimirai.com/blog/bonsai-display-pt-i)
and the [Omiya Bonsai Art Museum's collection gallery](https://www.bonsai-art-museum.jp/en/facilities/service-3/).
These describe combinations of trees, stands, companion plants, viewing stones,
seasonal scrolls and open space. They inform the product direction; they do not
endorse BONSAI3D or establish the suitability of a particular print.

The current collection has eight objects. Six previously printed designs form
the wood-look / matte-black series: low display table, round root stand, open root
stand, organic jita, tea drinker and kneeling enthusiast. The
branch pot and red branch pot retain their complete earlier catalogue records, photographs, gallery
order, wording and finish options at the owner's explicit request. A global finish
choice never recolours the pots or adds new pot finish variants.

Twenty-five previous entries, including unprinted proposals, electronic prototypes,
work tools and colourful miniature scenes, are outside the visible collection.
The owner explicitly removed the lamella pot, bark pot and openwork plateau.
Their earlier versions remain recoverable in Git and the private research archive.

The large flowering-tree and cascade photographs are the owner's unaltered source
photographs. They are not generated trees. The workshop section shows the original
low-table photograph. No source photographs were overwritten. A tree printed as
part of the kneeling figure is explicitly a sculpted miniature, not a living tree.

Eight selected images were made with built-in Imagegen using existing print photographs
as edit targets: six black finish previews, an empty wood-look jita and a wood-look
tea drinker. All keep the referenced shape and print detail as closely as the image
edit allows. Such images are labelled finish previews and link to their original
photographs; they are not dimensional or manufacturing evidence. Existing brown
studio images are labelled edited product images. Full-frame originals remain in
the galleries. Finish previews are saved under `assets/finishes/`.

Wood look describes a finish on a 3D print, not a timber construction. New finishes,
materials, sizes, suitable loads, prices and timing are agreed for each enquiry.
Product finish choices are shown in the image, retained in local selections, encoded
in product links and included in enquiry text. No physical print or strength test
was performed for this website revision. YORI3D remains a separate private repository
with Pages disabled; it is not linked from this website.

The featured miniature exhibition staging uses restrained asymmetrical pairings,
wooden display stands and separate tiny jitas on neutral linen. The Omiya Bonsai
Art Museum gallery and National Bonsai Foundation museum pages informed the
exhibition context; no external images/designs were copied. Sources:
https://www.bonsai-art-museum.jp/en/facilities/service/gallery/
https://www.bonsai-nbf.org/bonsai-museum
All new exhibition scenes are generated concepts, not proof of physical displays.
