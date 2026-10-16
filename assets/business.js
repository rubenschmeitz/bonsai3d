(function () {
  'use strict';
  function section(id, title, paragraphs, api) {
    return '<section id="' + id + '" class="service-section"><h2>' + title + '</h2>' + paragraphs.map(function (p) { return p.startsWith('<dl') ? p : '<p>' + p + '</p>'; }).join('') + '</section>';
  }
  function preparation(api) {
    if (api.business.status === 'interest') return '<p class="business-status">'+api.tr('Interessepeiling · geen bestellingen of reserveringen.','Interest survey · no orders or reservations.')+'</p>';
    return '<p class="business-status">' + api.tr('Collectie in voorbereiding · aanvragen zijn vrijblijvend.', 'Collection in preparation · enquiries are non-binding.') + '</p>';
  }
  function interestService(api) {
    var tr=api.tr;
    var body=section('aanvragen',tr('Eerst ontdekken wat aanspreekt.','First, discover what appeals.'),[
      tr('BONSAI3D onderzoekt de belangstelling voor zelfgemaakte bonsaiobjecten. Je kunt voorbeelden bekijken en kleuren, maten en ideeën bewaren bij Mijn interesse. Deze website neemt geen bestellingen, reserveringen of betalingen aan.','BONSAI3D is exploring interest in handmade bonsai objects. Browse examples and save colours, sizes and ideas to My interests. This website does not accept orders, reservations or payments.'),
      tr('Voeg feedback toe: wat spreekt je aan, wat zou je anders willen en welk bedrag lijkt je passend? Kopieer of download je interesseconcept en deel het zelf in een Marktplaatsgesprek. Er wordt niets automatisch verstuurd en er worden geen reacties verzameld op deze website.','Add feedback: what appeals to you, what would you change and what price feels appropriate? Copy or download your interest draft and share it yourself in a Marktplaats conversation. Nothing is sent automatically and this website collects no responses.'),
      '<button class="button primary" type="button" data-open-inquiry>'+tr('Bekijk mijn interesse','View my interests')+' ↗</button>'
    ],api);
    body+=section('prijzen',tr('Een richtprijs om mee te denken.','A guide price for your feedback.'),[
      tr('De bedragen zijn voorlopige inschattingen, geen verkoopaanbod of definitieve offerte. Eigen maten, kleuren en houtlook helpen om voorkeuren en een mogelijke prijs te verkennen. Houtlook vraagt extra handwerk: €10 tot €30 extra, afhankelijk van de maat.','Amounts are provisional estimates, not an offer for sale or a final quote. Custom dimensions, colours and wood-look finishes help explore preferences and a possible price. Wood look requires additional handwork: €10 to €30 extra, depending on size.'),
      tr('Bomen, planten, stenen en overige styling op de beelden horen niet bij de prijsinschatting. Er is geen betaalbaar eindtotaal en er wordt niets afgeschreven.','Trees, plants, stones and other styling in images are not part of the estimate. There is no payable final total and no money is charged.')
    ],api);
    body+=section('levering',tr('Eigen prints en ontwerpvoorbeelden.','Own prints and design examples.'),[
      tr('Er zijn nu alleen eigen potjes op voorraad. Dit is geen toezegging van beschikbaarheid of reservering. Andere voorbeelden tonen eerder gemaakte vormen of nog te ontwikkelen ontwerpen. Een gegenereerde foto bewijst niet dat een object al is gemaakt.','Only own pots are currently in stock. This is not a promise of availability or a reservation. Other examples show previously made shapes or designs still to be developed. A generated photograph does not prove an object has been made.'),
      tr('De beelden zijn gegenereerde voorbeelden. Oorspronkelijke productfoto’s dienen alleen als referentie en worden niet getoond. Maat, materiaal, maakbaarheid en bedoeld gebruik zijn nog te onderzoeken.','The images are generated examples. Original product photographs are used only as references and are not displayed. Size, material, manufacturability and intended use still need evaluation.')
    ],api);
    body+=section('retour',tr('Bestellen is een volgende stap.','Ordering is a future step.'),[
      tr('Als verkoop via de website wordt gestart, komen er duidelijke verkopers- en contactgegevens, definitieve prijzen, leveringsafspraken, betaling, toepasselijke retourinformatie en een bestelbevestiging. Nu kun je hier geen koop sluiten of retour aanmelden.','If sales through the website start, seller and contact details, final prices, delivery arrangements, payment, applicable returns information and order confirmation will be provided. You cannot currently conclude a purchase or submit a return here.')
    ],api);
    body+=section('contact',tr('Deel je reactie via Marktplaats.','Share your response through Marktplaats.'),[
      tr('Kom je hier vanuit een Marktplaatsadvertentie? Deel je reactie in dat gesprek. Er is nog geen openbaar e-mailadres of directe advertentielink ingesteld. Een gedownload of gekopieerd concept is pas gedeeld wanneer je het zelf verstuurt.','Did you arrive from a Marktplaats listing? Share your response in that conversation. No public email address or direct listing link has been configured. A downloaded or copied draft is only shared when you send it yourself.'),
      api.link('privacy',tr('Over je gegevens en lokale opslag','About your data and local storage')+' ↗','text-link')
    ],api);
    return '<div class="service-page wrap"><header class="service-heading"><p class="eyebrow">BONSAI3D / '+tr('INTERESSEPEILING','INTEREST SURVEY')+'</p><h1 class="page-title">'+tr('Wat spreekt jou aan?','What appeals to you?')+'</h1><p>'+tr('Eerst kijken welke objecten, details en uitvoeringen mensen interessant vinden.','First, discover which objects, details and finishes people find interesting.')+'</p>'+preparation(api)+'</header><div class="service-body">'+body+'</div></div>';
  }
  function service(api) {
    if (api.business.status === 'interest') return interestService(api);
    var tr = api.tr, esc = api.esc;
    var contents = [
      ['aanvragen', 'Zo werkt een aanvraag', 'How an enquiry works'],
      ['prijzen', 'Prijzen & betaling', 'Prices & payment'],
      ['levering', 'Levering & voorraad', 'Delivery & availability'],
      ['retour', 'Bedenktijd & maatwerk', 'Returns & custom work'],
      ['kwaliteit', 'Uitvoering & vragen', 'Final pieces & questions'],
      ['contact', 'Contact', 'Contact']
    ];
    var intro = '<header class="service-heading"><p class="eyebrow">BONSAI3D / ' + tr('GOED OM TE WETEN', 'GOOD TO KNOW') + '</p><h1 class="page-title">' + tr('Een object kiezen.<br>Duidelijke afspraken.', 'Choose an object.<br>Clear agreements.') + '</h1><p>' + tr('Van een eerste idee tot een passende uitvoering. Hier lees je hoe een aanvraag werkt en welke afspraken we vóór een aankoop vastleggen.', 'From an initial idea to a suitable final piece. Here is how an enquiry works and what we agree before a purchase.') + '</p>' + preparation(api) + '<p class="fineprint">' + tr('BONSAI3D wordt voorbereid voor verkoop. Je kunt nu een interesseconcept bewaren; deze website neemt geen bestellingen of betalingen aan. De gegevens van de verkoper en het contactadres volgen vóór de verkoopstart.', 'BONSAI3D is being prepared for sales. You can currently save an interest draft; this website does not accept orders or payments. Seller details and a contact address will be published before sales start.') + '</p></header>';
    var nav = '<nav class="service-index" aria-label="' + tr('Op deze pagina', 'On this page') + '">' + contents.map(function (c) { return '<a href="#' + c[0] + '">' + tr(c[1], c[2]) + ' ↗</a>'; }).join('') + '</nav>';
    var body = section('aanvragen', tr('Van selectie naar voorstel.', 'From selection to proposal.'), [
      tr('Bewaar een object met de gewenste afwerking in de winkelwagen. Of gebruik de maatwerkcalculator en beschrijf je eigen idee. Naam en e-mailadres zijn in deze voorbereidingsfase optioneel.', 'Save an object and your preferred finish in your cart. Or use the custom calculator and describe your own idea. Name and email are optional during this preparation phase.'),
      tr('Download of kopieer je interesseconcept. Het blijft op je eigen apparaat totdat je het zelf deelt. Er wordt niets automatisch naar Ruben verstuurd.', 'Download or copy your interest draft. It stays on your own device until you share it yourself. Nothing is automatically sent to Ruben.'),
      tr('Bij de toekomstige verkoop bespreken we eerst de maat, het materiaal en de maakbaarheid. Je ontvangt daarna een schriftelijk prijsvoorstel met de uitvoering, totaalprijs, levering, betaling en toepasselijke retourinformatie. Een interesseconcept is geen bestelling.', 'For future sales, we first discuss size, material and manufacturability. You then receive a written proposal stating the final version, total price, delivery, payment and applicable returns information. An interest draft is not an order.')
    ], api);
    body += section('prijzen', tr('Een richtprijs om mee te beginnen.', 'A guide price to get started.'), [
      tr('De bedragen in de collectie en calculator zijn voorlopige richtprijzen. Ze gelden voor het object; bomen, planten, stenen en overige styling zijn niet inbegrepen. Een setprijs herken je aan “per set”.', 'Prices in the collection and calculator are provisional guide prices. They cover the object; trees, plants, stones and other styling are not included. Set prices are marked “per set”.'),
      tr('Vóór akkoord krijg je één definitieve consumentenprijs, met de toepasselijke belastingen en eventuele verzendkosten duidelijk vermeld. De definitieve belastingvermelding staat in het prijsvoorstel. Betaling volgt pas na de afspraken over een bestelling.', 'Before accepting a proposal, you receive a final consumer price with applicable taxes and any delivery charges clearly stated. The final tax treatment is stated in the proposal. Payment follows only after an order has been agreed.'),
      tr('Een groter formaat, nieuw ontwerp of extra handwerk kan een afzonderlijke offerte vragen. Betaalwijze en een eventuele aanbetaling worden vooraf afgesproken, voordat je een bestelling bevestigt.', 'A larger size, new design or additional handwork may require a separate quote. Payment method and any deposit are agreed in advance, before you confirm an order.')
    ], api);
    body += section('levering', tr('Voorraad, bijmaken of ontwikkelen.', 'In stock, made to order or developed.'), [
      tr('Alleen potjes zijn momenteel op voorraad. De beschikbare maat en kleur bevestigen we bij een aanvraag. Andere objecten zijn bij te maken op aanvraag of staan als ontwerpvoorstel in de collectie.', 'Only pots are currently in stock. Available size and colour are confirmed on enquiry. Other objects can be made on enquiry or are shown as design proposals.'),
      tr('“Ontwerp op aanvraag” betekent dat de vorm nog moet worden uitgewerkt en geprint. Een gegenereerd presentatiebeeld is geen foto van beschikbare voorraad.', '“Design on enquiry” means the form still needs to be developed and printed. A generated display image is not a photograph of available stock.'),
      tr('Je kunt in je aanvraag aangeven of je verzending of afhalen wilt bespreken. Beschikbaarheid, levertermijn, kosten en locatie leggen we in het voorstel vast. Er is nu nog geen vaste verzendprijs of gegarandeerde levertijd.', 'In your enquiry, you can say whether you would like to discuss delivery or collection. Availability, lead time, costs and location are set out in the proposal. There is currently no fixed shipping price or guaranteed delivery time.')
    ], api);
    body += section('retour', tr('Standaardproduct of echt maatwerk?', 'Standard product or truly custom?'), [
      tr('Voor de toekomstige zakelijke verkoop op afstand geldt bij standaardproducten doorgaans 14 dagen bedenktijd vanaf de dag na ontvangst. Een standaardmodel dat pas na bestelling wordt geprint, valt niet automatisch buiten die bedenktijd.', 'For future business sales at a distance, standard products generally have a 14-day withdrawal period starting the day after receipt. Printing a standard model only after ordering does not automatically remove that right.'),
      tr('Een specifiek voor jou gemaakt product volgens persoonlijke specificaties kan uitgezonderd zijn. Als dat van toepassing is, wordt het vóór aankoop uitgelegd. Alleen “op aanvraag” of een standaard kleurkeuze is geen algemene reden om retouren uit te sluiten.', 'A product made specifically to your personal specifications may be exempt. If applicable, this is explained before purchase. “On enquiry” or a standard colour choice is not a general reason to exclude returns.'),
      tr('Bij herroeping meld je binnen de bedenktijd dat je van de koop af wilt. Daarna heb je 14 dagen om terug te sturen. Retouradres, eventuele retourkosten en terugbetaling worden vóór aankoop meegedeeld. Vragen over een gebrek of schade staan los van bedenktijd.', 'To withdraw, notify the seller within the withdrawal period. You then have 14 days to return the product. The return address, any return costs and refund arrangements are provided before purchase. Questions about defects or damage are separate from withdrawal rights.'),
      tr('De verkoop- en retourcontactfunctie wordt ingericht vóór de verkoopstart. Op deze website kun je nu geen bestelling plaatsen of een retourmelding versturen.', 'Sales and returns contact facilities will be set up before sales start. You cannot currently place an order or submit a return notification on this website.')
    ], api);
    body += section('kwaliteit', tr('Afspreken wat je krijgt.', 'Agreeing what you receive.'), [
      tr('De print en nabewerking bepalen de uitvoering. Ruw zwart of grijs blijft eenvoudig; houtlook vraagt extra schuren, kleuren en afwerken. Details en kleur kunnen per gemaakt exemplaar verschillen.', 'Printing and finishing determine the final piece. Raw black or grey stays simple; a wood look requires additional sanding, colouring and finishing. Details and colour may differ between made pieces.'),
      tr('Materiaal, afmetingen, afwerking en bedoeld gebruik worden vooraf bevestigd. Voor draagvermogen, buitengebruik en waterbestendigheid maken we afspraken op basis van de concrete uitvoering.', 'Material, dimensions, finish and intended use are confirmed in advance. Load capacity, outdoor use and water resistance are discussed for the specific final piece.'),
      tr('Een geleverd product moet beantwoorden aan de afspraken en wat je er redelijkerwijs van mag verwachten. Meld een gebrek of transportschade met een beschrijving en, waar handig, een foto. We bespreken dan een passende oplossing; wettelijke consumentenrechten blijven gelden.', 'A delivered product must match the agreement and what you can reasonably expect. Report a defect or transport damage with a description and, where useful, a photograph. We then discuss an appropriate remedy; statutory consumer rights still apply.')
    ], api);
    var seller = api.business.seller;
    var details = [['legalName', 'Verkoper', 'Seller'], ['address', 'Vestigingsadres', 'Business address'], ['email', 'E-mailadres', 'Email'], ['phone', 'Telefoon', 'Phone'], ['kvkNumber', 'KVK-nummer', 'KVK number'], ['vatId', 'Btw-identificatienummer', 'VAT identification number']].filter(function (row) { return seller[row[0]]; });
    body += section('contact', tr('Contact wordt voorbereid.', 'Contact is being prepared.'), [
      tr('Er is nog geen openbaar contactadres gekozen. Bewaar je idee gerust als interesseconcept. Je kunt het zelf delen zodra het contactkanaal beschikbaar is.', 'A public contact address has not yet been chosen. You can save your idea as an interest draft and share it yourself once the contact channel is available.'),
      details.length ? '<dl class="seller-details">' + details.map(function (row) { return '<div><dt>' + tr(row[1], row[2]) + '</dt><dd>' + esc(seller[row[0]]) + '</dd></div>'; }).join('') + '</dl>' : tr('De definitieve verkoper, rechtsvorm, registratie- en contactgegevens worden vóór de verkoopstart toegevoegd.', 'The final seller, legal structure, registration and contact details will be added before sales start.'),
      '<button class="button primary" type="button" data-open-inquiry>' + tr('Bewaar mijn interesseconcept', 'Save my interest draft') + ' ↗</button>'
    ], api);
    return '<div class="service-page wrap">' + intro + '<div class="service-layout">' + nav + '<div class="service-body">' + body + '<p class="fineprint">' + tr('Bijgewerkt: 14 oktober 2026. Voorbereidingsinformatie; de definitieve verkoopafspraken worden vóór een aankoop verstrekt.', 'Updated: 14 October 2026. Preparation information; final sales agreements are provided before a purchase.') + '</p></div></div></div>';
  }
  function privacy(api) {
    var tr = api.tr;
    var body = section('op-apparaat', tr('Wat op je apparaat blijft.', 'What stays on your device.'), [
      tr('Deze website onthoudt je taal, afwerkingsvoorkeur, productselectie, personalisatiewensen per object en de instellingen van de maatwerkcalculator in de lokale opslag van je browser. Dat maakt het mogelijk om je idee bij een volgend bezoek verder uit te werken.', 'This website remembers your language, finish preference, product selection, per-object personalisation preferences and custom calculator settings in your browser’s local storage. This lets you continue developing your idea on a later visit.'),
      tr('Feedback, belangstelling en het opgegeven bedrag uit het feedbackformulier worden niet in die lokale opslag bewaard en niet automatisch verstuurd. Er worden hier geen naam of e-mailadres gevraagd. Ze worden alleen verwerkt in het concept dat je op dit apparaat maakt. Een gedownload of gekopieerd concept kan die gegevens bevatten; deel het alleen met de bedoelde ontvanger.', 'Feedback, interest level and suggested price from the feedback form are not saved in that local storage or automatically sent. No name or email is requested here. They are only included in the draft you prepare on this device. A downloaded or copied draft may contain these details; share it only with the intended recipient.'),
      tr('Je kunt een interesseconcept maken zonder contactgegevens. Geef hier geen betaalgegevens of andere gevoelige informatie op. Er is geen klantaccount en geen automatische aanvraagregistratie.', 'You can prepare an interest draft without contact details. Do not enter payment details or other sensitive information here. There is no customer account or automatic enquiry registration.'),
      '<button class="button outline" type="button" id="clear-site-data">' + tr('Wis mijn selectie en voorkeuren', 'Clear my selection and preferences') + '</button><span id="privacy-status" role="status" aria-live="polite"></span>'
    ], api);
    body += section('website', tr('Website en hosting.', 'Website and hosting.'), [
      tr('BONSAI3D gebruikt op deze website geen eigen advertentietrackers of analyticsdiensten. Lettertypen en productbeelden worden met de website geladen. Functionele voorkeuren gebruiken lokale browseropslag.', 'BONSAI3D uses no advertising trackers or analytics services on this website. Fonts and product images load with the website. Functional preferences use local browser storage.'),
      tr('De website wordt gehost via GitHub Pages. Bij het laden ontvangt GitHub technische gegevens, zoals je IP-adres en informatie over het verzoek en je browser. Daarvoor geldt de ', 'The website is hosted through GitHub Pages. When it loads, GitHub receives technical information, such as your IP address and information about the request and your browser. See the ') + '<a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">' + tr('privacyverklaring van GitHub', 'GitHub privacy statement') + ' ↗</a>.'
    ], api);
    body += section('later-contact', tr('Wanneer je later contact opneemt.', 'When you contact us in future.'), [
      tr('Het openbare contactkanaal en de definitieve verkoper zijn nog niet vastgesteld. Vóór de verkoopstart vullen we deze informatie aan met wie verantwoordelijk is, welke gegevens nodig zijn voor offertes en bestellingen, de grondslagen, ontvangers en bewaartermijnen.', 'The public contact channel and final seller have not yet been established. Before sales start, this information will be completed with the responsible party, the data needed for quotes and orders, legal bases, recipients and retention periods.'),
      tr('Ook wordt dan uitgelegd hoe je inzage, correctie of verwijdering kunt vragen en hoe je andere privacyrechten kunt uitoefenen. Je kunt over persoonsgegevens een klacht indienen bij de ', 'It will also explain how to request access, correction or erasure and exercise other privacy rights. You may lodge a personal-data complaint with the ') + '<a href="https://autoriteitpersoonsgegevens.nl/" target="_blank" rel="noopener">' + tr('Autoriteit Persoonsgegevens', 'Dutch Data Protection Authority') + ' ↗</a>.',
      api.link('service', tr('Lees over aanvragen en contact', 'Read about enquiries and contact') + ' ↗', 'text-link')
    ], api);
    return '<div class="service-page privacy-page wrap"><header class="service-heading"><p class="eyebrow">BONSAI3D / PRIVACY</p><h1 class="page-title">' + tr('Jouw gegevens.<br>Jouw keuze.', 'Your data.<br>Your choice.') + '</h1><p>' + tr('Dit is hoe de huidige website met je selectie, voorkeuren en interesseconcept omgaat.', 'Here is how the current website handles your selection, preferences and interest draft.') + '</p></header><div class="privacy-body">' + body + '<p class="fineprint">' + tr('Bijgewerkt: 14 oktober 2026.', 'Updated: 14 October 2026.') + '</p></div></div>';
  }
  window.BonsaiBusiness = {
    service: service,
    privacy: privacy,
    preparation: preparation,
    enquiryNotice: function (api) {
      if(api.business.status==='interest')return '<div class="enquiry-agreement"><strong>'+api.tr('Alleen belangstelling peilen','Exploring interest only')+'</strong><p>'+api.tr('Dit is geen bestelling of reservering. Je voorkeuren en feedback blijven op je apparaat. Kopieer ze zelf naar een Marktplaatsgesprek; wij ontvangen ze niet via deze website.','This is not an order or reservation. Your preferences and feedback stay on your device. Copy them yourself into a Marktplaats conversation; we do not receive them through this website.')+'</p>'+api.link('service',api.tr('Over deze peiling','About this survey')+' ↗','text-link')+' '+api.link('privacy','Privacy ↗','text-link')+'</div>';
      return '<div class="enquiry-agreement"><strong>' + api.tr('Vrijblijvend interesseconcept', 'Non-binding interest draft') + '</strong><p>' + api.tr('Dit is geen bestelling. Het contactkanaal is nog in voorbereiding. Voor een aankoop worden uitvoering, definitieve totaalprijs, levering, betaling en retourinformatie eerst bevestigd.', 'This is not an order. The contact channel is still being prepared. Before a purchase, the final piece, total price, delivery, payment and returns information are confirmed.') + '</p>' + api.link('service', api.tr('Aanvragen, levering en retouren', 'Enquiries, delivery and returns') + ' ↗', 'text-link') + api.link('privacy', api.tr('Hoe je gegevens worden gebruikt', 'How your data is used') + ' ↗', 'text-link') + '</div>';
    },
    requestText: function (api, delivery) {
      var tr = api.tr;
      if(api.business.status==='interest')return '\n\n'+tr('Dit is alleen feedback voor een interessepeiling, geen bestelling of reservering. Niet verstuurd. Deel dit zelf in je Marktplaatsgesprek.','This is only feedback for an interest survey, not an order or reservation. Not sent. Share it yourself in your Marktplaats conversation.');
      var choice = {discuss: tr('Nog bespreken', 'To be discussed'), shipping: tr('Verzending bespreken', 'Discuss delivery'), collection: tr('Afhalen bespreken', 'Discuss collection')};
      return '\n\n' + tr('Leveringsvoorkeur: ', 'Delivery preference: ') + (choice[delivery] || choice.discuss) + '\n\n' + tr('Vóór een aankoop te bevestigen: uitvoering en maakbaarheid; definitieve consumentenprijs met toepasselijke belastingen en verzendkosten; beschikbare voorraad of maaktermijn; betaling; verkopersgegevens; bedenktijd en eventuele specifieke maatwerkuitzondering.', 'To confirm before a purchase: final piece and manufacturability; final consumer price with applicable taxes and shipping; available stock or production lead time; payment; seller details; withdrawal rights and any specific custom-work exception.') + '\n\n' + tr('Dit concept is niet verstuurd en is geen bestelling. Het openbare contactkanaal van BONSAI3D is nog in voorbereiding. Bewaar het concept totdat je het zelf wilt delen.', 'This draft has not been sent and is not an order. BONSAI3D’s public contact channel is still being prepared. Save the draft until you wish to share it yourself.');
    },
    bind: function (api) {
      var button = document.getElementById('clear-site-data');
      if (!button) return;
      button.onclick = function () {
        var keys = ['ruben-shop-language', 'bonsai3d-style', 'bonsai3d-selection', 'bonsai3d-custom'];
        (api.shop.previousSlugs || []).concat(api.shop.previousSlug || []).forEach(function (slug) { keys.push(slug + '-selection'); });
        try {
          keys.forEach(function (key) { localStorage.removeItem(key); });
          api.clearSelection();
          if (window.BonsaiDetails) window.BonsaiDetails.draft = '';
          document.getElementById('privacy-status').textContent = api.tr('Je opgeslagen selectie en voorkeuren zijn gewist. Gedownloade bestanden en je klembord blijven op je apparaat.', 'Your saved selection and preferences have been cleared. Downloaded files and your clipboard remain on your device.');
        } catch (_) {
          document.getElementById('privacy-status').textContent = api.tr('Wissen lukte niet. Je kunt de websitegegevens verwijderen via de instellingen van je browser.', 'Clearing failed. You can remove this site’s data through your browser settings.');
        }
      };
    }
  };
})();
