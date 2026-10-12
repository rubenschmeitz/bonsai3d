(async function () {
  'use strict';
  var page = document.body.dataset.page || 'home';
  var pages = {home:'./',collection:'./collectie.html',finishes:'./afwerkingen.html',examples:'./voorbeelden.html',atelier:'./atelier.html',custom:'./maatwerk.html'};
  var legacy = {collection:'collection',finishes:'finishes',studio:'atelier',custom:'atelier',guide:'atelier',display:'atelier',exhibition:'examples'};
  var anchor = location.hash.slice(1);
  if (page === 'home' && legacy[anchor]) {
    location.replace(pages[legacy[anchor]] + location.search + location.hash);
    return;
  }
  var response = await fetch('./assets/catalogue.json');
  if (!response.ok) throw new Error('Catalogue unavailable');
  var data = await response.json(), shop = data.bonsai;
  window.SHOP_DATA = data;
  var query = new URLSearchParams(location.search);
  function stored(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; } }
  function remember(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  var language = (query.get('lang') || stored('ruben-shop-language', 'nl')) === 'en' ? 'en' : 'nl';
  var style = (query.get('style') || stored('bonsai3d-style', 'wood')) === 'black' ? 'black' : 'wood';
  var category = 'all', search = '', selection = [], cardStyles = {}, activeProduct = null, activeFinish = style;
  if (shop.categories.some(function (c) { return c.id === query.get('category'); })) category = query.get('category');
  remember('ruben-shop-language', language); remember('bonsai3d-style', style);
  var lastFocus = null, lastRequest = '', toastTimer;
  var ui = {
    nl: {collection:'Collectie', finishes:'Afwerkingen', studio:'Werkplaats', custom:'Op maat', selection:'Mijn selectie', menu:'Menu', search:'Zoek een object', count:'objecten', all:'Alles', wood:'Houtlook', black:'Matzwart', own:'Eigen voorkeur', details:'Bekijk object', request:'Op aanvraag', printed:'Vorm eerder geprint', edited:'Bewerkt productbeeld', finish:'Afwerkingsvoorbeeld', photo:'Oorspronkelijke foto', editedNote:'Bewerkt studiobeeld op basis van de oorspronkelijke printfoto.', finishNote:'Gegenereerd kleurvoorstel van een bestaand ontwerp. Deze afwerking is nog te bespreken.', photoNote:'Ongewijzigde foto van het gemaakte exemplaar. Boom, pot en overige styling zijn alleen inbegrepen als dat in de aanvraag wordt afgesproken.', original:'Bekijk oorspronkelijke foto', quantity:'Aantal', add:'Bewaar in mijn selectie', added:'Toegevoegd aan je selectie.', close:'Sluiten', choose:'Kies je afwerking', noResults:'Geen objecten gevonden. Probeer een andere zoekterm.', enquiry:'Maak je aanvraag', intro:'Je selectie en afwerkingen worden bewaard op dit apparaat. Voeg je wensen toe en download of kopieer je aanvraag.', empty:'Je selectie is nog leeg. Je kunt hieronder ook je eigen idee beschrijven.', remove:'Verwijder', name:'Naam', email:'E-mailadres', idea:'Jouw opstelling of wensen', hint:'Bijvoorbeeld: de maat van je pot, gewenste hoogte, een andere kleur of de plek waar je de opstelling wilt gebruiken.', width:'Breedte pot (mm)', depth:'Diepte pot (mm)', height:'Gewenste hoogte (mm)', create:'Maak aanvraag', download:'Download aanvraag', copy:'Kopieer aanvraag', copied:'Aanvraag gekopieerd.', copyFailed:'Kopiëren lukte niet. Je kunt de aanvraag downloaden.', ready:'Je aanvraag is klaar. Download of kopieer hem en stuur hem zelf naar Ruben.', local:'Hier wordt een aanvraagbestand gemaakt. De website verstuurt niets automatisch.', quote:'Maat, materiaal, afwerking, prijs en planning stemmen we samen af.', error:'Kies een object of beschrijf eerst je idee.', ownNote:'Een eigen kleur kan ook. Vermeld je voorkeur in de aanvraag.', draft:'Aanvraag aan BONSAI3D', noOrder:'Aanvraagconcept — uitvoering en prijs nog af te stemmen.', fileName:'aanvraag', archived:'Dit ontwerp staat voorlopig buiten de collectie.', footer:'3D-geprinte objecten · gemaakt op aanvraag', language:'Taal', browseFinish:'Bekijk de collectie in', saved:'opgeslagen', styleHeading:'Bekijk de collectie in', skip:'Ga naar de inhoud'},
    en: {collection:'Collection', finishes:'Finishes', studio:'Workshop', custom:'Custom', selection:'My selection', menu:'Menu', search:'Find an object', count:'objects', all:'All', wood:'Wood look', black:'Matte black', own:'My own preference', details:'View object', request:'On enquiry', printed:'Shape previously printed', edited:'Edited product image', finish:'Finish preview', photo:'Original photograph', editedNote:'Edited studio image based on the original print photograph.', finishNote:'Generated colour proposal for an existing design. This finish needs discussion.', photoNote:'Unaltered photograph of the made example. Tree, pot and other styling are only included if agreed in the enquiry.', original:'View original photograph', quantity:'Quantity', add:'Save to my selection', added:'Added to your selection.', close:'Close', choose:'Choose your finish', noResults:'No objects found. Try another search term.', enquiry:'Prepare your enquiry', intro:'Your selection and finishes are saved on this device. Add your preferences and download or copy your enquiry.', empty:'Your selection is empty. You can also describe an idea of your own below.', remove:'Remove', name:'Name', email:'Email address', idea:'Your display or preferences', hint:'For example: your pot’s dimensions, preferred height, a different colour or where you want to use the arrangement.', width:'Pot width (mm)', depth:'Pot depth (mm)', height:'Preferred height (mm)', create:'Prepare enquiry', download:'Download enquiry', copy:'Copy enquiry', copied:'Enquiry copied.', copyFailed:'Copying was unavailable. You can download the enquiry.', ready:'Your enquiry is ready. Download or copy it and send it to Ruben yourself.', local:'This creates an enquiry file. The website does not send anything automatically.', quote:'We agree size, material, finish, price and timing together.', error:'Choose an object or describe your idea first.', ownNote:'A colour of your own is possible too. Add your preference to the enquiry.', draft:'Enquiry for BONSAI3D', noOrder:'Enquiry draft — final version and price to be agreed.', fileName:'enquiry', archived:'This design is currently outside the collection.', footer:'3D-printed objects · made on enquiry', language:'Language', browseFinish:'Explore the collection in', saved:'saved', styleHeading:'View the collection in', skip:'Skip to content'}
  };
  Object.assign(ui.nl, {natural:'Rustig & natuurlijk',warm:'Warm & kleurrijk',earth:'Aardetinten',dark:'Donker & ingetogen',custom:'Eigen voorkeur',originalFinish:'Zoals het model',finished:'Productvisualisatie',finishedNote:'Gegenereerde productvisualisatie. Kleur en uitvoering spreken we samen af; planten zijn styling.',potFinish:'Voorkeur voor uitstraling'});
  Object.assign(ui.en, {natural:'Quiet & natural',warm:'Warm & colourful',earth:'Earth tones',dark:'Dark & understated',custom:'My own preference',originalFinish:'Like the model',finished:'Product visualisation',finishedNote:'Generated product visualisation. Colour and final version are agreed together; plants are styling.',potFinish:'Preferred look'});
  function u(key) { return ui[language][key]; }
  ui.nl.custom='Op maat'; ui.en.custom='Custom';
  Object.assign(ui.nl, {home:'Home',atelier:'Het atelier',examples:'Voorbeelden',concept:'Gegenereerd voorbeeld · nog niet geprint',conceptNote:'Gegenereerd fotografisch voorbeeld van een matzwarte resinminiatuur. Het ontwerp is nog niet geprint; maat en maakbaarheid stemmen we samen af.',corrected:'Eigen foto · licht gecorrigeerd',correctedNote:'Eigen foto met een betere uitsnede en subtiele correcties in belichting en kleur. Vorm en productdetails zijn behouden.'});
  Object.assign(ui.en, {home:'Home',atelier:'The atelier',examples:'Display examples',concept:'Generated example · not yet printed',conceptNote:'Generated photographic example of a matte-black resin miniature. The design has not been printed; size and manufacturability are agreed together.',corrected:'Own photograph · lightly corrected',correctedNote:'Own photograph with improved framing and subtle exposure and colour corrections. Shape and product details are preserved.'});
  ui.nl.black='Ruw zwart'; ui.en.black='Raw black'; ui.nl.grey='Ruw grijs'; ui.en.grey='Raw grey';
  function price(p,f){return BonsaiPricing.money(BonsaiPricing.product(p,f),language);}
  function availability(p){return p.availability==='stock'?tr('Potjes op voorraad','Pots in stock'):p.stage==='future'?tr('Ontwerp op aanvraag','Design on enquiry'):tr('Bij te maken op aanvraag','Made to order');}
  function finishLabel(finish) { return finish === 'custom' ? u('own') : finish === 'original' ? u('originalFinish') : u(finish); }
  function tr(nl, en) { return language === 'nl' ? nl : en; }
  function t(value) { return value && typeof value === 'object' ? value[language] : value; }
  function esc(value) { return String(value || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function image(path) { return './assets/' + path; }
  function productById(id) { return shop.products.find(function (p) { return p.id === id; }); }
  function finishImage(p, finish) { return p.finishes ? (p.finishes[finish] || p.finishes.black || p.finishes.wood) : {image:p.image,alt:p.imageAlt,visualKind:p.visualKind}; }
  Object.assign(ui.nl, {exhibition:'Gegenereerde tentoonstellingssetting',exhibitionNote:'Gegenereerd presentatiebeeld op basis van een bestaande productfoto, met aangepaste achtergrond en belichting. De oorspronkelijke print is te bekijken via de foto hieronder.',exhibitionConceptNote:'Gegenereerd voorbeeld van een matzwarte resinminiatuur in een tentoonstellingssetting. Dit ontwerp is nog niet geprint; maat en maakbaarheid werken we samen uit.'});
  Object.assign(ui.en, {exhibition:'Generated exhibition setting',exhibitionNote:'Generated display image based on an existing product photograph, with edited background and lighting. The original print can be viewed in the photograph linked below.',exhibitionConceptNote:'Generated example of a matte-black resin miniature in an exhibition setting. This design has not been printed; size and manufacturability are developed together.'});
  Object.assign(ui.nl, {displayConceptNote:'Gegenereerd fotografisch voorbeeld van een tafel of jita in een tentoonstellingssetting. Dit ontwerp is nog niet geprint; maat, afwerking en maakbaarheid stemmen we samen af.'});
  Object.assign(ui.en, {displayConceptNote:'Generated photographic example of a table or jita in an exhibition setting. This design has not been printed; dimensions, finish and manufacturability are agreed together.'});
  function imageLabel(photo) { if(photo.visualKind==='arrangement'||photo.visualKind==='arrangementConcept') return tr('Gegenereerd presentatievoorbeeld','Generated display example'); if (photo.visualKind === 'displayConcept') return u('concept'); if (photo.visualKind === 'exhibitionConcept') return u('concept'); if (['concept','corrected','exhibition'].includes(photo.visualKind)) return u(photo.visualKind); return u(photo.visualKind === 'finish' ? 'finish' : photo.visualKind === 'photo' ? 'photo' : photo.visualKind === 'finished' ? 'finished' : 'edited'); }
  function imageNote(photo) { if(photo.visualKind==='arrangement'||photo.visualKind==='arrangementConcept') return tr('Gegenereerd fotografisch presentatievoorbeeld. Boom, plant, steen en styling zijn niet inbegrepen. '+(photo.visualKind==='arrangementConcept'?'Ontwerp nog niet geprint; maakbaarheid bespreken we.':'De eigen printfoto blijft in de galerij.'),'Generated photographic display example. Trees, plants, stones and styling are not included. '+(photo.visualKind==='arrangementConcept'?'Design not yet printed; manufacturability requires discussion.':'The own print photograph remains in the gallery.')); if (photo.visualKind === 'displayConcept') return u('displayConceptNote'); if (photo.visualKind === 'exhibitionConcept') return u('exhibitionConceptNote'); if (['concept','corrected','exhibition'].includes(photo.visualKind)) return u(photo.visualKind+'Note'); return u(photo.visualKind === 'finish' ? 'finishNote' : photo.visualKind === 'photo' ? 'photoNote' : photo.visualKind === 'finished' ? 'finishedNote' : 'editedNote'); }
  function total() { return selection.reduce(function (sum, row) { return sum + row.quantity; }, 0); }
  function save() { remember('bonsai3d-selection', JSON.stringify(selection)); }
  try {
    var saved = stored('bonsai3d-selection', '');
    if (!saved) (shop.previousSlugs || []).concat(shop.previousSlug || []).some(function (slug) { saved = stored(slug + '-selection', ''); return !!saved; });
    var previous = JSON.parse(saved || '[]');
    if (Array.isArray(previous)) selection = previous.filter(function (row) { return productById(row.id) && Number.isInteger(row.quantity) && row.quantity > 0 && row.quantity <= 20 && typeof row.finish === 'string'; }).map(function (row) { var p=productById(row.id); return {id:row.id, quantity:row.quantity, finish:p.finishes ? (p.options.includes(row.finish) ? row.finish : row.finish === 'dark' ? 'black' : p.options[0]) : (p.options.includes(row.finish) ? row.finish : p.options[0])}; });
    save();
  } catch (_) {}
  function pageUrl(name, options) {
    var params = new URLSearchParams(Object.assign({lang:language,style:style}, options || {}));
    return pages[name] + '?' + params.toString();
  }
  function link(name, content, className, options) {
    options = options || {};
    return '<a data-page="' + name + '" data-link-options="' + esc(JSON.stringify(options)) + '" class="' + className + '" href="' + esc(pageUrl(name, options)) + '">' + content + '</a>';
  }
  function updateLinks() {
    document.querySelectorAll('a[data-page]').forEach(function (a) { a.href = pageUrl(a.dataset.page, JSON.parse(a.dataset.linkOptions || '{}')); });
  }
  function logo() { return link('home', '<img class="brand-wordmark" src="' + image('brand/bonsai3d-logo-primary.svg') + '" alt="BONSAI3D" width="210" height="44">', 'brand'); }
  function swatches(finish, attributes) {
    return ['wood','black'].map(function (f) { return '<button type="button" class="finish-choice" ' + attributes(f) + ' aria-pressed="' + (finish === f) + '"><span class="finish-dot ' + f + '" aria-hidden="true"></span><span>' + u(f) + '</span></button>'; }).join('');
  }
  function render() {
    document.documentElement.lang = language;
    document.title = 'BONSAI3D — ' + (page === 'home' ? t(shop.subtitle) : u(page));
    document.querySelector('meta[name="description"]').content = t(shop.intro);
    var api = {tr:tr, t:t, esc:esc, shop:shop, image:image, style:style, language:language, finishImage:finishImage, imageLabel:imageLabel, money:BonsaiPricing.money, link:link, pageUrl:pageUrl};
    var content = page === 'collection' ? collection() : window.BonsaiEditorial[page](api);
    document.getElementById('app').innerHTML = '<a class="skip" href="#main">' + u('skip') + '</a>' +
      '<header class="site-header"><div class="header-inner">' + logo() + '<nav id="main-nav" aria-label="' + u('menu') + '">' + Object.keys(pages).map(function (name) { return link(name,u(name),'nav-link' + (name === page ? ' current' : '')).replace('class=',(name === page ? 'aria-current="page" ' : '') + 'class='); }).join('') + '</nav><div class="header-actions"><div class="languages" role="group" aria-label="' + u('language') + '">' + ['nl','en'].map(function (lang) { return '<button type="button" data-language="' + lang + '" aria-pressed="' + (language === lang) + '">' + lang.toUpperCase() + '</button>'; }).join('') + '</div><button class="selection-toggle" data-open-inquiry><span class="selection-label">' + u('selection') + '</span><span class="count">' + total() + '</span></button></div><button class="menu-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="' + u('menu') + '"><span aria-hidden="true">☰</span></button></div></header>' +
      '<main id="main">' + content + '</main><footer class="wrap"><div>' + logo() + '<p>' + u('footer') + '</p></div><nav aria-label="' + tr('Meer ontdekken','Explore more') + '">' + link('collection',u('collection'),'text-link') + link('finishes',u('finishes'),'text-link') + link('atelier',u('atelier'),'text-link') + link('examples',u('examples'),'text-link') + '</nav><p class="footer-note">© ' + new Date().getFullYear() + ' BONSAI3D</p></footer>' +
      '<dialog id="product-dialog" aria-labelledby="product-title"></dialog><dialog id="inquiry-dialog" aria-labelledby="inquiry-title"></dialog><div class="toast" role="status" aria-live="polite"></div>';
    renderProducts(); bindProductLinks(); bind(); if(window.BonsaiDetails) window.BonsaiDetails.bind({tr:tr,language:language,openInquiry:openInquiry});
  }
  function collection() {
    return '<section class="collection wrap" id="collection" aria-labelledby="collection-title"><div class="section-heading"><div><p class="eyebrow">BONSAI3D / ' + tr('OBJECTEN', 'OBJECTS') + '</p><h1 class="page-title" id="collection-title">' + u('collection') + '</h1></div><p>' + tr('Van worteltafel tot steenbasis en kleine figuren. Ontdek de details, richtprijzen en mogelijkheden voor jouw opstelling.', 'From root stands to stone bases and small figures. Explore the details, guide prices and options for your display.') + '</p></div><div class="collection-style"><span>' + u('styleHeading') + '</span><div role="group" aria-label="' + u('choose') + '">' + swatches(style, function (f) { return 'data-style="' + f + '"'; }) + '</div></div><div class="collection-controls"><div class="filters" role="group" aria-label="' + u('collection') + '">' + shop.categories.map(function (c) { return '<button data-filter="' + c.id + '" aria-pressed="' + (category === c.id) + '">' + esc(c[language]) + '</button>'; }).join('') + '</div><label class="search"><span class="sr-only">' + u('search') + '</span><input type="search" id="product-search" value="' + esc(search) + '" placeholder="' + u('search') + '"><span aria-hidden="true">⌕</span></label></div><p id="results-count" aria-live="polite"></p><div class="product-grid" id="products"></div></section>';
  }
  function bindProductLinks() { document.querySelectorAll('[data-product]').forEach(function (button) { button.onclick = function () { openProduct(button.dataset.product, button.dataset.finish || cardStyles[button.dataset.product] || style); }; }); }
  function renderProducts() {
    if (!document.getElementById('products')) return;
    var matches = shop.products.filter(function (p) { return (category === 'all' || p.category === category) && (t(p.name) + ' ' + t(p.short)).toLocaleLowerCase().includes(search.toLocaleLowerCase()); });
    matches.sort(function(a,b){return (Number(!!b.featured)*2+Number(!!b.detailedMiniature))-(Number(!!a.featured)*2+Number(!!a.detailedMiniature));});
    document.getElementById('results-count').textContent = matches.length + ' ' + u('count');
    document.getElementById('products').innerHTML = matches.length ? matches.map(function (p) {
      var finish = cardStyles[p.id] || style, photo = finishImage(p, finish);
      return '<article class="product" data-product-card="' + p.id + '"><button class="product-art" data-product="' + p.id + '" aria-label="' + esc(u('details') + ': ' + t(p.name)) + '"><img src="' + image(photo.image) + '" alt="' + esc(t(photo.alt)) + '" width="1254" height="1254" loading="lazy"><span class="art-arrow" aria-hidden="true">↗</span></button><div class="product-topline"><span>' + esc(shop.categories.find(function (c) { return c.id === p.category; })[language]) + '</span><span class="availability">' + availability(p) + '</span></div><h3><button data-product="' + p.id + '">' + esc(t(p.name)) + '</button></h3><p>' + esc(t(p.short)) + '</p>' + (p.finishes ? '<div class="card-finishes" role="group" aria-label="' + esc(u('choose') + ': ' + t(p.name)) + '">' + swatches(finish, function (f) { return 'data-card-finish="' + f + '" data-card-id="' + p.id + '"'; }) + '</div>' : '') + '<p class="product-price">'+tr('Richtprijs ','Guide price ')+ '<strong>'+price(p,finish)+'</strong></p><p class="card-image-note">' + imageLabel(photo) + '</p></article>';
    }).join('') : '<p class="no-results">' + u('noResults') + '</p>';
    bindProductLinks();
    document.querySelectorAll('[data-card-finish]').forEach(function (button) { button.onclick = function () {
      var id = button.dataset.cardId; cardStyles[id] = button.dataset.cardFinish;
      var card = document.querySelector('[data-product-card="' + id + '"]'), photo = finishImage(productById(id), cardStyles[id]);
      card.querySelector('img').src = image(photo.image); card.querySelector('img').alt = t(photo.alt); card.querySelector('.card-image-note').textContent = imageLabel(photo); card.querySelector('.product-price strong').textContent=price(productById(id),cardStyles[id]);
      card.querySelectorAll('[data-card-finish]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
    }; });
  }
  function changeStyle(finish) {
    style = finish; cardStyles = {}; remember('bonsai3d-style', style);
    var url = new URL(location.href); url.searchParams.set('style', style); history.replaceState(null, '', url);
    document.querySelectorAll('[data-style]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.style === style)); });
    renderProducts();
    updateLinks();
  }
  function bind() {
    document.querySelectorAll('[data-filter]').forEach(function (button) { button.onclick = function () { category = button.dataset.filter; var url = new URL(location.href); if (category === 'all') url.searchParams.delete('category'); else url.searchParams.set('category',category); history.replaceState(null,'',url); document.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); }); renderProducts(); }; });
    var searchInput = document.getElementById('product-search');
    if (searchInput) searchInput.oninput = function (event) { search = event.target.value; renderProducts(); };
    document.querySelectorAll('[data-style]').forEach(function (button) { button.onclick = function () { changeStyle(button.dataset.style); }; });
    document.querySelectorAll('[data-browse-style]').forEach(function (button) { button.onclick = function () { location.href = pageUrl('collection',{style:button.dataset.browseStyle}); }; });
    document.querySelectorAll('[data-open-inquiry]').forEach(function (button) { button.onclick = openInquiry; });
    document.querySelectorAll('[data-language]').forEach(function (button) { button.onclick = function () {
      var active = activeProduct, finish = activeFinish;
      language = button.dataset.language; remember('ruben-shop-language', language);
      var url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url);
      render(); if (active) openProduct(active, finish);
    }; });
    var toggle = document.querySelector('.menu-toggle'), nav = document.getElementById('main-nav');
    toggle.onclick = function () { var open = nav.classList.toggle('mobile-open'); toggle.setAttribute('aria-expanded', String(open)); };
    nav.querySelectorAll('a').forEach(function (a) { a.onclick = function () { nav.classList.remove('mobile-open'); toggle.setAttribute('aria-expanded','false'); }; });
  }
  function toast(message) { clearTimeout(toastTimer); var node = document.querySelector('.toast'); node.textContent = message; node.classList.add('visible'); toastTimer = setTimeout(function () { node.classList.remove('visible'); }, 3000); }
  function updateCount() { document.querySelectorAll('.count').forEach(function (node) { node.textContent = total(); }); }
  function closeButton() { return '<button class="dialog-close" type="button" aria-label="' + u('close') + '">×</button>'; }
  function setupDialog(dialog) {
    dialog.querySelector('.dialog-close').onclick = function () { dialog.close(); };
    dialog.onclick = function (event) { if (event.target === dialog) { var b = dialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close(); } };
  }
  function productUrl(id, finish) { var url = new URL(location.href); url.searchParams.set('product',id); url.searchParams.set('finish',finish); history.replaceState(null,'',url); }
  function openProduct(id, finish) {
    var p = productById(id); if (!p) { toast(u('archived')); return; }
    finish = p.options.includes(finish) ? finish : p.options[0]; activeProduct = id; activeFinish = finish; lastFocus = document.activeElement;
    var gallery = p.finishes ? ['wood','black'].map(function (f) { return Object.assign({finish:f},p.finishes[f]); }).concat(p.gallery.filter(function (photo) { return photo.image !== p.finishes.wood.image && photo.image !== p.finishes.black.image; })) : (p.gallery || [{image:p.image,visualKind:p.visualKind,alt:p.imageAlt}]);
    var finishForm = p.finishes ? '<fieldset class="product-finishes"><legend>' + u('choose') + '</legend>' + p.options.map(function (f) { return '<label class="finish-choice"><input type="radio" name="finish" value="' + f + '"' + (finish === f ? ' checked' : '') + '><span class="finish-dot ' + f + '" aria-hidden="true"></span><span>' + u(f) + '</span></label>'; }).join('') + '</fieldset>' : '<label>' + (p.category === 'miniatures' ? u('choose') : u('potFinish')) + '<select name="finish">' + p.options.map(function(f){return '<option value="'+f+'"'+(finish===f?' selected':'')+'>'+finishLabel(f)+'</option>';}).join('')+'</select></label>';
    var dialog = document.getElementById('product-dialog');
    dialog.innerHTML = closeButton() + '<div class="product-dialog-layout"><div class="product-gallery"><figure><img id="product-main-image" alt=""><figcaption><strong id="product-image-label"></strong><span id="product-image-note"></span><a id="product-original-photo" target="_blank" rel="noopener">' + u('original') + ' ↗</a></figcaption></figure><div class="gallery-thumbnails" role="group" aria-label="' + esc(t(p.name)) + '">' + gallery.map(function (photo, i) { return '<button type="button" data-image-index="' + i + '" aria-pressed="false" aria-label="' + esc(imageLabel(photo) + ' ' + (i + 1) + ': ' + t(photo.alt)) + '"><img src="' + image(photo.image) + '" alt="" width="90" height="90"></button>'; }).join('') + '</div></div><div class="product-dialog-copy"><p class="eyebrow">BONSAI3D / ' + (p.stage === 'made' ? tr('Zelfgemaakt exemplaar','Made example') : p.stage === 'printed' ? u('printed') : tr('Ontwerp in ontwikkeling','Design in development')) + '</p><h2 id="product-title">' + esc(t(p.name)) + '</h2><p>' + esc(t(p.short)) + '</p><div class="product-commerce"><p class="product-price">'+tr('Richtprijs per stuk ','Guide price per piece ')+'<strong id="product-price">'+price(p,finish)+'</strong></p><p class="availability">'+availability(p)+'</p><p class="fineprint">'+tr('Prijs voor het object; boom, planten, stenen en verzending niet inbegrepen. Potjes: beschikbare maat en kleur bevestigen we bij de aanvraag.','Price covers the object; tree, plants, stones and delivery excluded. Pots: available size and colour confirmed on enquiry.')+'</p></div><form id="product-form">' + finishForm + (p.options.length > 1 ? '<p class="fineprint">' + u('ownNote') + '</p>' : '') + '<label class="quantity-label">' + u('quantity') + '<input type="number" name="quantity" min="1" max="20" value="1" required></label><button type="submit" class="button primary">' + u('add') + ' +</button></form><p class="fineprint">' + u('quote') + '</p><details class="product-description"><summary>' + tr('Over dit object', 'About this object') + ' +</summary><p>' + esc(t(p.detail)) + '</p><p>' + esc(t(p.spec)) + '</p></details></div></div>';
    function showPhoto(index) {
      var photo = gallery[index], main = dialog.querySelector('#product-main-image'); main.src = image(photo.image); main.alt = t(photo.alt || p.name);
      dialog.querySelector('#product-image-label').textContent = imageLabel(photo); dialog.querySelector('#product-image-note').textContent = imageNote(photo);
      var source = photo.originalPhoto || (photo.visualKind === 'photo' ? photo.image : null), link = dialog.querySelector('#product-original-photo'); link.hidden = !source; if (source) link.href = image(source); else link.removeAttribute('href');
      dialog.querySelectorAll('[data-image-index]').forEach(function (button) { button.setAttribute('aria-pressed',String(Number(button.dataset.imageIndex) === index)); });
      if (photo.finish) { document.getElementById('product-price').textContent=price(p,photo.finish); activeFinish = photo.finish; dialog.querySelector('[name=finish][value=' + activeFinish + ']').checked = true; productUrl(id,activeFinish); }
    }
    dialog.querySelectorAll('[data-image-index]').forEach(function (button) { button.onclick = function () { showPhoto(Number(button.dataset.imageIndex)); }; });
    dialog.querySelectorAll('[name=finish]').forEach(function (input) { input.onchange = function () { if (p.finishes && input.value!=='grey') showPhoto(input.value === 'black' ? 1 : 0); else { activeFinish=input.value; productUrl(id,activeFinish); } document.getElementById('product-price').textContent=price(p,input.value); if(input.value==='grey') dialog.querySelector('#product-image-note').textContent=tr('Ruw grijs is een kleurvoorkeur voor je aanvraag. De foto toont de beschikbare voorbeeldafwerking; er is nog geen grijs voorbeeldbeeld.','Raw grey is a colour preference for your enquiry. The photograph shows the available example finish; a grey preview is not yet available.'); }; });
    dialog.querySelector('form').onsubmit = function (event) {
      event.preventDefault(); var form = new FormData(event.currentTarget), chosen = form.get('finish'), quantity = Number(form.get('quantity'));
      if (!p.options.includes(chosen) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return;
      var row = selection.find(function (x) { return x.id === id && x.finish === chosen; }); if (row) row.quantity = Math.min(20,row.quantity + quantity); else selection.push({id:id,finish:chosen,quantity:quantity});
      save(); updateCount(); dialog.close(); toast(u('added'));
    };
    setupDialog(dialog);
    dialog.onclose = function () { activeProduct = null; var url = new URL(location.href); url.searchParams.delete('product'); url.searchParams.delete('finish'); history.replaceState(null,'',url); if (lastFocus && lastFocus.isConnected) lastFocus.focus(); };
    showPhoto(p.finishes && finish !== 'wood' ? 1 : 0); if(finish==='grey'){var greyInput=dialog.querySelector('[name=finish][value=grey]');if(greyInput)greyInput.checked=true; activeFinish='grey';dialog.querySelector('#product-image-note').textContent=tr('Ruw grijs op aanvraag; het beeld toont zwart.','Raw grey on enquiry; the image shows black.');} productUrl(id,finish); dialog.showModal();
  }
  function renderSelection() {
    var parent = document.getElementById('selection-items');
    parent.innerHTML = selection.length ? selection.map(function (row, i) { var p = productById(row.id); return '<div class="selection-row"><img src="' + image(finishImage(p,row.finish).image) + '" alt="" width="80" height="80"><div><strong>' + esc(t(p.name)) + '</strong><span>' + row.quantity + ' × ' + finishLabel(row.finish) + '</span></div><button type="button" data-remove="' + i + '" aria-label="' + esc(u('remove') + ': ' + t(p.name)) + '">×</button></div>'; }).join('') : '<p class="empty-selection">' + u('empty') + '</p>';
    parent.querySelectorAll('[data-remove]').forEach(function (button) { button.onclick = function () { selection.splice(Number(button.dataset.remove),1); save(); updateCount(); renderSelection(); document.querySelector('.request-output').hidden = true; document.getElementById('request-status').textContent = ''; }; });
  }
  function openInquiry() {
    lastFocus = document.activeElement; lastRequest = '';
    var dialog = document.getElementById('inquiry-dialog');
    dialog.innerHTML = closeButton() + '<div class="inquiry-inner"><p class="eyebrow">BONSAI3D / ' + u('selection') + '</p><h2 id="inquiry-title">' + u('enquiry') + '</h2><p>' + u('intro') + '</p><div id="selection-items"></div><form id="inquiry-form"><div class="form-pair"><label>' + u('name') + '<input name="name" autocomplete="name" maxlength="100" required></label><label>' + u('email') + '<input name="email" type="email" autocomplete="email" maxlength="150" required></label></div><label>' + u('idea') + '<textarea name="idea" rows="4" maxlength="3000" placeholder="' + u('hint') + '"></textarea></label><div class="form-dimensions">' + ['width','depth','height'].map(function (k) { return '<label>' + u(k) + '<input type="number" name="' + k + '" min="0.1" max="10000" step="0.1"></label>'; }).join('') + '</div><p class="local-notice">' + u('local') + '</p><button class="button primary" type="submit">' + u('create') + ' ↗</button><p id="request-status" role="status" aria-live="polite"></p></form><div class="request-output" hidden><pre id="request-text"></pre><div class="request-actions"><button class="button primary" id="download-request" type="button">' + u('download') + ' ↓</button><button class="button outline" id="copy-request" type="button">' + u('copy') + '</button></div></div></div>';
    renderSelection(); setupDialog(dialog); if(window.BonsaiDetails&&window.BonsaiDetails.draft)dialog.querySelector('[name=idea]').value=window.BonsaiDetails.draft;
    dialog.onclose = function () { if (lastFocus && lastFocus.isConnected) lastFocus.focus(); };
    dialog.querySelector('form').onsubmit = function (event) {
      event.preventDefault(); var form = new FormData(event.currentTarget);
      if (!selection.length && !String(form.get('idea') || '').trim()) { document.getElementById('request-status').textContent = u('error'); return; }
      lastRequest = u('draft') + '\n\n' + u('noOrder') + '\n\n' + u('selection') + '\n' + selection.map(function (row) { return row.quantity + ' × ' + t(productById(row.id).name) + ' — ' + finishLabel(row.finish)+' · '+tr('richtprijs ','guide price ')+price(productById(row.id),row.finish)+' / '+tr('stuk','piece'); }).join('\n') + '\n\n' + u('name') + ': ' + form.get('name') + '\n' + u('email') + ': ' + form.get('email') + '\n\n' + u('idea') + '\n' + (form.get('idea') || '') + '\n\n' + ['width','depth','height'].map(function (k) { return u(k) + ': ' + (form.get(k) || '—'); }).join('\n') + '\n\n' + tr('Selectie richttotaal: ','Selection guide total: ')+BonsaiPricing.money(selection.reduce(function(sum,row){return sum+row.quantity*BonsaiPricing.product(productById(row.id),row.finish);},0),language)+'\n'+u('quote');
      document.getElementById('request-text').textContent = lastRequest; dialog.querySelector('.request-output').hidden = false; document.getElementById('request-status').textContent = u('ready');
    };
    document.getElementById('download-request').onclick = function () { var url = URL.createObjectURL(new Blob([lastRequest],{type:'text/plain;charset=utf-8'})), anchor = document.createElement('a'); anchor.href = url; anchor.download = 'bonsai3d-' + u('fileName') + '.txt'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(function () { URL.revokeObjectURL(url); },1000); };
    document.getElementById('copy-request').onclick = async function () { try { await navigator.clipboard.writeText(lastRequest); document.getElementById('request-status').textContent = u('copied'); } catch (_) { document.getElementById('request-status').textContent = u('copyFailed'); } };
    dialog.showModal();
  }
  render();
  if (location.hash) requestAnimationFrame(function () { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); });
  if (query.get('product')) openProduct(query.get('product'),query.get('finish') || style);
})().catch(function (error) {
  document.getElementById('app').innerHTML = '<p class="load-error">De collectie kon niet worden geladen. <a href="./">Probeer opnieuw</a>.</p>';
  console.error(error);
});
