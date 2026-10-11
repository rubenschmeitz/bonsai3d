(async function () {
  'use strict';
  var backendAvailable = false;
  var response = await fetch('./assets/catalogue.json');
  if (!response.ok) throw new Error('Catalogue unavailable');
  window.SHOP_DATA = await response.json();
  var shop = window.SHOP_DATA[document.body.dataset.shop];
  // Keep saved selections across the public rename; API brand keys are stable.
  if (shop.previousSlug) {
    try {
      if (!localStorage.getItem(shop.slug + '-selection')) {
        var previousSelection = [shop.previousSlug].concat(shop.previousSlugs || []).map(function(slug) { return localStorage.getItem(slug + '-selection'); }).find(function(value) {return value !== null;});
        if (previousSelection) localStorage.setItem(shop.slug + '-selection', previousSelection);
      }
    } catch (_) {}
  }
  var storedLanguage;
  try { storedLanguage = localStorage.getItem('ruben-shop-language'); } catch (_) {}
  var params = new URLSearchParams(location.search);
  var language = params.get('lang') || storedLanguage || 'nl';
  if (language !== 'en') language = 'nl';
  var category = 'all';
  var search = '';
  var season = 'all';
  var selection = [];
  var currentProduct = null;
  var previousFocus = null;
  var lastRequest = '';
  var requestKey = null;
  var lastPayload = '';
  try {
    var parsed = JSON.parse(localStorage.getItem(shop.slug + '-selection') || '[]');
    if (Array.isArray(parsed)) selection = parsed.filter(function (x) { return shop.products.some(function (p) { return p.id === x.id; }) && Number.isInteger(x.quantity) && x.quantity > 0 && x.quantity <= 20 && typeof x.finish === 'string'; });
  } catch (_) {}
  var ui = {
    nl: {collection:'Collectie',custom:'Op maat',studio:'Het atelier',guide:'Goed om te weten',selection:'Mijn selectie',menu:'Menu',skip:'Ga naar de inhoud',draft:'Eerste ontwerpvoorstel · prijzen en beschikbaarheid worden nog vastgesteld',browse:'Bekijk de collectie',customCta:'Bespreek jouw idee',preview:'MODELRENDER',design:'Ontwerpselectie',request:'Op aanvraag',details:'Bekijk ontwerp',search:'Zoek in de collectie',noResults:'Geen ontwerpen gevonden. Probeer een andere zoekterm.',viewAll:'Bekijk alles',step1:'Kies een richting',step1text:'Een bestaand ontwerp of een idee van jezelf.',step2:'Maak het persoonlijk',step2text:'Bespreek maat, kleur en de details die ertoe doen.',step3:'Stem de uitvoering af',step3text:'Ontwerp, prijs en planning vóór een bestelling.',name:'Naam',email:'E-mailadres',idea:'Jouw idee of wensen',ideaHint:'Bijvoorbeeld: maat, kleur, gelegenheid of de afmetingen van je pot.',create:'Maak mijn aanvraag',local:'Je maakt hier een aanvraag op je eigen apparaat. Er wordt nog niets verstuurd.',download:'Download aanvraag',copy:'Kopieer aanvraag',copied:'Aanvraag gekopieerd.',copyFailed:'Kopiëren lukte niet. Download de aanvraag hieronder.',requestReady:'Je aanvraag is klaar. Download of kopieer hem; er is nog niets verstuurd.',empty:'Je selectie is nog leeg.',emptyMore:'Kies een ontwerp uit de collectie of beschrijf hieronder een eigen idee.',remove:'Verwijder',close:'Sluiten',finish:'Voorkeur voor uitstraling',quantity:'Aantal',add:'Voeg toe aan mijn selectie',added:'Toegevoegd aan je selectie.',renderNote:'Modelrender uit het printarchief. Kleur en afwerking zijn indicatief.',priceNote:'Prijs en planning na afstemming van de uitvoering.',partner:'Ook van Ruben',smallLabel:'EEN IDEE MET KARAKTER',studioLabel:'DE MAKER',guideLabel:'AANVRAAG & UITVOERING',selectionIntro:'Bewaar de ontwerpen die je aanspreken en maak er één aanvraag van.',colourHeading:'Kleurvoorkeur',fileName:'aanvraag',itemsLabel:'Mijn ontwerpselectie',personalInfo:'Mijn gegevens',requestTitle:'Aanvraag aan ',noOrder:'Dit is een aanvraagconcept, geen bestelling.',saved:'Ontwerpversie · nog geen actieve webshop',back:'Terug naar de collectie',count:'ontwerpen',caption:'Modelrender · fysieke uitvoering te bevestigen',formError:'Kies een ontwerp of beschrijf eerst jouw idee.',finishes:{warm:'Warm & kleurrijk',natural:'Rustig & natuurlijk',custom:'Eigen voorkeur',original:'Zoals het model',earth:'Aardetinten',dark:'Donker & ingetogen'}},
    en: {collection:'Collection',custom:'Custom design',studio:'The studio',guide:'Good to know',selection:'My selection',menu:'Menu',skip:'Skip to content',draft:'First design preview · prices and availability are still to be set',browse:'Explore the collection',customCta:'Discuss your idea',preview:'MODEL RENDER',design:'Design selection',request:'On enquiry',details:'View design',search:'Search the collection',noResults:'No designs found. Try a different search term.',viewAll:'Explore everything',step1:'Choose a direction',step1text:'An existing design or an idea of your own.',step2:'Make it personal',step2text:'Discuss size, colour and the details that matter.',step3:'Agree the version',step3text:'Design, price and timing before an order.',name:'Name',email:'Email address',idea:'Your idea or preferences',ideaHint:'For example: size, colour, occasion or your pot’s dimensions.',create:'Prepare my enquiry',local:'You are preparing an enquiry on your own device. Nothing is sent yet.',download:'Download enquiry',copy:'Copy enquiry',copied:'Enquiry copied.',copyFailed:'Copying was unavailable. Download your enquiry below.',requestReady:'Your enquiry is ready. Download or copy it; nothing has been sent.',empty:'Your selection is empty.',emptyMore:'Choose a design from the collection or describe your own idea below.',remove:'Remove',close:'Close',finish:'Preferred look',quantity:'Quantity',add:'Add to my selection',added:'Added to your selection.',renderNote:'Model render from the print archive. Colour and finish are illustrative.',priceNote:'Price and timing follow discussion of the final version.',partner:'Also by Ruben',smallLabel:'AN IDEA WITH CHARACTER',studioLabel:'THE MAKER',guideLabel:'ENQUIRY & FINAL VERSION',selectionIntro:'Save the designs you like and prepare one enquiry.',colourHeading:'Colour preference',fileName:'enquiry',itemsLabel:'My design selection',personalInfo:'My details',requestTitle:'Enquiry for ',noOrder:'This is an enquiry draft, not an order.',saved:'Design preview · this shop is not taking orders yet',back:'Back to the collection',count:'designs',caption:'Model render · physical version to be confirmed',formError:'Choose a design or describe your idea first.',finishes:{warm:'Warm & colourful',natural:'Quiet & natural',custom:'My own preference',original:'Like the model',earth:'Earth tones',dark:'Dark & understated'}}
  };
  Object.assign(ui.nl, {draft:'Lokaal ontwerpvoorstel · werknaam · collectie op aanvraag', preview:'ONTWERPVOORBEELD', requestTitle:'Aanvraag aan ', create:'Bewaar mijn aanvraag', local:'In deze lokale proefversie wordt je aanvraag opgeslagen in Rubens atelier op deze pc. Dit is nog geen bestelling.', requestReady:'Aanvraag opgeslagen in het lokale atelier. Je krijgt een referentienummer; er is nog geen bestelling geplaatst.', saved:'Ontwerpvoorstel · werknaam nog te controleren',kind:'Wat wil je laten maken?',kindCatalogue:'Een ontwerp uit de collectie',kindExisting:'Een bestaand model laten printen',kindFunctional:'Een passend onderdeel of decoratie op maat',kindFigure:'Een persoonlijk figuur of een scène',width:'Breedte (mm)',depth:'Diepte (mm)',height:'Hoogte (mm)',budget:'Budgetindicatie (€)',modelUrl:'Modellink (optioneel)',files:'Foto’s of modelbestanden (maximaal 3, samen 8 MB)',fileHelp:'PNG, JPG, WebP, STL of 3MF. Alleen als referentie bij je aanvraag.',saving:'Je aanvraag wordt opgeslagen…',saveError:'Opslaan lukte niet. Je concept kun je wel downloaden. Probeer het opnieuw.',seasonLabel:'Kies jouw seizoen',seasonAll:'Alle seizoenen',spring:'Lente',summer:'Zomer',autumn:'Herfst',winter:'Winter',inspiration:'Meer uit het ontwerpatelier',inspirationIntro:'Bestaande gegenereerde ideeën uit Rubens archief. De beelden laten de ontwerprichting zien.',concept:'GEGENEREERD CONCEPT',reference:'BRONVOORBEELD',related:'VERWANT ONTWERP',renderNote:'Ontwerpbeeld; de definitieve uitvoering spreken we samen af.',formError:'Kies een ontwerp of beschrijf je idee en vul je naam en e-mailadres in.',offline:'Deze pagina is offline: je maakt een downloadbaar concept. Er wordt niets verstuurd.'});
  Object.assign(ui.en, {draft:'Local design preview · working name · collection on enquiry',preview:'DESIGN PREVIEW',create:'Save my enquiry',local:'In this local trial, your enquiry is saved to Ruben’s workshop on this PC. It is not an order yet.',requestReady:'Enquiry saved to the local workshop. You receive a reference number; no order has been placed.',saved:'Design preview · working name awaiting checks',kind:'What would you like made?',kindCatalogue:'A design from the collection',kindExisting:'Print an existing model',kindFunctional:'A fitted part or custom decoration',kindFigure:'A personal figure or scene',width:'Width (mm)',depth:'Depth (mm)',height:'Height (mm)',budget:'Budget indication (€)',modelUrl:'Model link (optional)',files:'Photos or model files (up to 3, 8 MB total)',fileHelp:'PNG, JPG, WebP, STL or 3MF. Used as references for your enquiry.',saving:'Saving your enquiry…',saveError:'Saving was unavailable. You can still download your draft. Please try again.',seasonLabel:'Choose your season',seasonAll:'All seasons',spring:'Spring',summer:'Summer',autumn:'Autumn',winter:'Winter',inspiration:'More from the design studio',inspirationIntro:'Existing generated ideas from Ruben’s archive. These images show the design direction.',concept:'GENERATED CONCEPT',reference:'SOURCE REFERENCE',related:'RELATED DESIGN',renderNote:'Design image; the final version is agreed together.',formError:'Choose a design or describe your idea, then enter your name and email.',offline:'This page is offline: you are preparing a downloadable draft. Nothing is sent.'});
  function t(value) { return value && typeof value === 'object' ? value[language] : value; }
  function u(key) { return ui[language][key]; }
  function esc(value) { return String(value === undefined ? '' : value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function image(path) { return './assets/' + path; }
  function imageLabel(p) { return u(p.visualKind === 'concept' ? 'concept' : p.visualKind === 'photo' ? 'photo' : p.visualKind === 'finished' ? 'finished' : p.visualKind === 'reference' ? 'reference' : 'preview'); }
  function imageNote(p) { return u(p.visualKind === 'concept' ? 'conceptNote' : p.visualKind === 'photo' ? 'photoNote' : p.visualKind === 'reference' ? 'referenceNote' : 'finishedNote'); }
  function stageLabel(p) { return (ui[language].stages || {})[p.stage] || u('request'); }
  function total() { return selection.reduce(function (n,x) { return n+x.quantity; },0); }
  function save() { try { localStorage.setItem(shop.slug + '-selection', JSON.stringify(selection)); } catch (_) {} }
  function productById(id) { return shop.products.find(function (p) { return p.id === id; }); }
  function lineText(text) { return esc(text).replace(/\n/g,'<br>'); }
  Object.assign(ui.nl, {collection:'Producten',studio:'Over Ruben',browse:'Bekijk producten',customCta:'Vraag maatwerk aan',design:'3D-printontwerp',details:'Bekijk details',preview:'3D-MODEL',reference:'VOORBEELD VAN DE MAKER',concept:'CONCEPTBEELD',related:'VERWANT MODEL',seasonLabel:'Per seizoen',step1:'Stuur je idee',step1text:'Voeg een model, foto, schets of de maten toe.',step2:'Bespreek de uitvoering',step2text:'We stemmen ontwerp, materiaal en prijs af.',step3:'Keur de variant goed',step3text:'Je kiest de uitvoering voordat er wordt geprint.',inspiration:'Concepten uit de werkplaats',inspirationIntro:'Deze beelden zijn gegenereerde ontwerpideeën. Je kunt ze gebruiken als vertrekpunt voor maatwerk.',categoryHeading:'Bekijk per categorie',featured:'Uit het printarchief',seeModel:'Bekijk dit model',printNote:'3D-print · kleur en maat op aanvraag'});
  Object.assign(ui.en, {collection:'Products',studio:'About Ruben',browse:'Browse products',customCta:'Request custom work',design:'3D print design',details:'View details',preview:'3D MODEL',reference:'MAKER’S EXAMPLE',concept:'CONCEPT IMAGE',related:'RELATED MODEL',seasonLabel:'By season',step1:'Share your idea',step1text:'Add a model, photo, sketch or dimensions.',step2:'Discuss the version',step2text:'We agree the design, material and price.',step3:'Approve the version',step3text:'You choose the final version before printing.',inspiration:'Workshop concepts',inspirationIntro:'These images are generated design ideas. They can be a starting point for custom work.',categoryHeading:'Browse by category',featured:'From the print archive',seeModel:'View this model',printNote:'3D print · colour and size on enquiry'});
  Object.assign(ui.nl, {photo:'PRODUCTFOTO',finished:'PRODUCTVISUALISATIE',design:'3D-geprint accessoire',seeModel:'Bekijk product',inspiration:'Maatwerk in beeld',inspirationIntro:'Een persoonlijk figuur, een miniatuur van jouw boom of een bijzondere presentatie. Deze productvisualisaties tonen mogelijke afgewerkte uitvoeringen.',photoNote:'Foto van een bestaand exemplaar. Een nieuwe uitvoering stemmen we samen af.',finishedNote:'Gegenereerde visualisatie van een afgewerkt product. Kleur, afwerking en uitvoering spreken we samen af; afgebeelde planten en styling zijn ter illustratie.',referenceNote:'Afgewerkt productvoorbeeld van de ontwerper. Jouw printuitvoering stemmen we samen af.',galleryImage:'Afbeelding',stages:{printed:'Eerder geprint',development:'Ontwerp in ontwikkeling',custom:'Op maat',concept:'Maatwerkconcept'}});
  Object.assign(ui.en, {photo:'PRODUCT PHOTO',finished:'PRODUCT VISUALISATION',design:'3D-printed accessory',seeModel:'View product',inspiration:'Custom work in pictures',inspirationIntro:'A personal figure, a miniature of your tree or an unusual display. These product visualisations show possible finished versions.',photoNote:'Photograph of an existing example. We agree a new version together.',finishedNote:'Generated visualisation of a finished product. Colour, finish and the final version are agreed together; plants and styling are illustrative.',referenceNote:'Finished product example from the designer. We agree your printed version together.',galleryImage:'Image',stages:{printed:'Previously printed',development:'Design in development',custom:'Custom work',concept:'Custom concept'}});
  Object.assign(ui.nl, {originalPhoto:'Bekijk oorspronkelijke foto'});
  Object.assign(ui.en, {originalPhoto:'View original photograph'});
  Object.assign(ui.nl, {concept:'GEGENEREERD CONCEPTBEELD',conceptNote:'Gegenereerd beeld van een eigen ontwerpidee. Nog niet geprint; maat, materiaal en haalbaarheid zijn te ontwikkelen. Planten, stenen en prenten zijn styling, niet inbegrepen.'});
  Object.assign(ui.en, {concept:'GENERATED CONCEPT IMAGE',conceptNote:'Generated image of an original design idea. Not yet printed; dimensions, material and feasibility need development. Plants, stones and artwork are styling, not included.'});
  function originalPhotoLink(photo) {
    return '<a id="product-original-photo" class="original-photo-link" target="_blank" rel="noopener"' + (photo.originalPhoto ? ' href="' + esc(image(photo.originalPhoto)) + '"' : ' hidden') + '>' + esc(u('originalPhoto')) + ' ↗</a>';
  }
  Object.assign(ui.nl.stages, {prototype:'Prototype in ontwikkeling',future:'Ontwerpconcept · nog niet geprint'});
  Object.assign(ui.en.stages, {prototype:'Prototype in development',future:'Design concept · not yet printed'});
  if (shop.exhibition) { ui.nl.caption='Gegenereerd presentatievoorbeeld'; ui.en.caption='Generated display illustration'; }
  function logo() { return '<a class="brand" href="./" aria-label="' + esc(shop.brand) + '"><img class="brand-wordmark" src="' + image('brand/' + shop.slug + '-logo-primary.svg') + '" alt="' + esc(shop.brand) + '" width="210" height="44"><span class="brand-descriptor">' + esc(t(shop.subtitle)) + '</span></a>'; }
  function heroShowcase() {
    if (shop.atmosphere) {
      var featured=productById(shop.featuredProduct);
      return '<div class="hero-showcase has-scene"><figure class="hero-scene"><img src="' + image(shop.atmosphere.image) + '" alt="' + esc(t(shop.atmosphere.alt)) + '" width="1254" height="1254" fetchpriority="high"><figcaption>' + esc(t(shop.atmosphere.caption)) + '</figcaption></figure><figure class="hero-figure featured"><button class="hero-photo" data-product="' + featured.id + '" aria-label="' + esc(u('seeModel') + ': ' + t(featured.name)) + '"><img src="' + image(featured.image) + '" alt="' + esc(t(featured.name) + ' — ' + imageLabel(featured)) + '" width="1000" height="1000"></button><figcaption><span><strong>' + esc(t(featured.name)) + '</strong><small>' + imageLabel(featured) + '</small></span><button data-product="' + featured.id + '" aria-label="' + esc(u('details') + ': ' + t(featured.name)) + '">→</button></figcaption></figure></div>';
    }
    return '<div class="hero-showcase">' + [shop.featuredProduct,shop.secondaryProduct].map(function(id,index) {
      var p = productById(id);
      return '<figure class="hero-figure' + (index ? ' secondary' : '') + '"><button class="hero-photo" data-product="' + p.id + '" aria-label="' + esc(u('seeModel') + ': ' + t(p.name)) + '"><img src="' + image(p.image) + '" alt="' + esc(t(p.name) + ' — ' + imageLabel(p)) + '" width="1000" height="1000" fetchpriority="' + (index ? 'auto' : 'high') + '"></button><figcaption><span><strong>' + esc(t(p.name)) + '</strong><small>' + imageLabel(p) + '</small></span><button data-product="' + p.id + '" aria-label="' + esc(u('details') + ': ' + t(p.name)) + '">→</button></figcaption></figure>';
    }).join('') + '</div>';
  }
  function categoryShortcuts() {
    var icons = {
      pot:'<path d="M9 22h46l-7 24H16zM7 22h50M24 46v4m16-4v4M32 22V10m0 6-9-6m9 4 9-6"/>',
      table:'<path d="M8 21h48v7H8zM13 28v23m38-23v23M13 43h38M24 28v15m16-15v15"/>',
      tools:'<path d="M10 37h44v12H10zM16 37V16h9v21m13 0V10h9v27M13 49v5m38-5v5M38 23h9"/>',
      rack:'<path d="M12 12v43m40-43v43M8 24h48M8 43h48M20 14h9l-2 10h-5zM35 32h10l-2 11h-6z"/>',
      slab:'<path d="m8 38 10-11 14 2 8-10 15 7-2 16-26 5zM18 27l5-10 6 2m11 0 3-8m-3 9 8-6M15 46v7m31-8v8"/>',
      figure:'<circle cx="31" cy="14" r="7"/><path d="M23 29h16l3 16H20zM25 45l-4 10m15-10 5 10M23 29l-10 9m26-9 11 5M49 33v13m-5 0h10"/>'
    };
    return '<section class="category-section wrap" aria-labelledby="category-heading"><h2 id="category-heading">' + u('categoryHeading') + '</h2><div class="category-shortcuts">' + shop.shortcuts.map(function(item) {
      var c=shop.categories.find(function(c){return c.id===item.category;});
      var art=item.product ? '<img src="' + image(productById(item.product).image) + '" alt="" width="512" height="512" loading="lazy">' : '<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' + icons[item.icon] + '</svg>';
      return '<button class="category-shortcut" data-category="' + c.id + '"><span class="category-art">' + art + '</span><span class="category-label"><strong>' + esc(c[language]) + '</strong><small>' + esc(t(item.note)) + '</small></span><span class="category-arrow" aria-hidden="true">→</span></button>';
    }).join('') + '</div></section>';
  }
  function render() {
    var active = currentProduct;
    document.documentElement.lang = language;
    document.body.classList.toggle('studio-products', shop.imageStyle === 'studio');
    document.title = t(shop.title);
    document.querySelector('meta[name="description"]').content = t(shop.intro);
    document.getElementById('app').innerHTML =
      '<a class="skip" href="#main">' + u('skip') + '</a>' +
      '<div class="preview-bar">' + u('draft') + '</div>' +
      '<header class="site-header"><div class="header-inner">' + logo() +
      '<button class="menu-toggle" aria-label="' + u('menu') + '" aria-expanded="false" aria-controls="main-nav">☰</button>' +
      '<nav id="main-nav" aria-label="' + u('menu') + '"><a href="#collection">' + u('collection') + '</a><a href="#custom">' + u('custom') + '</a><a href="#studio">' + u('studio') + '</a></nav>' +
      '<div class="header-actions"><div class="languages" role="group" aria-label="Language / Taal"><button data-language="nl" aria-pressed="' + (language === 'nl') + '">NL</button><span>/</span><button data-language="en" aria-pressed="' + (language === 'en') + '">EN</button></div><button class="selection-toggle" data-open-inquiry><span class="selection-label">' + u('selection') + '</span><span class="count">' + total() + '</span></button></div></div></header>' +
      '<main id="main"><section class="hero wrap"><div class="japan-rail" aria-hidden="true"><span class="japan-script" lang="ja">' + (document.body.dataset.shop === 'bonsai' ? '盆栽' : '暮らし') + '</span><span class="japan-rail-line"></span><span class="japan-rail-note">3D PRINT</span></div><div class="hero-copy"><p class="eyebrow">' + t(shop.subtitle) + '</p><h1>' + esc(t(shop.hero)[0]) + '<br><em>' + esc(t(shop.hero)[1]) + '</em></h1><p class="hero-intro">' + t(shop.intro) + '</p><div class="hero-actions"><a class="button primary" href="#collection">' + u('browse') + ' <span aria-hidden="true">→</span></a><a class="text-link" href="#custom">' + u('customCta') + '</a></div><p class="hero-print-note">' + u('printNote') + '</p></div>' + heroShowcase() + '</section>' + categoryShortcuts() +
      '<section class="collection wrap" id="collection"><div class="section-heading"><h2>' + t(shop.shopTitle) + '</h2><p>' + t(shop.shopIntro) + '</p></div><div class="collection-controls"><div class="filters" role="group" aria-label="' + u('collection') + '">' + collectionCategories().map(function (c) { return '<button data-filter="' + c.id + '" aria-pressed="' + (category === c.id) + '">' + c[language] + '</button>'; }).join('') + '</div><label class="search"><span class="sr-only">' + u('search') + '</span><input type="search" id="product-search" value="' + esc(search) + '" placeholder="' + u('search') + '"><span aria-hidden="true">⌕</span></label></div><p id="results-count" aria-live="polite"></p><div class="product-grid" id="products"></div></section>' +
      '<section class="custom-section" id="custom"><div class="custom-inner wrap"><div><p class="eyebrow">' + u('custom') + '</p><h2>' + lineText(t(shop.customTitle)) + '</h2></div><div class="custom-copy"><p>' + t(shop.customIntro) + '</p><button class="button primary" data-open-inquiry>' + u('customCta') + ' <span aria-hidden="true">→</span></button></div><div class="process">' + [1,2,3].map(function (n) { return '<div><span class="process-number">' + n + '</span><h3>' + u('step' + n) + '</h3><p>' + u('step' + n + 'text') + '</p></div>'; }).join('') + '</div></div></section>' +
      (shop.inspiration ? '<section class="inspiration wrap"><div class="section-heading"><h2>' + u('inspiration') + '</h2><p>' + u('inspirationIntro') + '</p></div><div class="inspiration-grid">' + shop.inspiration.map(function(p) { return '<figure><img src="' + image(p.image) + '" alt="' + esc(t(p.name)) + '" loading="lazy" width="1024" height="1024"><figcaption><strong>' + t(p.name) + '</strong><span>' + imageLabel(p) + '</span></figcaption></figure>'; }).join('') + '</div></section>' : '') +
      '<section class="studio wrap" id="studio"><figure class="studio-art"><img src="' + image(shop.storyImage) + '" alt="' + esc(imageLabel({visualKind:shop.storyVisualKind})) + '" width="512" height="512" loading="lazy"><figcaption>' + u('caption') + '</figcaption></figure><div class="studio-copy"><p class="eyebrow">' + u('studioLabel') + '</p><h2>' + lineText(t(shop.storyTitle)) + '</h2><p>' + t(shop.story) + '</p><a class="text-link" href="../' + shop.partner + '/">' + u('partner') + ': ' + shop.partnerName + ' →</a></div></section>' +
      '<section class="guide wrap" id="guide"><div><h2>' + t(shop.guideTitle) + '</h2></div><div class="faqs">' + shop.faqs.map(function (f) { return '<details><summary>' + esc(t(f.q)) + '<span aria-hidden="true">+</span></summary><p>' + esc(t(f.a)) + '</p></details>'; }).join('') + '</div></section></main>' +
      '<footer class="wrap"><div>' + logo() + '<p>' + t(shop.subtitle) + '</p></div><div><a href="#custom">' + u('customCta') + '</a></div><p class="footer-note">' + u('saved') + '</p></footer>' +
      '<dialog id="product-dialog" aria-labelledby="product-title"></dialog>' +
      '<dialog id="inquiry-dialog" aria-labelledby="inquiry-title"></dialog>' +
      '<div class="toast" role="status" aria-live="polite"></div>';
    renderProducts();
    if (shop.seasonal) {
      var seasons = document.createElement('div'); seasons.className = 'season-selector';
      seasons.innerHTML = '<span>' + u('seasonLabel') + '</span><div role="group" aria-label="' + u('seasonLabel') + '">' + ['all','spring','summer','autumn','winter'].map(function (s) { return '<button data-season="' + s + '" aria-pressed="' + (season===s) + '">' + (s==='all' ? u('seasonAll') : u(s)) + '</button>'; }).join('') + '</div>';
      document.querySelector('.collection-controls').before(seasons);
    }
    if (shop.exhibition && window.BonsaiExhibition) window.BonsaiExhibition.mount({shop:shop,language:language,openProduct:openProduct,requestDesign:requestDesign});
    bind();
    if (active) openProduct(active, false);
  }
  function collectionCategories() {
    return shop.categories.filter(function(c) {return !shop.exhibition || c.id === 'all' || shop.products.some(function(p) {return p.zone === 'presentation' && p.category === c.id;});});
  }
  function requestDesign(ids, idea) {
    ids.forEach(function(id) {var p=productById(id); if (!p) return; var finish=p.options.includes('natural')?'natural':p.options[0]; if (!selection.some(function(x) {return x.id===id;})) selection.push({id:id,finish:finish,quantity:1});});
    save(); updateCount(); openInquiry();
    document.querySelector('#inquiry-form [name=kind]').value='functional';
    document.querySelector('#inquiry-form [name=idea]').value=idea;
  }
  function renderProducts() {
    var matches = shop.products.filter(function (p) { return (!shop.exhibition || p.zone === 'presentation') && (category === 'all' || category === p.category) && (season === 'all' || (p.seasons || []).includes(season)) && (t(p.name) + ' ' + t(p.short)).toLowerCase().includes(search.toLowerCase()); });
    document.getElementById('results-count').textContent = matches.length + ' ' + u('count');
    document.getElementById('products').innerHTML = matches.length ? matches.map(function (p,index) {
      return '<article class="product"><button class="product-art" data-product="' + p.id + '" aria-label="' + esc(u('details') + ': ' + t(p.name)) + '"><img src="' + image(p.image) + '" alt="' + esc(t(p.name) + ' — ' + imageLabel(p)) + '" width="512" height="512" loading="lazy"><span class="image-label">' + imageLabel(p) + '</span><span class="art-arrow" aria-hidden="true">→</span></button><div class="product-topline"><span>' + esc(shop.categories.find(function(c){return c.id===p.category;})[language]) + '</span><span class="product-stage">' + esc(stageLabel(p)) + '</span></div><h3><button data-product="' + p.id + '">' + t(p.name) + '</button></h3><p>' + t(p.short) + '</p><p class="product-spec">' + esc(t(p.spec)) + '</p><div class="product-bottom"><span>' + u('request') + '</span><button data-product="' + p.id + '">' + u('details') + ' →</button></div></article>';
    }).join('') : '<p class="no-results">' + u('noResults') + '</p>';
    document.querySelectorAll('[data-product]').forEach(function (button) { button.onclick = function () { openProduct(button.dataset.product, true); }; });
  }
  function bind() {
    document.querySelectorAll('[data-category]').forEach(function(button) { button.onclick=function() {
      category=button.dataset.category; season='all'; search='';
      document.getElementById('product-search').value='';
      document.querySelectorAll('[data-filter]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.filter===category));});
      document.querySelectorAll('[data-season]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.season==='all'));});
      renderProducts(); document.getElementById('collection').scrollIntoView({behavior:'smooth'});
    }; });
    document.querySelectorAll('[data-season]').forEach(function (button) { button.onclick=function() { season=button.dataset.season; document.querySelectorAll('[data-season]').forEach(function(b) {b.setAttribute('aria-pressed',String(b.dataset.season===season));}); renderProducts(); }; });
    document.querySelectorAll('[data-language]').forEach(function (button) { button.onclick = function () {
      language = button.dataset.language;
      try { localStorage.setItem('ruben-shop-language',language); } catch (_) {}
      var url = new URL(location.href); url.searchParams.set('lang',language); history.replaceState(null,'',url);
      render();
    }; });
    document.querySelectorAll('[data-filter]').forEach(function (button) { button.onclick = function () {
      category = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed',String(category === b.dataset.filter)); });
      renderProducts();
    }; });
    document.getElementById('product-search').oninput = function (event) { search = event.target.value; renderProducts(); };
    document.querySelectorAll('[data-open-inquiry]').forEach(function (button) { button.onclick = openInquiry; });
    document.querySelector('.menu-toggle').onclick = function (event) {
      var button = event.currentTarget;
      var open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded',String(open));
      document.getElementById('main-nav').classList.toggle('mobile-open',open);
    };
    document.querySelectorAll('#main-nav a').forEach(function (link) { link.onclick = function () {
      document.getElementById('main-nav').classList.remove('mobile-open');
      document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
    }; });
  }
  function updateCount() { document.querySelectorAll('.count').forEach(function (x) { x.textContent = total(); }); }
  function toast(message) { var node = document.querySelector('.toast'); node.textContent = message; node.classList.add('visible'); setTimeout(function () { node.classList.remove('visible'); },2500); }
  function closeButton() { return '<button class="dialog-close" aria-label="' + u('close') + '">×</button>'; }
  function closeProduct() {
    currentProduct = null;
    var url = new URL(location.href); url.searchParams.delete('product'); history.replaceState(null,'',url);
  }
  function setupDialog(dialog) {
    dialog.querySelector('.dialog-close').onclick = function () { dialog.close(); };
    dialog.onclick = function (event) { if (event.target === dialog) { var bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } };
  }
  function openProduct(id, setUrl) {
    var product = productById(id); if (!product) return;
    currentProduct = id; previousFocus = document.activeElement;
    var dialog = document.getElementById('product-dialog');
    var gallery = product.gallery || [{image:product.image, visualKind:product.visualKind, alt:product.imageAlt || product.name}];
    var first = gallery[0];
    dialog.innerHTML = closeButton() + '<div class="product-dialog-layout"><div class="product-gallery"><figure><img id="product-main-image" src="' + image(first.image) + '" alt="' + esc(t(first.alt || product.name)) + '"><figcaption><strong id="product-image-label">' + imageLabel(first) + '</strong><br><span id="product-image-note">' + imageNote(first) + '</span>' + (product.credit ? '<br>' + esc(t(product.credit)) : '') + originalPhotoLink(first) + '</figcaption></figure>' + (gallery.length > 1 ? '<div class="gallery-thumbnails" role="group" aria-label="' + esc(t(product.name)) + '">' + gallery.map(function(photo,index) { return '<button type="button" data-image-index="' + index + '" aria-pressed="' + (index === 0) + '" aria-label="' + esc(u('galleryImage') + ' ' + (index + 1) + ': ' + t(photo.alt || product.name)) + '"><img src="' + image(photo.image) + '" alt="" width="90" height="90"></button>'; }).join('') + '</div>' : '') + '</div><div class="product-dialog-copy"><p class="eyebrow">' + u('design') + '</p><h2 id="product-title">' + esc(t(product.name)) + '</h2><p class="detail-stage">' + esc(stageLabel(product)) + '</p><p>' + esc(t(product.detail)) + '</p><p class="spec">' + esc(t(product.spec)) + '</p><form id="product-form"><label>' + u('finish') + '<select name="finish">' + product.options.map(function(o) { return '<option value="' + esc(o) + '">' + ui[language].finishes[o] + '</option>'; }).join('') + '</select></label><label>' + u('quantity') + '<input type="number" name="quantity" min="1" max="20" value="1" required></label><button type="submit" class="button primary">' + u('add') + ' +</button></form><p class="fineprint">' + u('priceNote') + '</p></div></div>';
    dialog.querySelectorAll('[data-image-index]').forEach(function(button) { button.onclick = function() {
      var photo = gallery[Number(button.dataset.imageIndex)];
      var mainImage = dialog.querySelector('#product-main-image');
      mainImage.src = image(photo.image); mainImage.alt = t(photo.alt || product.name);
      dialog.querySelector('#product-image-label').textContent = imageLabel(photo);
      dialog.querySelector('#product-image-note').textContent = imageNote(photo);
      var original = dialog.querySelector('#product-original-photo');
      original.hidden = !photo.originalPhoto;
      if (photo.originalPhoto) original.href = image(photo.originalPhoto);
      else original.removeAttribute('href');
      dialog.querySelectorAll('[data-image-index]').forEach(function(item) { item.setAttribute('aria-pressed',String(item === button)); });
    }; });
    setupDialog(dialog);
    dialog.onclose = function () { closeProduct(); if (previousFocus && previousFocus.isConnected) previousFocus.focus(); };
    dialog.querySelector('form').onsubmit = function (event) {
      event.preventDefault();
      var data = new FormData(event.currentTarget); var finish = data.get('finish'); var quantity = Number(data.get('quantity'));
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return;
      var row = selection.find(function (x) { return x.id === id && x.finish === finish; });
      if (row) row.quantity = Math.min(20,row.quantity+quantity); else selection.push({id:id,finish:finish,quantity:quantity});
      save(); updateCount(); closeProduct(); dialog.close(); toast(u('added'));
    };
    if (setUrl) { var url = new URL(location.href); url.searchParams.set('product',id); history.replaceState(null,'',url); }
    dialog.showModal();
  }
  function openInquiry() {
    previousFocus = document.activeElement;
    var dialog = document.getElementById('inquiry-dialog');
    requestKey = crypto.randomUUID(); lastPayload = '';
    dialog.innerHTML = closeButton() + '<div class="inquiry-inner"><p class="eyebrow">' + shop.brand + '</p><h2 id="inquiry-title">' + u('selection') + '</h2><p>' + u('selectionIntro') + '</p><div id="selection-items"></div><form id="inquiry-form"><div class="form-pair"><label>' + u('name') + '<input name="name" autocomplete="name" maxlength="100" required></label><label>' + u('email') + '<input name="email" type="email" autocomplete="email" maxlength="150" required></label></div><label>' + u('kind') + '<select name="kind"><option value="catalogue">' + u('kindCatalogue') + '</option><option value="existing-model">' + u('kindExisting') + '</option><option value="functional">' + u('kindFunctional') + '</option><option value="figure">' + u('kindFigure') + '</option></select></label><label>' + u('idea') + '<textarea name="idea" rows="4" maxlength="3000" placeholder="' + u('ideaHint') + '"></textarea></label><div class="form-dimensions">' + ['width','depth','height'].map(function(k) {return '<label>' + u(k) + '<input name="' + k + '" type="number" min="0.1" max="10000" step="0.1"></label>';}).join('') + '</div><div class="form-pair"><label>' + u('modelUrl') + '<input name="model_url" type="url" maxlength="700" placeholder="https://…"></label><label>' + u('budget') + '<input name="budget" type="number" min="1" max="100000" step="1"></label></div><label>' + u('files') + '<input name="references" type="file" accept=".png,.jpg,.jpeg,.webp,.stl,.3mf" multiple><span class="file-help">' + u('fileHelp') + '</span></label><p class="local-notice">' + u(backendAvailable ? 'local' : 'offline') + '</p><button class="button primary" type="submit">' + u('create') + ' ↗</button><p id="request-status" role="status" aria-live="polite"></p></form><div class="request-output" hidden><pre id="request-text"></pre><div class="request-actions"><button class="button primary" id="download-request">' + u('download') + ' ↓</button><button class="button outline" id="copy-request">' + u('copy') + '</button></div></div></div>';
    if (!selection.length) dialog.querySelector('[name=kind]').value = 'functional';
    renderSelection(); setupDialog(dialog);
    dialog.onclose = function () { if (previousFocus && previousFocus.isConnected) previousFocus.focus(); };
    dialog.querySelector('form').onsubmit = async function (event) {
      event.preventDefault(); var form = new FormData(event.currentTarget);
      if (!selection.length && !String(form.get('idea') || '').trim()) { document.getElementById('request-status').textContent = u('formError'); return; }
      lastRequest = u('requestTitle') + shop.brand + '\n\n' + u('noOrder') + '\n\n' + u('itemsLabel') + '\n' + selection.map(function (row) { return row.quantity + ' × ' + t(productById(row.id).name) + ' — ' + (ui[language].finishes[row.finish] || row.finish); }).join('\n') + '\n\n' + u('personalInfo') + '\n' + u('name') + ': ' + (form.get('name') || '') + '\n' + u('email') + ': ' + (form.get('email') || '') + '\n\n' + u('idea') + '\n' + (form.get('idea') || '') + '\n\n' + u('priceNote');
      lastRequest+='\n\n'+u('kind')+': '+form.get('kind')+'\n'+['width','depth','height'].map(function(k){return u(k)+': '+(form.get(k)||'—');}).join('\n')+'\n'+u('budget')+': '+(form.get('budget')||'—')+'\n'+u('modelUrl')+': '+(form.get('model_url')||'—')+'\n'+u('files')+': '+Array.from(dialog.querySelector('[name=references]').files).map(function(f){return f.name;}).join(', ');
      document.getElementById('request-text').textContent = lastRequest;
      dialog.querySelector('.request-output').hidden = false;
      document.getElementById('request-status').textContent = u('requestReady');
      var statusNode=document.getElementById('request-status');
      if (!backendAvailable) {statusNode.textContent=u('offline'); return;}
      var submitButton=event.currentTarget.querySelector('[type=submit]'); submitButton.disabled=true; statusNode.textContent=u('saving');
      try {
        var files=Array.from(dialog.querySelector('[name=references]').files);
        if(files.length>3 || files.reduce(function(n,f){return n+f.size;},0)>8*1024*1024) throw new Error(u('files'));
        var uploads=await Promise.all(files.map(function(file) {return new Promise(function(resolve,reject) {var reader=new FileReader();reader.onload=function(){resolve({name:file.name,data:String(reader.result).split(',')[1]});};reader.onerror=reject;reader.readAsDataURL(file);});}));
        var payload={brand:document.body.dataset.shop,language:language,name:String(form.get('name')),email:String(form.get('email')),idea:String(form.get('idea')||''),kind:form.get('kind'),model_url:String(form.get('model_url')||''),budget_eur:form.get('budget')?Number(form.get('budget')):null,dimensions_mm:{width:form.get('width')?Number(form.get('width')):null,depth:form.get('depth')?Number(form.get('depth')):null,height:form.get('height')?Number(form.get('height')):null},items:selection.map(function(x){return {id:x.id,finish:x.finish,quantity:x.quantity};}),uploads:uploads};
        var serialized=JSON.stringify(payload);if(lastPayload && serialized!==lastPayload)requestKey=crypto.randomUUID();lastPayload=serialized;payload.request_key=requestKey;
        var response=await fetch('/api/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});var result=await response.json();if(!response.ok)throw new Error(result.error);
        statusNode.textContent=u('requestReady')+' '+result.id;
        lastRequest+='\n\nReferentie / Reference: '+result.id;document.getElementById('request-text').textContent=lastRequest;
      } catch (error) {statusNode.textContent=u('saveError')+' '+(error.message||'');} finally {submitButton.disabled=false;}
    };
    document.getElementById('download-request').onclick = function () {
      var url = URL.createObjectURL(new Blob([lastRequest],{type:'text/plain;charset=utf-8'}));
      var anchor = document.createElement('a'); anchor.href = url; anchor.download = shop.slug + '-' + u('fileName') + '.txt'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(function () { URL.revokeObjectURL(url); },1000);
    };
    document.getElementById('copy-request').onclick = async function () {
      try { await navigator.clipboard.writeText(lastRequest); document.getElementById('request-status').textContent = u('copied'); } catch (_) { document.getElementById('request-status').textContent = u('copyFailed'); }
    };
    dialog.showModal();
  }
  function renderSelection() {
    var parent = document.getElementById('selection-items');
    parent.innerHTML = selection.length ? selection.map(function (row,index) { var p = productById(row.id); return '<div class="selection-row"><img src="' + image(p.image) + '" alt="" width="80" height="80"><div><strong>' + esc(t(p.name)) + '</strong><span>' + row.quantity + ' × ' + esc(ui[language].finishes[row.finish] || row.finish) + '</span></div><button data-remove="' + index + '" aria-label="' + esc(u('remove') + ': ' + t(p.name)) + '">×</button></div>'; }).join('') : '<div class="empty-selection"><strong>' + u('empty') + '</strong><p>' + u('emptyMore') + '</p></div>';
    parent.querySelectorAll('[data-remove]').forEach(function (button) { button.onclick = function () { selection.splice(Number(button.dataset.remove),1); save(); updateCount(); renderSelection(); document.querySelector('.request-output').hidden = true; document.getElementById('request-status').textContent = ''; }; });
  }
  render();
  var initialProduct = params.get('product'); if (initialProduct) openProduct(initialProduct,false);
})();
