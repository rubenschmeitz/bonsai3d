(function () {
  'use strict';
  var editorial = window.BonsaiEditorial;
  function series(api, limit, view) {
    var tr = api.tr, products = api.shop.products.filter(function (p) { return p.detailedMiniature; });
    return '<section class="signature-series miniature-series wrap" aria-labelledby="miniature-series-title"><div class="section-heading"><div><p class="eyebrow">' + tr('NIEUW / ZWARTE RESINMINIATUREN', 'NEW / BLACK RESIN MINIATURES') + '</p><h2 id="miniature-series-title">' + tr('Kleine figuren.<br>Grote verhalen.', 'Small figures.<br>Rich stories.') + '</h2></div><p>' + tr('Bastgroeven, veren, stofplooien en kleine gereedschappen. Losse miniaturen in zwart resin, met een tweede beeld naast een passende bonsai. Drie nieuwe figuren zoeken de boom actief op. Gegenereerde ontwerpvoorstellen; nog niet geprint. De levende bomen zijn styling.', 'Bark grooves, feathers, fabric folds and tiny tools. Individual black resin miniatures, with a second view beside a matching bonsai. Three new figures actively engage with the tree. Generated design proposals; not yet printed. The living trees are styling.') + '</p></div><div class="signature-cards">' + products.slice(0, limit).map(function (p) {
      var photo = view === 'withBonsai' && p.miniatureViews ? p.gallery.find(function (item) { return item.view === 'withBonsai'; }) : {image:p.image,alt:p.imageAlt};
      return '<article data-miniature-example="' + p.id + '"><button class="signature-detail-image" data-product="' + p.id + '" data-finish="black" aria-label="' + api.esc(tr('Bekijk ', 'Explore ') + api.t(p.name)) + '"><img src="' + api.image(photo.image) + '" alt="' + api.esc(api.t(photo.alt)) + '" width="1254" height="1254" loading="lazy"><span aria-hidden="true">↗</span></button><p class="eyebrow">' + tr('ZWART RESIN / ONTWERPVOORSTEL', 'BLACK RESIN / DESIGN PROPOSAL') + '</p><h3>' + api.esc(api.t(p.name)) + '</h3><p>' + api.esc(api.t(p.short)) + '</p><p class="product-price">' + tr('Richtprijs ', 'Guide price ') + '<strong>' + api.money(p.pricing.base, api.language) + '</strong></p><button class="text-link" data-product="' + p.id + '" data-finish="black">' + tr('Bekijk de details', 'Explore the details') + ' ↗</button></article>';
    }).join('') + '</div><p>' + api.link('collection', tr('Ontdek alle miniaturen', 'Explore all miniatures') + ' ↗', 'text-link', {category: 'miniatures'}) + '</p></section>';
  }
  var previousHome = editorial.home, previousExamples = editorial.examples;
  editorial.home = function (api) { return previousHome(api) + series(api, 3, 'isolated'); };
  editorial.examples = function (api) { return previousExamples(api) + series(api, 9, 'withBonsai'); };
})();
