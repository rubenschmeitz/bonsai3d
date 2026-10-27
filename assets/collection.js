(async function () {
  'use strict';
  var page = document.body.dataset.page || 'home';
  var pages = {home:'./',collection:'./collectie.html',finishes:'./atelier.html',atelier:'./atelier.html',custom:'./maatwerk.html',service:'./service.html',privacy:'./privacy.html'};
  var legacy = {collection:'collection',finishes:'finishes',studio:'atelier',custom:'atelier',guide:'atelier',display:'atelier',exhibition:'collection'};
  var anchor = location.hash.slice(1);
  if (page === 'home' && legacy[anchor]) {
    location.replace(pages[legacy[anchor]] + location.search + location.hash);
    return;
  }
  var responses = await Promise.all([fetch('./assets/catalogue.json?v=miniature-room-unlit-20261027'), fetch('./assets/business-config.json?v=contact-20261016')]);
  if (responses.some(function (response) { return !response.ok; })) throw new Error('Website information unavailable');
  var loaded = await Promise.all(responses.map(function (response) { return response.json(); }));
  var data = loaded[0], shop = data.bonsai, business = loaded[1];
  var interestOnly = business.status === 'interest';
  document.body.dataset.businessMode = business.status;
  if (!['preparation','interest'].includes(business.status) || business.sales.onlineOrdering || business.sales.onlinePayments) throw new Error('Sales activation requires a separate launch review');
  if (interestOnly && (!business.interest || business.interest.acceptOrders !== false || business.interest.acceptReservations !== false)) throw new Error('Interest mode must not accept orders or reservations');
  window.SHOP_DATA = data;
  var query = new URLSearchParams(location.search);
  function stored(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; } }
  function remember(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  var language = (query.get('lang') || stored('ruben-shop-language', 'nl')) === 'en' ? 'en' : 'nl';
  var style = (query.get('style') || stored('bonsai3d-style', 'wood')) === 'black' ? 'black' : 'wood';
  var sort = ['price-asc','price-desc','name'].includes(query.get('sort')) ? query.get('sort') : 'featured';
  var category = 'all', search = query.get('search') || '', selection = [], cardStyles = {}, activeProduct = null, activeFinish = style;
  if (shop.categories.some(function (c) { return c.id === query.get('category'); })) category = query.get('category');
  remember('ruben-shop-language', language); remember('bonsai3d-style', style);
  var lastFocus = null, lastRequest = '', toastTimer, lastRemoved=null;
  var ui = {
    nl: {collection:'Collectie', finishes:'Afwerkingen', studio:'Werkplaats', custom:'Op maat', selection:'Mijn selectie', menu:'Menu', search:'Zoek een object', count:'objecten', all:'Alles', wood:'Houtlook', black:'Matzwart', own:'Eigen voorkeur', details:'Bekijk object', request:'Op aanvraag', printed:'Vorm eerder geprint', edited:'Bewerkt productbeeld', finish:'Afwerkingsvoorbeeld', photo:'Oorspronkelijke foto', editedNote:'Bewerkt studiobeeld op basis van de oorspronkelijke printfoto.', finishNote:'', photoNote:'Ongewijzigde foto van het gemaakte exemplaar. Boom, pot en overige styling zijn alleen inbegrepen als dat in de aanvraag wordt afgesproken.', original:'Bekijk oorspronkelijke foto', quantity:'Aantal', add:'Bewaar in mijn selectie', added:'Toegevoegd aan je selectie.', close:'Sluiten', choose:'Kies je afwerking', noResults:'Geen objecten gevonden. Probeer een andere zoekterm.', enquiry:'Maak je aanvraag', intro:'Je selectie en afwerkingen worden bewaard op dit apparaat. Voeg je wensen toe en download of kopieer je aanvraag.', empty:'Je selectie is nog leeg. Je kunt hieronder ook je eigen idee beschrijven.', remove:'Verwijder', name:'Naam', email:'E-mailadres', idea:'Jouw opstelling of wensen', hint:'Bijvoorbeeld: de maat van je pot, gewenste hoogte, een andere kleur of de plek waar je de opstelling wilt gebruiken.', width:'Breedte pot (mm)', depth:'Diepte pot (mm)', height:'Gewenste hoogte (mm)', create:'Maak aanvraag', download:'Download aanvraag', copy:'Kopieer aanvraag', copied:'Aanvraag gekopieerd.', copyFailed:'Kopiëren lukte niet. Je kunt de aanvraag downloaden.', ready:'Je aanvraag is klaar. Download of kopieer hem en stuur hem zelf naar Ruben.', local:'Hier wordt een aanvraagbestand gemaakt. De website verstuurt niets automatisch.', quote:'Maat, materiaal, afwerking, prijs en planning stemmen we samen af.', error:'Kies een object of beschrijf eerst je idee.', ownNote:'Een eigen kleur kan ook. Vermeld je voorkeur in de aanvraag.', draft:'Aanvraag aan BONSAI3D', noOrder:'Aanvraagconcept — uitvoering en prijs nog af te stemmen.', fileName:'aanvraag', archived:'Dit ontwerp staat voorlopig buiten de collectie.', footer:'3D-geprinte objecten · gemaakt op aanvraag', language:'Taal', browseFinish:'Bekijk de collectie in', saved:'opgeslagen', styleHeading:'Bekijk de collectie in', skip:'Ga naar de inhoud'},
    en: {collection:'Collection', finishes:'Finishes', studio:'Workshop', custom:'Custom', selection:'My selection', menu:'Menu', search:'Find an object', count:'objects', all:'All', wood:'Wood look', black:'Matte black', own:'My own preference', details:'View object', request:'On enquiry', printed:'Shape previously printed', edited:'Edited product image', finish:'Finish preview', photo:'Original photograph', editedNote:'Edited studio image based on the original print photograph.', finishNote:'', photoNote:'Unaltered photograph of the made example. Tree, pot and other styling are only included if agreed in the enquiry.', original:'View original photograph', quantity:'Quantity', add:'Save to my selection', added:'Added to your selection.', close:'Close', choose:'Choose your finish', noResults:'No objects found. Try another search term.', enquiry:'Prepare your enquiry', intro:'Your selection and finishes are saved on this device. Add your preferences and download or copy your enquiry.', empty:'Your selection is empty. You can also describe an idea of your own below.', remove:'Remove', name:'Name', email:'Email address', idea:'Your display or preferences', hint:'For example: your pot’s dimensions, preferred height, a different colour or where you want to use the arrangement.', width:'Pot width (mm)', depth:'Pot depth (mm)', height:'Preferred height (mm)', create:'Prepare enquiry', download:'Download enquiry', copy:'Copy enquiry', copied:'Enquiry copied.', copyFailed:'Copying was unavailable. You can download the enquiry.', ready:'Your enquiry is ready. Download or copy it and send it to Ruben yourself.', local:'This creates an enquiry file. The website does not send anything automatically.', quote:'We agree size, material, finish, price and timing together.', error:'Choose an object or describe your idea first.', ownNote:'A colour of your own is possible too. Add your preference to the enquiry.', draft:'Enquiry for BONSAI3D', noOrder:'Enquiry draft — final version and price to be agreed.', fileName:'enquiry', archived:'This design is currently outside the collection.', footer:'3D-printed objects · made on enquiry', language:'Language', browseFinish:'Explore the collection in', saved:'saved', styleHeading:'View the collection in', skip:'Skip to content'}
  };
  Object.assign(ui.nl, {natural:'Rustig & natuurlijk',warm:'Warm & kleurrijk',earth:'Aardetinten',dark:'Donker & ingetogen',custom:'Eigen voorkeur',originalFinish:'Zoals het model',finished:'Productvisualisatie',finishedNote:'',potFinish:'Voorkeur voor uitstraling'});
  Object.assign(ui.en, {natural:'Quiet & natural',warm:'Warm & colourful',earth:'Earth tones',dark:'Dark & understated',custom:'My own preference',originalFinish:'Like the model',finished:'Product visualisation',finishedNote:'',potFinish:'Preferred look'});
  function u(key) { return ui[language][key]; }
  ui.nl.custom='Op maat'; ui.en.custom='Custom';
  Object.assign(ui.nl, {home:'Home',atelier:'Het atelier',concept:'Ontwerp op aanvraag',conceptNote:'',corrected:'Eigen foto · licht gecorrigeerd',correctedNote:'Eigen foto met een betere uitsnede en subtiele correcties in belichting en kleur. Vorm en productdetails zijn behouden.'});
  Object.assign(ui.en, {home:'Home',atelier:'The atelier',concept:'Design on enquiry',conceptNote:'',corrected:'Own photograph · lightly corrected',correctedNote:'Own photograph with improved framing and subtle exposure and colour corrections. Shape and product details are preserved.'});
  ui.nl.black='Ruw zwart'; ui.en.black='Raw black'; ui.nl.grey='Ruw grijs'; ui.en.grey='Raw grey';
  function price(p,f){return BonsaiPricing.money(BonsaiPricing.product(p,f),language);}
  function availability(p){if(interestOnly)return p.availability==='stock'?tr('Potjes op voorraad','Pots in stock'):p.stage==='future'?tr('Ontwerpvoorbeeld','Design example'):tr('Eerder gemaakte vorm','Previously made shape');return p.availability==='stock'?tr('Potjes op voorraad','Pots in stock'):p.stage==='future'?tr('Ontwerp op aanvraag','Design on enquiry'):tr('Bij te maken op aanvraag','Made to order');}
  function finishLabel(finish, product) { if(product && product.finishLabels && product.finishLabels[finish]) return t(product.finishLabels[finish]); if(product && product.category==='miniatures' && finish==='black') return tr('Zwart + witte drybrush','Black + white drybrush'); return finish === 'custom' ? u('own') : finish === 'original' ? u('originalFinish') : u(finish); }
  function tr(nl, en) { return language === 'nl' ? nl : en; }
  function t(value) { return value && typeof value === 'object' ? value[language] : value; }
  function esc(value) { return String(value || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function image(path) { return './assets/' + path; }
  function productById(id) { return shop.products.find(function (p) { return p.id === id; }); }
  function finishImage(p, finish) { return p.finishes ? (p.finishes[finish] || p.finishes.black || p.finishes.wood) : {image:p.image,alt:p.imageAlt,visualKind:p.visualKind,finishTreatment:p.finishTreatment,photoRole:p.photoRole,referenceRecreation:p.referenceRecreation}; }
  Object.assign(ui.nl, {exhibition:'Bonsaiopstelling',exhibitionNote:'',exhibitionConceptNote:''});
  Object.assign(ui.en, {exhibition:'Bonsai arrangement',exhibitionNote:'',exhibitionConceptNote:''});
  Object.assign(ui.nl, {displayConceptNote:''});
  Object.assign(ui.en, {displayConceptNote:''});
  Object.assign(ui.nl, {service:'Service & contact',privacy:'Privacy',name:'Naam (optioneel)',email:'E-mailadres (optioneel)',create:'Maak aanvraagconcept',ready:'Je concept staat klaar. Het is niet verstuurd en is geen bestelling.',intro:'Bewaar je selectie en beschrijf je wensen. Naam en e-mailadres zijn optioneel. Je kunt het concept downloaden of kopiëren; het contactkanaal is nog in voorbereiding.',noOrder:'Vrijblijvend aanvraagconcept — geen bestelling; uitvoering en definitieve totaalprijs nog te bevestigen.'});
  Object.assign(ui.en, {service:'Service & contact',privacy:'Privacy',name:'Name (optional)',email:'Email (optional)',create:'Prepare enquiry draft',ready:'Your draft is ready. It has not been sent and is not an order.',intro:'Save your selection and describe your preferences. Name and email are optional. You can download or copy the draft; the contact channel is still being prepared.',noOrder:'Non-binding enquiry draft — not an order; final piece and total price to be confirmed.'});
  Object.assign(ui.nl,{selection:'Winkelwagen',added:'Toegevoegd aan je winkelwagen.',add:'Voeg toe aan winkelwagen',enquiry:'Winkelwagen & aanvraag',intro:'Pas je objecten, aantallen en wensen aan. Je winkelwagen wordt op dit apparaat bewaard. Bekijk de voorlopige prijzen en maak een vrijblijvend aanvraagconcept.'});
  Object.assign(ui.en,{selection:'Cart',added:'Added to your cart.',add:'Add to cart',enquiry:'Cart & enquiry',intro:'Adjust objects, quantities and preferences. Your cart is saved on this device. Review provisional prices and prepare a non-binding enquiry draft.'});
  Object.assign(ui.nl,{own:'Eigen kleur'});Object.assign(ui.en,{own:'Custom colour'});
  if (interestOnly) {
    Object.assign(ui.nl,{selection:'Bewaard',add:'Bewaar object',added:'Object bewaard. Je vindt het terug bij het hartje.',enquiry:'Wat spreekt jou aan?',intro:'Bewaar je favoriete objecten en voeg je wensen toe. Je selectie blijft op dit apparaat. Maak daarna een overzicht om zelf met Ruben te delen.',create:'Maak mijn overzicht',download:'Download mijn interesse',copy:'Kopieer mijn overzicht',copied:'Overzicht gekopieerd.',copyFailed:'Kopiëren lukte niet. Download je overzicht.',ready:'Je overzicht staat klaar, maar is nog niet verstuurd. Kopieer of download het en deel het met Ruben.',draft:'Mijn selectie voor BONSAI3D',noOrder:'',fileName:'interesse',local:'Dit blijft op je apparaat. Deel het zelf in een Marktplaatsgesprek; deze website verzamelt geen reacties.',quote:'Zo laat je zien wat je leuk vindt. Er zijn hiermee nog geen afspraken over de uitvoering, prijs of levering.',footer:'Bonsai en 3D-printen, door Ruben',request:'Ontwerpvoorbeeld',quantity:'Gewenst aantal',service:'Service & contact',idea:'Wat spreekt je aan of zou je anders willen?'});
    Object.assign(ui.en,{selection:'Saved',add:'Save object',added:'Object saved. Find it again using the heart button.',enquiry:'What appeals to you?',intro:'Save your favourite objects and add your preferences. Your selection stays on this device. Then prepare an overview to share with Ruben yourself.',create:'Prepare my overview',download:'Download my interests',copy:'Copy my overview',copied:'Overview copied.',copyFailed:'Copying failed. Download your overview.',ready:'Your overview is ready, but has not been sent. Copy or download it and share it with Ruben.',draft:'My selection for BONSAI3D',noOrder:'',fileName:'interest',local:'This stays on your device. Share it yourself in a Marktplaats conversation; this website collects no responses.',quote:'This helps me see what you like. It doesn’t confirm a final piece, price or delivery.',footer:'Bonsai and 3D printing, by Ruben',request:'Design example',quantity:'Preferred quantity',service:'Service & contact',idea:'What do you like or what would you change?'});
  }

  Object.assign(ui.nl,{service:'Contact & maaktijd'});
  Object.assign(ui.en,{service:'Contact & making time'});

  function isContextPhoto(photo) { return photo.photoRole==='context' || photo.view==='withBonsai' || ['arrangement','arrangementConcept','exhibition','exhibitionConcept','displayConcept'].includes(photo.visualKind); }
  function imageLabel(photo) {
    if(photo.finishTreatment==='black-white-drybrush') return isContextPhoto(photo) ? tr('Bij een bonsai · witte drybrush','Beside a bonsai · white drybrush') : tr('Zwarte primer + witte drybrush','Black primer + white drybrush');
    return isContextPhoto(photo) ? tr('Bij een bonsai','Beside a bonsai') : tr('Productbeeld','Product view');
  }
  function total() { return selection.reduce(function (sum, row) { return sum + row.quantity; }, 0); }
  function save() { remember('bonsai3d-selection', JSON.stringify(selection)); }
  try {
    var saved = stored('bonsai3d-selection', '');
    if (!saved) (shop.previousSlugs || []).concat(shop.previousSlug || []).some(function (slug) { saved = stored(slug + '-selection', ''); return !!saved; });
    var previous = JSON.parse(saved || '[]');
    selection = BonsaiCart.hydrate(previous,shop.products,BonsaiPricing);
    save();
  } catch (_) {}
  function pageUrl(name, options) {
    var params = new URLSearchParams(Object.assign({lang:language,style:style,v:'collection-20261025'}, options || {}));
    return pages[name] + '?' + params.toString() + (name === 'finishes' ? '#finishes' : '');
  }
  function link(name, content, className, options) {
    options = options || {};
    return '<a data-page="' + name + '" data-link-options="' + esc(JSON.stringify(options)) + '" class="' + className + '" href="' + esc(pageUrl(name, options)) + '">' + content + '</a>';
  }
  function updateLinks() {
    document.querySelectorAll('a[data-page]').forEach(function (a) { a.href = pageUrl(a.dataset.page, JSON.parse(a.dataset.linkOptions || '{}')); });
  }
  function logo() { return link('home', '<img class="brand-wordmark" src="' + image('brand/bonsai3d-logo-primary.svg?v=groeilijnen-20261016') + '" alt="BONSAI3D" width="442" height="78">', 'brand'); }
  function previewFinishes(p) { return ['wood','black','grey'].filter(function(f){return p.finishes && p.finishes[f];}); }
  function swatches(finish, attributes, choices) {
    return (choices || ['wood','black']).map(function (f) { return '<button type="button" class="finish-choice" ' + attributes(f) + ' aria-pressed="' + (finish === f) + '"><span class="finish-dot ' + f + '" aria-hidden="true"></span><span>' + u(f) + '</span></button>'; }).join('');
  }
  function render() {
    document.documentElement.lang = language;
    if (window.BonsaiDiscovery) window.BonsaiDiscovery.update(language);
    var api = {business:business,clearSelection:function(){selection=[];lastRequest='';lastRemoved=null;updateCount();},tr:tr, t:t, esc:esc, shop:shop, image:image, style:style, language:language, finishImage:finishImage, imageLabel:imageLabel, money:BonsaiPricing.money, link:link, pageUrl:pageUrl};
    var content = page === 'collection' ? collection() : ['service','privacy'].includes(page) ? window.BonsaiBusiness[page](api) : window.BonsaiEditorial[page](api);
    document.getElementById('app').innerHTML = '<a class="skip" href="#main">' + u('skip') + '</a>' +
      '<header class="site-header"><div class="header-inner">' + logo() + '<nav id="main-nav" aria-label="' + u('menu') + '">' + ['collection','atelier','custom','service'].map(function (name) { return link(name,name==='service'?tr('Contact','Contact'):u(name),'nav-link' + (name === page ? ' current' : '')).replace('class=',(name === page ? 'aria-current="page" ' : '') + 'class='); }).join('') + '</nav><div class="header-actions"><div class="languages" role="group" aria-label="' + u('language') + '">' + ['nl','en'].map(function (lang) { return '<button type="button" data-language="' + lang + '" aria-pressed="' + (language === lang) + '">' + lang.toUpperCase() + '</button>'; }).join('') + '</div><button class="selection-toggle" aria-label="' + u('selection') + '" data-open-inquiry>'+(interestOnly?'<span class="interest-icon" aria-hidden="true">♡</span>':'')+'<span class="selection-label">' + u('selection') + '</span><span class="count">' + total() + '</span></button></div><button class="menu-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="' + u('menu') + '"><span aria-hidden="true">☰</span></button></div></header>' +
      '<main id="main" tabindex="-1">' + content + '</main><footer class="wrap"><div>' + logo() + '<p>' + u('footer') + '</p>' + window.BonsaiBusiness.preparation(api) + window.BonsaiBusiness.footerContact(api) + '</div><nav aria-label="' + tr('Meer ontdekken','Explore more') + '">' + link('collection',u('collection'),'text-link') + link('atelier',u('atelier'),'text-link') + link('service',u('service'),'text-link') + link('privacy',u('privacy'),'text-link') + '</nav><p class="footer-note">© ' + new Date().getFullYear() + ' BONSAI3D</p></footer>' +
      '<dialog id="product-dialog" aria-labelledby="product-title"></dialog><dialog id="inquiry-dialog" aria-labelledby="inquiry-title"></dialog><div class="toast" role="status" aria-live="polite"></div>';
    renderProducts(); bindProductLinks(); bind(); updateCount(); window.BonsaiBusiness.bind(api); if(window.BonsaiHomeGallery) window.BonsaiHomeGallery.bind(); if(window.BonsaiPhotoViewer) window.BonsaiPhotoViewer.bind(); if(window.BonsaiDetails) window.BonsaiDetails.bind({tr:tr,language:language,openInquiry:openInquiry,addCustom:addCustom});
  }
  function collection() {
    return `<section class="collection wrap" id="collection" aria-labelledby="collection-title">
      <header class="simple-collection-heading"><h1 class="page-title" id="collection-title">${u('collection')}</h1><p>${tr('Voor jouw bonsai. Gemaakt door Ruben.','For your bonsai. Made by Ruben.')}</p></header>
      <div class="collection-controls">
        <label class="category-control"><span class="sr-only">${tr('Categorie','Category')}</span><select id="product-category">${shop.categories.map(function(c){return '<option value="'+c.id+'"'+(category===c.id?' selected':'')+'>'+esc(c.id==='all'?tr('Alle objecten','All objects'):c[language])+'</option>';}).join('')}</select></label>
        <label class="search"><span class="sr-only">${u('search')}</span><input type="search" id="product-search" maxlength="100" enterkeyhint="search" value="${esc(search)}" placeholder="${tr('Zoeken…','Search…')}"><span aria-hidden="true">⌕</span></label>
      </div>
      <div class="results-toolbar"><p id="results-count" role="status" aria-live="polite" aria-atomic="true"></p><button type="button" class="reset-filters" id="reset-filters" hidden>${tr('Wis filters','Clear filters')}</button>
        <details class="browse-options"><summary>${tr('Weergave','View options')}</summary><div class="browse-options-panel">
          <label class="sort-control">${tr('Sorteer op','Sort by')}<select id="product-sort">${[['featured',tr('Uitgelicht','Featured')],['price-asc',tr('Prijs: laag naar hoog','Price: low to high')],['price-desc',tr('Prijs: hoog naar laag','Price: high to low')],['name',tr('Naam: A–Z','Name: A–Z')]].map(function(option){return '<option value="'+option[0]+'"'+(sort===option[0]?' selected':'')+'>'+option[1]+'</option>';}).join('')}</select></label>
          <div class="collection-style"><span>${tr('Afwerking op de foto','Finish in photographs')}</span><div role="group" aria-label="${u('choose')}">${swatches(style,function(f){return 'data-style="'+f+'"';})}</div></div>
        </div></details>
      </div><div class="product-grid" id="products"></div></section>`;
  }
  function bindProductLinks() { document.querySelectorAll('[data-product]').forEach(function (button) { button.onclick = function () { openProduct(button.dataset.product, button.dataset.finish || cardStyles[button.dataset.product] || style); }; }); }
  function normaliseSearch(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim(); }
  function displayedFinish(p) { var choice=cardStyles[p.id] || style; return p.finishes && !p.finishes[choice] ? (p.finishes.black ? 'black' : previewFinishes(p)[0]) : (p.finishes ? choice : p.options[0]); }
  function syncFilters() {
    var url=new URL(location.href);
    [['search',search.trim()],['category',category==='all'?'':category],['sort',sort==='featured'?'':sort]].forEach(function(pair){if(pair[1])url.searchParams.set(pair[0],pair[1]);else url.searchParams.delete(pair[0]);});
    history.replaceState(history.state,'',url);
  }
  function resetFilters() {
    category='all';search='';document.getElementById('product-search').value='';
    document.getElementById('product-category').value='all';
    syncFilters();renderProducts();document.getElementById('product-search').focus();
  }
  function renderProducts() {
    if (!document.getElementById('products')) return;
    var terms=normaliseSearch(search).split(/\s+/).filter(Boolean);
    var matches = shop.products.filter(function (p) { var group=shop.categories.find(function(c){return c.id===p.category;}); var text=normaliseSearch(t(p.name)+' '+t(p.short)+' '+t(p.spec)+' '+group[language]); return (category === 'all' || p.category === category) && terms.every(function(term){return text.includes(term);}); });
    matches.sort(function(a,b){
      if(sort==='name')return t(a.name).localeCompare(t(b.name),language);
      if(sort==='price-asc'||sort==='price-desc'){
        var first=BonsaiPricing.product(a,displayedFinish(a)),second=BonsaiPricing.product(b,displayedFinish(b));
        if(first===null||second===null)return first===second?0:first===null?1:-1;
        return (first-second)*(sort==='price-asc'?1:-1);
      }
      return (Number(!!b.featured)*2+Number(!!b.detailedMiniature))-(Number(!!a.featured)*2+Number(!!a.detailedMiniature));
    });
    document.getElementById('results-count').textContent = matches.length + ' ' + u('count') + (search.trim() ? ' · “'+search.trim()+'”' : '');
    document.getElementById('reset-filters').hidden=category==='all'&&!search;
    document.getElementById('products').innerHTML = matches.length ? matches.map(function (p) {
      var finish = displayedFinish(p); var photo = finishImage(p, finish);
      return '<article class="product" data-product-card="'+p.id+'"><button class="product-art" data-product="'+p.id+'" aria-label="'+esc(u('details')+': '+t(p.name))+'"><img src="'+image(photo.image)+'" alt="'+esc(t(photo.alt))+'" width="1254" height="1254" loading="lazy"></button><h3><button data-product="'+p.id+'">'+esc(t(p.name))+'</button></h3><p class="product-price">'+tr('Richtprijs ','Guide price ')+'<strong>'+price(p,finish)+'</strong></p><p class="availability">'+availability(p)+'</p></article>';
    }).join('') : '<div class="no-results"><h2>'+tr('Geen passende objecten','No matching objects')+'</h2><p>'+tr('Probeer een kortere zoekterm of bekijk de hele collectie.','Try a shorter search or explore the whole collection.')+'</p><button type="button" class="button outline" id="empty-reset">'+tr('Bekijk alle objecten','Show all objects')+'</button></div>';
    bindProductLinks();
    var emptyReset=document.getElementById('empty-reset');if(emptyReset)emptyReset.onclick=resetFilters;
  }

  function changeStyle(finish) {
    style = finish; cardStyles = {}; remember('bonsai3d-style', style);
    var url = new URL(location.href); url.searchParams.set('style', style); history.replaceState(history.state, '', url);
    document.querySelectorAll('[data-style]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.style === style)); });
    renderProducts();
    updateLinks();
  }
  function bind() {
    var categoryInput=document.getElementById('product-category');if(categoryInput)categoryInput.onchange=function(){category=categoryInput.value;syncFilters();renderProducts();};
    var searchInput = document.getElementById('product-search');
    if (searchInput) searchInput.oninput = function (event) { search = event.target.value; syncFilters(); renderProducts(); };
    var sorter=document.getElementById('product-sort');if(sorter)sorter.onchange=function(){sort=sorter.value;syncFilters();renderProducts();};
    var reset=document.getElementById('reset-filters');if(reset)reset.onclick=resetFilters;
    document.querySelectorAll('[data-style]').forEach(function (button) { button.onclick = function () { changeStyle(button.dataset.style); }; });
    document.querySelectorAll('[data-browse-style]').forEach(function (button) { button.onclick = function () { location.href = pageUrl('collection',{style:button.dataset.browseStyle}); }; });
    document.querySelectorAll('[data-open-inquiry]').forEach(function (button) { button.onclick = openInquiry; });
    document.querySelectorAll('[data-language]').forEach(function (button) { button.onclick = function () {
      var active = activeProduct, finish = activeFinish;
      language = button.dataset.language; remember('ruben-shop-language', language);
      var url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(history.state, '', url);
      render(); if (active) openProduct(active, finish); else document.querySelector('[data-language="'+language+'"]').focus();
    }; });
    var toggle = document.querySelector('.menu-toggle'), nav = document.getElementById('main-nav');
    function closeMenu(restore){nav.classList.remove('mobile-open');toggle.setAttribute('aria-expanded','false');if(restore)toggle.focus();}
    toggle.onclick = function () { var open = nav.classList.toggle('mobile-open'); toggle.setAttribute('aria-expanded', String(open)); if(open)nav.querySelector('a').focus(); };
    document.onkeydown=function(event){if(event.key==='Escape'&&nav.classList.contains('mobile-open')){closeMenu(true);}};
    document.onclick=function(event){if(!event.target.closest('.site-header'))closeMenu(false);};
    nav.onfocusout=function(){setTimeout(function(){if(!nav.contains(document.activeElement)&&document.activeElement!==toggle)closeMenu(false);},0);};
    nav.querySelectorAll('a').forEach(function (a) { a.onclick = function () { nav.classList.remove('mobile-open'); toggle.setAttribute('aria-expanded','false'); }; });
  }
  function toast(message) { clearTimeout(toastTimer); var node = document.querySelector('.toast'); node.textContent = message; node.classList.add('visible'); toastTimer = setTimeout(function () { node.classList.remove('visible'); }, 3000); }
  function updateCount() { document.querySelectorAll('.count').forEach(function (node) { node.textContent = total(); }); document.querySelectorAll('.selection-toggle').forEach(node=>node.setAttribute('aria-label',u('selection')+' ('+total()+')')); }
  function closeButton() { return '<button class="dialog-close" type="button" aria-label="' + u('close') + '">×</button>'; }
  function setupDialog(dialog) {
    dialog.querySelector('.dialog-close').onclick = function () { dialog.close(); };
    dialog.onclick = function (event) { if (event.target === dialog) { var b = dialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close(); } };
  }
  function productUrl(id, finish) {
    var url = new URL(location.href), opening = url.searchParams.get('product') !== id;
    url.searchParams.set('product',id); url.searchParams.set('finish',finish);
    if(opening)history.pushState({bonsaiProductOverlay:true},'',url);
    else history.replaceState(history.state,'',url);
  }
  function productGallery(p, finish) {
    if (p.miniatureViews) {
      var preview = p.finishes && finish === 'wood' ? 'wood' : 'black';
      return p.gallery.filter(function (photo) { return !photo.previewFinish || photo.previewFinish === preview; });
    }
    var keys=previewFinishes(p);
    if (p.photoSequence === 'product-context') {
      var selected = p.finishes ? (p.finishes[finish] ? finish : (p.finishes.black ? 'black' : keys[0])) : null;
      var first = selected ? Object.assign({finish:selected},p.finishes[selected]) : {image:p.image,alt:p.imageAlt,visualKind:p.visualKind,photoRole:p.photoRole,referenceRecreation:p.referenceRecreation};
      var context = (p.gallery || []).filter(function(photo){return photo.photoRole==='context' && (!photo.contextFinish || photo.contextFinish===(selected || 'own'));})[0];
      var ordered = [first].concat(context ? [context] : []);
      if (p.finishes) keys.forEach(function(key){if(key!==selected) ordered.push(Object.assign({finish:key},p.finishes[key]));});
      (p.gallery || []).forEach(function(photo){if(!ordered.some(function(item){return item.image===photo.image;})) ordered.push(photo);});
      return ordered;
    }
    return p.finishes ? keys.map(function(f){return Object.assign({finish:f},p.finishes[f]);}).concat(p.gallery.filter(function(photo){return !keys.some(function(f){return photo.image===p.finishes[f].image;});})) : (p.gallery || [{image:p.image,visualKind:p.visualKind,alt:p.imageAlt}]);
  }
  function openProduct(id, finish) {
    var p = productById(id); if (!p) { toast(u('archived')); return; }
    finish = p.options.includes(finish) ? finish : p.options[0]; activeProduct = id; activeFinish = finish; lastFocus = document.activeElement;
    var gallery = productGallery(p, finish), currentPhoto = 0;
    var finishForm='<label class="compact-finish">'+u('choose')+'<select name="finish">'+p.options.map(function(f){return '<option value="'+f+'"'+(finish===f?' selected':'')+'>'+esc(finishLabel(f,p)+(f==='wood'?' (+'+BonsaiPricing.money(p.pricing.woodExtra,language)+')':''))+'</option>';}).join('')+'</select></label>';
    var dialog = document.getElementById('product-dialog');
    dialog.classList.add('compact-product');
    dialog.innerHTML=closeButton()+`<header class="product-modal-heading"><h2 id="product-title">${esc(t(p.name))}</h2></header><div class="product-dialog-layout"><div class="product-gallery"><figure><button type="button" class="product-photo-enlarge" aria-label="${tr('Foto vergroten','Enlarge photograph')}"><img id="product-main-image" alt=""><span class="photo-enlarge-icon" aria-hidden="true">⤢</span></button></figure><div class="gallery-thumbnails" role="group" aria-label="${esc(t(p.name))}"></div><p class="photo-caption"></p><span class="gallery-count" role="status" aria-live="polite"></span></div><div class="product-dialog-copy"><p class="product-essential">${esc(t(p.short))}</p><div class="product-commerce"><p class="product-price">${p.sellingUnit==='set'?tr('Richtprijs per set','Guide price per set'):tr('Richtprijs per stuk','Guide price per piece')} <strong id="product-price">${price(p,finish)}</strong></p><p class="availability">${availability(p)}</p></div><form id="product-form">${finishForm}<p id="finish-preview-note" class="colour-note" hidden></p><div id="product-colour" ${finish==='custom'?'':'hidden'}>${BonsaiCart.colourFields(cartApi())}</div><div class="product-action-bar"><input type="hidden" name="quantity" value="1"><button type="submit" class="button primary">${u('add')} +</button></div><p id="product-cart-error" role="status"></p>${BonsaiCart.personalisation(cartApi())}<details class="product-price-details"><summary>${tr('Prijsopbouw','Price breakdown')}</summary><div id="product-live-total" role="status" aria-live="polite"></div></details></form><p class="compact-included">${p.includedNote ? esc(t(p.includedNote)) : tr('Alleen het object · styling en verzending niet inbegrepen.','Object only · styling and shipping excluded.')}</p><details class="product-description"><summary>${tr(interestOnly?'Beschrijving & maten':'Beschrijving, maten & levering',interestOnly?'Description & dimensions':'Description, dimensions & delivery')}</summary><p class="product-dimensions">${esc(t(p.spec))}</p><p>${esc(t(p.detail))}</p>${link('service',tr('Service & contact','Service & contact')+' ↗','text-link')}</details></div></div>`;
    function showPhoto(index) {
      index = (index + gallery.length) % gallery.length; currentPhoto = index;
      var photo = gallery[index], main = dialog.querySelector('#product-main-image'); main.src = image(photo.image); main.alt = t(photo.alt || p.name);
      var start = Math.max(0, Math.min(index - 1, gallery.length - 4));
      dialog.querySelectorAll('[data-image-index]').forEach(function (button) {
        var position = Number(button.dataset.imageIndex);
        button.setAttribute('aria-pressed', String(position === index));
        button.hidden = position < start || position >= start + 4;
      });
      dialog.querySelector('.gallery-count').textContent = (index + 1) + ' / ' + gallery.length;
      dialog.querySelector('.gallery-thumbnails').hidden = gallery.length < 2;
      var source=/model-photos/.test(photo.image)?tr('Render van het 3D-model','3D model render'):/concept/i.test(photo.visualKind||'')?tr('Gegenereerd ontwerpbeeld','Generated design preview'):photo.originalPhoto?tr('Bewerkt voorbeeldbeeld','Edited preview'):imageLabel(photo);
      dialog.querySelector('.photo-caption').textContent=source+(photo.finish ? ' · '+finishLabel(photo.finish,p) : '');
    }
    function bindGallery() {
      var thumbnails = dialog.querySelector('.gallery-thumbnails');
      thumbnails.innerHTML = gallery.map(function (photo, i) { return '<button type="button" data-image-index="' + i + '" aria-pressed="false" aria-label="' + esc(imageLabel(photo) + ' ' + (i + 1) + ': ' + t(photo.alt)) + '"><img src="' + image(photo.image) + '" alt="" width="90" height="90"></button>'; }).join('');
      thumbnails.querySelectorAll('[data-image-index]').forEach(function (button) { button.onclick = function () { showPhoto(Number(button.dataset.imageIndex)); }; });
      [-1, 1].forEach(function (step) {
        var button = document.createElement('button'); button.type = 'button'; button.className = 'gallery-step';
        button.setAttribute('aria-label', step < 0 ? tr('Vorige foto','Previous photograph') : tr('Volgende foto','Next photograph'));
        button.textContent = step < 0 ? '←' : '→'; button.hidden = gallery.length <= 4;
        button.onclick = function () { showPhoto(currentPhoto + step); };
        if (step < 0) thumbnails.prepend(button); else thumbnails.append(button);
      });
    }
    dialog.querySelector('.product-photo-enlarge').onclick = function () {
      window.BonsaiPhotoViewer.open({photos:gallery.map(function (photo) { return {src:image(photo.image), alt:t(photo.alt || p.name)}; }), index:currentPhoto, title:t(p.name), onChange:function (index) { showPhoto(index); previewPrice(); }});
    };
    bindGallery();
    dialog.querySelectorAll('[name=finish]').forEach(function (input) { input.onchange = function () { activeFinish=input.value;productUrl(id,activeFinish); if (p.miniatureViews || (p.photoSequence && p.finishes && p.finishes[input.value])) { activeFinish=input.value; productUrl(id,activeFinish); gallery=productGallery(p,input.value); bindGallery(); showPhoto(0); } else if (p.finishes && p.finishes[input.value]) showPhoto(gallery.findIndex(function(photo){return photo.finish===input.value;})); else { activeFinish=input.value; productUrl(id,activeFinish); } document.getElementById('product-price').textContent=price(p,input.value);  }; });
    dialog.querySelector('form').onsubmit = function (event) {
      event.preventDefault(); var form = new FormData(event.currentTarget), chosen = form.get('finish'), quantity = Number(form.get('quantity'));
      if (!p.options.includes(chosen) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return;
      var row=BonsaiCart.productRow(id,event.currentTarget,cartApi());
      if(!row||!BonsaiCart.add(selection,row)){document.getElementById('product-cart-error').textContent=tr('Maximaal 20 per gelijke uitvoering. Pas het aantal aan.','Maximum 20 per identical version. Adjust the quantity.');return;}
      lastRemoved=null;save(); updateCount(); dialog.close(); toast(u('added'));
    };
    function previewPrice(){
      var form=dialog.querySelector('#product-form');
      var previewNote=dialog.querySelector('#finish-preview-note'),selectedFinish=form.elements.finish.value;
      previewNote.hidden=!(selectedFinish==='custom'||selectedFinish==='grey'&&!(p.finishes&&p.finishes.grey));
      previewNote.textContent=tr('Voor deze kleur is nog geen voorbeeldbeeld. De foto toont een andere uitvoering; je kleurkeuze blijft bewaard.','There is no preview for this colour yet. The photograph shows another version; your chosen colour is saved.');
      var ownColour=form.elements.finish.value==='custom';dialog.querySelector('#product-colour').hidden=!ownColour;dialog.querySelectorAll('#product-colour input').forEach(input=>input.disabled=!ownColour);document.getElementById('product-price').textContent=ownColour?tr('Na overleg','On quotation'):price(p,form.elements.finish.value);var custom=form.elements.mode.value==='custom';dialog.querySelector('#product-custom-fields').hidden=!custom;dialog.querySelectorAll('#product-custom-fields input,#product-custom-fields select').forEach(input=>input.disabled=!custom);dialog.querySelector('.product-commerce .availability').textContent=(custom||ownColour)?tr('Aangepaste uitvoering op aanvraag','Custom version on enquiry'):availability(p);
      var invalid=[...form.querySelectorAll('input[type=number]')].some(input=>!input.checkValidity());
      var row=BonsaiCart.productRow(id,form,cartApi()),target=dialog.querySelector('#product-live-total');
      if(invalid||!row){target.textContent=tr('Controleer de maten en het aantal.','Check dimensions and quantity.');return;}
      var q=BonsaiCart.quote(row,shop.products,BonsaiPricing);
      if(custom)document.getElementById('product-price').textContent=BonsaiCart.priceText(q,cartApi(),false);
      var woodOption=form.querySelector('option[value=wood]');if(woodOption){var dims=['width','depth','height'].map(k=>Number(form.elements[k].value));var extra=custom?(dims.every(n=>n>0)?BonsaiPricing.money(BonsaiPricing.woodSurcharge(Math.max(...dims)),language):'€10–€30'):BonsaiPricing.money(p.pricing.woodExtra,language);woodOption.textContent=tr('Houtlook','Wood look')+' (+'+extra+')';}
      var parts=[[tr('Basisobject','Base object'),q.base],[tr('Extra formaat','Larger size'),q.size||0],[tr('Reliëf & details','Relief & detail'),q.detail||0],[tr('Afwerking','Finish'),q.finish||0],[tr('Ontwerpwerk · eenmalig','Design work · one-off'),q.design||0]];
      target.innerHTML='<div class="cart-price-preview">'+tr('Richttotaal','Guide total')+'<strong>'+BonsaiCart.priceText(q,cartApi(),true)+'</strong>'+(interestOnly?'':'<span>'+tr('Verzending nog te bespreken.','Shipping to be discussed.')+'</span>')+(!q.manual&&q.valid?'<div class="price-breakdown"><dl>'+parts.filter(part=>Number.isFinite(part[1])&&part[1]>0).map(part=>'<div><dt>'+part[0]+'</dt><dd>'+BonsaiPricing.money(part[1],language)+'</dd></div>').join('')+'</dl><p>'+tr('Productieprijzen per stuk; ontwerpwerk één keer voor deze uitvoering. Een inschatting, nog geen offerte.','Production prices per piece; design work charged once for this version. An estimate, not yet a quote.')+'</p></div>':'')+'</div>';
    }
    dialog.querySelector('#product-form').addEventListener('input',previewPrice);dialog.querySelector('#product-form').addEventListener('change',previewPrice);dialog.querySelector('.gallery-thumbnails').addEventListener('click',previewPrice);
    setupDialog(dialog);
    dialog.onclose = function () {
      if(dialog.open)return;
      activeProduct = null;
      var url = new URL(location.href);
      if(url.searchParams.has('product') && history.state && history.state.bonsaiProductOverlay)history.back();
      else {url.searchParams.delete('product');url.searchParams.delete('finish');history.replaceState(history.state,'',url);}
      if (lastFocus && lastFocus.isConnected) lastFocus.focus();
    };
    showPhoto(!p.miniatureViews && p.finishes ? Math.max(0,gallery.findIndex(function(photo){return photo.finish===(p.finishes[finish]?finish:'black');})) : 0); if(finish==='grey' && !(p.finishes && p.finishes.grey)){dialog.querySelector('#product-form').elements.finish.value='grey'; activeFinish='grey';} productUrl(id,finish); previewPrice();dialog.showModal();
  }
  function invalidateRequest(){lastRequest='';var out=document.querySelector('.request-output');if(out)out.hidden=true;var status=document.getElementById('request-status');if(status)status.textContent='';}
  function cartApi(){return {interestOnly:interestOnly,tr:tr,t:t,esc:esc,shop:shop,image:image,finishImage:finishImage,finishLabel:finishLabel,availability:availability,link:link,money:function(n){return BonsaiPricing.money(n,language);},invalidate:invalidateRequest,changed:function(){lastRemoved=null;save();updateCount();invalidateRequest();renderSelection();},remove:function(i){lastRemoved={row:selection[i],index:i};selection.splice(i,1);save();updateCount();invalidateRequest();renderSelection();}};}
  function renderSelection() {
    var opened=[...document.querySelectorAll('#selection-items .cart-personalisation')].map((detail,index)=>detail.open?index:-1).filter(index=>index>=0);
    BonsaiCart.render(document.getElementById('selection-items'),selection,cartApi());
    document.querySelectorAll('#selection-items .cart-personalisation').forEach((detail,index)=>detail.open=opened.includes(index));
    BonsaiCart.renderSummary(document.getElementById('cart-summary'),selection,cartApi());
    var undo=document.getElementById('undo-cart-remove');undo.hidden=!lastRemoved;undo.onclick=function(){if(!lastRemoved)return;selection.splice(lastRemoved.index,0,lastRemoved.row);lastRemoved=null;save();updateCount();invalidateRequest();renderSelection();};
    document.getElementById('cart-line-count').textContent=selection.length+' '+tr('uitvoering(en)','version(s)');
  }
  function addCustom(c){
    var row=BonsaiCart.normalise({kind:'custom',configuration:c,quantity:Number(c.quantity),note:''},shop.products,BonsaiPricing);
    if(!row||!BonsaiCart.add(selection,row)){toast(tr('Maximaal 20 per gelijke uitvoering.','Maximum 20 per identical version.'));return;}
    lastRemoved=null;save();updateCount();openInquiry();
  }
  function businessApi() { return {tr:tr,esc:esc,shop:shop,business:business,link:link}; }
  function openInquiry() {
    lastFocus = document.activeElement; lastRequest = '';
    var dialog = document.getElementById('inquiry-dialog');
    dialog.innerHTML = closeButton() + '<div class="inquiry-inner"><p class="eyebrow">BONSAI3D / ' + u('selection') + '</p><h2 id="inquiry-title">' + u('enquiry') + '</h2><p>' + u('intro') + '</p><h3 class="cart-section-title">' + tr('Jouw objecten','Your objects') + '</h3><div class="cart-toolbar"><span id="cart-line-count"></span><button id="undo-cart-remove" type="button" hidden>' + tr('Verwijderen ongedaan maken','Undo removal') + '</button></div><div id="cart-summary" aria-live="polite"></div><div id="selection-items"></div><h3 class="cart-section-title">' + tr(interestOnly?'Jouw feedback':'Levering & aanvullende wensen',interestOnly?'Your feedback':'Delivery & additional preferences') + '</h3><form id="inquiry-form"><div class="form-pair"><label>' + u('name') + '<input name="name" autocomplete="name" maxlength="100"></label><label>' + u('email') + '<input name="email" type="email" autocomplete="email" maxlength="150"></label></div><label>' + u('idea') + '<textarea name="idea" rows="4" maxlength="3000" placeholder="' + u('hint') + '"></textarea></label><details class="request-measurements"><summary>' + tr('Maten van je pot of opstelling (optioneel)','Pot or display measurements (optional)') + '</summary><div class="form-dimensions">' + ['width','depth','height'].map(function (k) { return '<label>' + u(k) + '<input type="number" name="' + k + '" min="0.1" max="10000" step="0.1"></label>'; }).join('') + '</div></details><label class="inquiry-delivery">' + tr('Levering · voorkeur om te bespreken','Delivery · preference to discuss') + '<select name="delivery"><option value="discuss">' + tr('Nog bespreken','To be discussed') + '</option><option value="shipping">' + tr('Verzending bespreken','Discuss delivery') + '</option><option value="collection">' + tr('Afhalen bespreken','Discuss collection') + '</option></select></label>' + window.BonsaiBusiness.enquiryNotice(businessApi()) + '<p class="local-notice">' + u('local') + '</p><button class="button primary" type="submit">' + u('create') + ' ↗</button><p id="request-status" role="status" aria-live="polite"></p></form><div class="request-output" hidden><pre id="request-text" tabindex="-1"></pre><div class="request-actions">' + window.BonsaiBusiness.emailAction(businessApi()) + '<button class="button primary" id="download-request" type="button">' + u('download') + ' ↓</button><button class="button outline" id="copy-request" type="button">' + u('copy') + '</button></div></div></div>';
    if (interestOnly) {
      dialog.querySelector('.local-notice').remove();
      ['.form-pair','.inquiry-delivery'].forEach(function(selector){var node=dialog.querySelector(selector);node.hidden=true;node.querySelectorAll('input,select').forEach(function(input){input.disabled=true;});});
      var feedback=document.createElement('details');feedback.className='interest-feedback interest-options';
      feedback.innerHTML='<summary>'+tr('Extra voorkeuren (optioneel)','Extra preferences (optional)')+'</summary><label>'+tr('Hoe interessant vind je dit?','How interested are you?')+'<select name="interestLevel"><option value="exploring">'+tr('Ik kijk nog rond','Just exploring')+'</option><option value="interested">'+tr('Dit spreekt mij aan','This appeals to me')+'</option><option value="later">'+tr('Misschien voor later','Perhaps later')+'</option></select></label><label>'+tr('Welk bedrag lijkt je passend? (optioneel)','What price feels appropriate? (optional)')+'<input name="budget" type="number" min="0" max="10000" step="1" placeholder="€"></label>';
      dialog.querySelector('.request-measurements').before(feedback);
    }
    renderSelection(); setupDialog(dialog);
    dialog.onclose = function () { if (lastFocus && lastFocus.isConnected) lastFocus.focus(); };
    dialog.querySelector('form').onsubmit = function (event) {
      event.preventDefault(); var form = new FormData(event.currentTarget);
      if(dialog.querySelector('[data-cart-line][data-invalid=true]')||[...dialog.querySelectorAll('#selection-items input')].some(input=>!input.reportValidity())){document.getElementById('request-status').textContent=tr('Controleer eerst de aantallen en maten in je selectie.','Check quantities and dimensions in your selection first.');return;}
      if (!selection.length && !String(form.get('idea') || '').trim()) { document.getElementById('request-status').textContent = u('error'); return; }
      lastRequest = u('draft') + '\n\n' + u('noOrder') + '\n\n' + u('selection') + '\n' + BonsaiCart.text(selection,cartApi()) + '\n\n' + u('name') + ': ' + (form.get('name') || tr('Nog niet ingevuld','Not yet entered')) + '\n' + u('email') + ': ' + (form.get('email') || tr('Nog niet ingevuld','Not yet entered')) + '\n\n' + u('idea') + '\n' + (form.get('idea') || '') + '\n\n' + ['width','depth','height'].map(function (k) { return u(k) + ': ' + (form.get(k) || '—'); }).join('\n')+'\n'+u('quote') + window.BonsaiBusiness.requestText(businessApi(),form.get('delivery'));
      if (interestOnly) {
        var levels={exploring:tr('Ik kijk nog rond','Just exploring'),interested:tr('Dit spreekt mij aan','This appeals to me'),later:tr('Misschien voor later','Perhaps later')};
        lastRequest=u('draft')+'\n\n'+BonsaiCart.text(selection,cartApi())+'\n\n'+tr('Belangstelling: ','Interest: ')+(levels[form.get('interestLevel')]||levels.exploring)+'\n'+tr('Passend bedrag: ','Suggested price: ')+(form.get('budget')?BonsaiPricing.money(Number(form.get('budget')),language):tr('Niet ingevuld','Not entered'))+'\n\n'+u('idea')+'\n'+(form.get('idea')||'')+'\n\n'+['width','depth','height'].map(function(k){return u(k)+': '+(form.get(k)||'—');}).join('\n')+window.BonsaiBusiness.requestText(businessApi());
      }
      var mail=dialog.querySelector('.request-actions a[href^="mailto:"]');
      if(mail){var emailBody=encodeURIComponent(lastRequest);var fits=emailBody.length<6500;mail.href='mailto:'+business.seller.email+'?subject='+encodeURIComponent(tr('Mijn selectie voor BONSAI3D','My selection for BONSAI3D'))+(fits?'&body='+emailBody:'');mail.textContent=fits?tr('Open overzicht in e-mail ↗','Open overview in email ↗'):tr('Open e-mail · voeg je download toe ↗','Open email · attach your download ↗');}
      document.getElementById('request-text').textContent = lastRequest; dialog.querySelector('.request-output').hidden = false; document.getElementById('request-status').textContent = u('ready'); dialog.querySelector('.request-output').scrollIntoView({block:'nearest'}); document.getElementById('request-text').focus({preventScroll:true});
    };
    document.getElementById('download-request').onclick = function () { var url = URL.createObjectURL(new Blob([lastRequest],{type:'text/plain;charset=utf-8'})), anchor = document.createElement('a'); anchor.href = url; anchor.download = 'bonsai3d-' + u('fileName') + '.txt'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(function () { URL.revokeObjectURL(url); },1000); };
    document.getElementById('copy-request').onclick = async function () { try { await navigator.clipboard.writeText(lastRequest); document.getElementById('request-status').textContent = u('copied'); } catch (_) { document.getElementById('request-status').textContent = u('copyFailed'); } };
    dialog.querySelector('form').oninput = function () { invalidateRequest(); };
    dialog.showModal();
  }
  window.addEventListener('popstate',function(){
    var params=new URLSearchParams(location.search),id=params.get('product'),dialog=document.getElementById('product-dialog');
    if(id){if(dialog.open){dialog.onclose=null;dialog.close();}openProduct(id,params.get('finish')||style);}
    else if(dialog.open)dialog.close();
  });
  render();
  if (location.hash) requestAnimationFrame(function () { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); });
  if (query.get('product')) openProduct(query.get('product'),query.get('finish') || style);
})().catch(function (error) {
  var english=new URLSearchParams(location.search).get('lang')==='en';
  document.getElementById('app').innerHTML='<section class="load-error" role="alert"><h1>BONSAI3D</h1><p>'+(english?'The collection could not be loaded. Check your connection and try again.':'De collectie kon niet worden geladen. Controleer je verbinding en probeer opnieuw.')+'</p><button type="button" class="button primary" id="retry-load">'+(english?'Try again':'Probeer opnieuw')+'</button></section>';
  document.getElementById('retry-load').onclick=function(){location.reload();};
  console.error(error);
});
