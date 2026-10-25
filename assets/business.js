(function () {
  'use strict';
  function section(id, title, paragraphs, api) {
    return '<section id="' + id + '" class="service-section"><h2>' + title + '</h2>' + paragraphs.map(function (p) { return p.startsWith('<dl') || p.startsWith('<p') ? p : '<p>' + p + '</p>'; }).join('') + '</section>';
  }
  function preparation(api) {
    if (api.business.status === 'interest') return '';
    return '<p class="business-status">' + api.tr('Collectie in voorbereiding · aanvragen zijn vrijblijvend.', 'Collection in preparation · enquiries are non-binding.') + '</p>';
  }
  function emailAction(api, className) {
    var email = api.business.seller.email;
    if (!email) return '';
    var href = 'mailto:' + email + '?subject=' + encodeURIComponent(api.tr('Een vraag over BONSAI3D', 'A question about BONSAI3D'));
    return '<a class="' + (className || 'button primary') + '" href="' + api.esc(href) + '">' + api.tr('Mail Ruben', 'Email Ruben') + ' ↗</a>';
  }
  function footerContact(api) {
    var email = api.business.seller.email;
    if (!email) return '';
    return '<p class="footer-contact"><span>' + api.tr('Een vraag of een idee?', 'A question or an idea?') + '</span><a href="mailto:' + api.esc(email) + '">' + api.esc(email) + '</a></p>';
  }
  function contactSection(api) {
    var tr = api.tr, email = api.business.seller.email;
    return section('contact', tr('Mail me gerust.', 'Feel free to email me.'), [
      tr('Heb je een vraag over een object, een eigen idee of wil je weten wat er mogelijk is? Stuur me een mail. Je hoeft nog niet precies te weten hoe het moet worden.', 'Have a question about an object, an idea of your own, or want to know what’s possible? Send me an email. You don’t need to have every detail worked out yet.'),
      '<a class="contact-address" href="mailto:' + api.esc(email) + '">' + api.esc(email) + '</a>',
      emailAction(api),
      tr('Vertel welk object je bedoelt en, als je dat al weet, de gewenste maat en afwerking. Heb je iets bewaard bij Mijn interesse? Kopieer dat overzicht en plak het in je mail.', 'Tell me which object you have in mind and, if you know already, the size and finish you’d like. Saved something under My interests? Copy that overview and paste it into your email.')
    ], api);
  }
  function timingSection(api) {
    var tr = api.tr;
    var rows = [
      [tr('Al gemaakt', 'Already made'), tr('Bij een potje dat er al is, bevestig ik eerst of het nog beschikbaar is. Daarna spreken we af wanneer je het kunt ophalen of wanneer ik het verstuur.', 'For a pot that’s already made, I first confirm whether it’s still available. Then we agree when you can collect it or when I’ll send it.')],
      [tr('Nieuw geprint', 'A new print'), tr('De maaktijd hangt af van de maat, de printduur en de afwerking. Houtlook vraagt extra handwerk en droogtijd. Ik bevestig de verwachte planning voordat ik begin.', 'Making time depends on the size, printing time and finish. Wood look needs extra hand finishing and drying time. I confirm the expected schedule before I start.')],
      [tr('Een eigen ontwerp', 'Your own design'), tr('Voor maatwerk kijken we eerst samen naar het idee, de maten en wat haalbaar is. Het uitwerken van een ontwerp en een eventuele proefprint komen vóór het maken van de definitieve versie.', 'For custom work, we first look at the idea, dimensions and what’s feasible. Developing the design and any test print come before making the final version.')]
    ];
    return section('maaktijd', tr('Maak- en levertijd', 'Making and delivery time'), [
      tr('Niet alles op de site is direct klaar om mee te nemen. Ik stem de planning graag met je af; een vaste termijn voor alle objecten kan ik nog niet noemen.', 'Not everything on the site is ready to take home straight away. I’m happy to discuss the schedule with you; I can’t give one fixed lead time for every object yet.'),
      '<dl class="timing-list">' + rows.map(function (row) { return '<div><dt>' + row[0] + '</dt><dd>' + row[1] + '</dd></div>'; }).join('') + '</dl>',
      tr('Maaktijd is de tijd die ik nodig heb om een object te maken en af te werken. Bij verzending komt de bezorgtijd daar nog bij. Ook verzenden of afhalen spreken we vooraf af. Heb je iets voor een bepaalde datum nodig? Zet die datum dan in je mail.', 'Making time is the time I need to produce and finish an object. If it’s shipped, delivery time comes after that. We also agree on shipping or collection beforehand. Need something by a particular date? Include that date in your email.')
    ], api);
  }
  function interestService(api) {
    var tr=api.tr;
    var body=contactSection(api)+timingSection(api)+section('prijzen',tr('Prijzen en afwerking','Prices and finishes'),[
      tr('Bij de objecten staan richtprijzen. Houtlook kost €10 tot €30 extra, afhankelijk van de maat. Bomen, planten, stenen en andere aankleding horen er niet bij.','The objects show guide prices. Wood look adds €10 to €30, depending on size. Trees, plants, stones and other props are not included.')
    ],api);
    body+=section('levering',tr('Wat is er beschikbaar?','What is available?'),[
      tr('Op dit moment zijn alleen eigen potjes op voorraad. De andere objecten zijn eerder gemaakte vormen of ontwerpen die nog uitgewerkt moeten worden. Beschikbare maten en kleuren bevestig ik apart.','At the moment, only my own pots are in stock. The other objects are previously made shapes or designs that still need work. I confirm available sizes and colours separately.')
    ],api);
    return '<div class="service-page wrap"><header class="service-heading"><p class="eyebrow">BONSAI3D / SERVICE</p><h1 class="page-title">'+tr('Service & contact','Service & contact')+'</h1><p class="business-status interest-explanation">'+tr('Interessepeiling: je kunt hier voorbeelden bekijken en je wensen bewaren, maar nog niet bestellen, reserveren of betalen. Je overzicht kun je zelf per e-mail delen.','Interest survey: browse examples and save your preferences here. Ordering, reservations and payments are not available yet. You can share your overview yourself by email.')+'</p></header><div class="service-body">'+body+'</div></div>';
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
      tr('“Ontwerp op aanvraag” betekent dat de vorm nog moet worden uitgewerkt en geprint.', '“Design on enquiry” means the form still needs to be developed and printed.'),
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
    return '<div class="service-page wrap">' + intro + '<div class="service-layout">' + nav + '<div class="service-body">' + body + '<p class="fineprint">' + tr('Bijgewerkt: 25 oktober 2026. Voorbereidingsinformatie; de definitieve verkoopafspraken worden vóór een aankoop verstrekt.', 'Updated: 25 October 2026. Preparation information; final sales agreements are provided before a purchase.') + '</p></div></div></div>';
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
      tr('BONSAI3D gebruikt geen advertentietrackers. Lettertypen en productbeelden worden met de website geladen. Functionele voorkeuren gebruiken lokale browseropslag.', 'BONSAI3D uses no advertising trackers. Fonts and product images load with the website. Functional preferences use local browser storage.'),
      window.BonsaiAnalyticsConfigured
        ? tr('Op het eigen domein gebruiken we Cloudflare Web Analytics voor inzicht in paginaweergaven, bezoeken en websiteprestaties. Deze meting gebruikt geen trackingcookies of browseropslag voor bezoekersherkenning. De website slaat de meting over als je browser Do Not Track of Global Privacy Control doorgeeft. Adblockers kunnen de meting beperken.', 'On our own domain we use Cloudflare Web Analytics to understand page views, visits and website performance. This measurement uses no tracking cookies or browser storage to recognise visitors. The website skips measurement when your browser signals Do Not Track or Global Privacy Control. Ad blockers may limit measurement.')
        : tr('Bezoekersmeting via Cloudflare Web Analytics is voorbereid maar staat hier nog uit. Er wordt geen analytics-script geladen.', 'Visitor measurement with Cloudflare Web Analytics is prepared but is currently disabled here. No analytics script is loaded.'),
      '<a href="https://www.cloudflare.com/web-analytics/" target="_blank" rel="noopener">Cloudflare Web Analytics ↗</a>',
      tr('De website wordt gehost via GitHub Pages. Bij het laden ontvangt GitHub technische gegevens, zoals je IP-adres en informatie over het verzoek en je browser. Daarvoor geldt de ', 'The website is hosted through GitHub Pages. When it loads, GitHub receives technical information, such as your IP address and information about the request and your browser. See the ') + '<a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">' + tr('privacyverklaring van GitHub', 'GitHub privacy statement') + ' ↗</a>.'
    ], api);
    body += section('mail-contact', tr('Als je me mailt.', 'When you email me.'), [
      tr('De mailknoppen openen je eigen mailprogramma. Je kiest daar zelf wat je meestuurt en wanneer je het bericht verzendt. Pas dan ontvang ik je e-mailadres en je bericht.', 'The email buttons open your own email app. You choose what to include and when to send it. Only then do I receive your email address and your message.'),
      tr('Gebruik de mail voor je vraag of idee en stuur alleen de gegevens mee die daarvoor nodig zijn. Je kunt me op hetzelfde adres ook vragen stellen over je gegevens.', 'Use the email for your question or idea and include only the details needed for it. You can also use the same address to ask me about your data.'),
      footerContact(api),
      api.link('service', tr('Contact en maaktijd', 'Contact and making time') + ' ↗', 'text-link')
    ], api);
    return '<div class="service-page privacy-page wrap"><header class="service-heading"><p class="eyebrow">BONSAI3D / PRIVACY</p><h1 class="page-title">' + tr('Jouw gegevens.<br>Jouw keuze.', 'Your data.<br>Your choice.') + '</h1><p>' + tr('Dit is hoe de huidige website met je selectie, voorkeuren en interesseconcept omgaat.', 'Here is how the current website handles your selection, preferences and interest draft.') + '</p></header><div class="privacy-body">' + body + '<p class="fineprint">' + tr('Bijgewerkt: 25 oktober 2026.', 'Updated: 25 October 2026.') + '</p></div></div>';
  }
  window.BonsaiBusiness = {
    service: service,
    privacy: privacy,
    preparation: preparation,
    emailAction: emailAction,
    footerContact: footerContact,
    enquiryNotice: function (api) {
      if(api.business.status==='interest')return '';
      return '<div class="enquiry-agreement"><strong>' + api.tr('Vrijblijvend interesseconcept', 'Non-binding interest draft') + '</strong><p>' + api.tr('Dit is geen bestelling. Het contactkanaal is nog in voorbereiding. Voor een aankoop worden uitvoering, definitieve totaalprijs, levering, betaling en retourinformatie eerst bevestigd.', 'This is not an order. The contact channel is still being prepared. Before a purchase, the final piece, total price, delivery, payment and returns information are confirmed.') + '</p>' + api.link('service', api.tr('Aanvragen, levering en retouren', 'Enquiries, delivery and returns') + ' ↗', 'text-link') + api.link('privacy', api.tr('Hoe je gegevens worden gebruikt', 'How your data is used') + ' ↗', 'text-link') + '</div>';
    },
    requestText: function (api, delivery) {
      var tr = api.tr;
      if(api.business.status==='interest')return '\n\n'+tr('Dit overzicht is niet verstuurd.','This overview has not been sent.');
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
