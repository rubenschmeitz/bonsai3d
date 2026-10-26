(function () {
  'use strict';
  var metadata = {"home": {"nl": ["Bonsaitafels, jita’s en miniaturen | BONSAI3D", "Ontdek de 3D-geprinte bonsaitafels, jita’s, schalen en miniaturen van BONSAI3D. Bekijk ontwerpen, afwerkingen en voorbeelden uit het atelier."], "en": ["Bonsai tables, jitas and miniatures | BONSAI3D", "Explore 3D-printed bonsai tables, jitas, pots and miniatures by BONSAI3D, with designs, finishes and workshop examples."]}, "collection": {"nl": ["Collectie bonsaitafels, schalen en miniaturen | BONSAI3D", "Bekijk de BONSAI3D-collectie: bonsaitafels, jita’s, schalen, miniaturen en presentatiedetails, met beelden en informatie per ontwerp."], "en": ["Bonsai tables, pots and miniatures collection | BONSAI3D", "Browse BONSAI3D bonsai tables, jitas, pots, miniatures and display details, with images and information for each design."]}, "atelier": {"nl": ["Het atelier en de afwerkingen | BONSAI3D", "Lees hoe Ruben bonsai-accessoires ontwerpt en 3D-print. Bekijk het maakproces en afwerkingen zoals houtlook en matzwart."], "en": ["The workshop and finishes | BONSAI3D", "See how Ruben designs and 3D-prints bonsai accessories, including the making process, wood-look and matte-black finishes."]}, "custom": {"nl": ["Eigen ideeën voor bonsai-accessoires | BONSAI3D", "Verken de mogelijkheden voor een eigen bonsaitafel, schaal of accent. Bekijk maten, vormen en afwerkingen als vertrekpunt voor je idee."], "en": ["Your ideas for bonsai accessories | BONSAI3D", "Explore sizes, shapes and finishes for your own bonsai table, pot or accent as a starting point for an idea."]}, "service": {"nl": ["Contact en informatie over het maken | BONSAI3D", "Stel Ruben een vraag over BONSAI3D, een ontwerp of afwerking. Lees hoe het maken van prints en het bespreken van de planning werkt."], "en": ["Contact and making information | BONSAI3D", "Ask Ruben about BONSAI3D designs and finishes, and read about making prints and discussing the schedule."]}, "privacy": {"nl": ["Privacy en browservoorkeuren | BONSAI3D", "Lees hoe BONSAI3D omgaat met je browservoorkeuren, lokale selectie, contact en eventuele bezoekersmeting."], "en": ["Privacy and browser preferences | BONSAI3D", "Read how BONSAI3D handles browser preferences, local selections, contact and optional visitor measurement."]}};
  function update(language) {
    var info = metadata[document.body.dataset.page];
    if (!info) return;
    var values = info[language === 'en' ? 'en' : 'nl'];
    document.title = values[0];
    document.querySelector('meta[name="description"]').content = values[1];
    document.querySelector('meta[property="og:title"]').content = values[0];
    document.querySelector('meta[property="og:description"]').content = values[1];
    document.querySelector('meta[property="og:locale"]').content = language === 'en' ? 'en_GB' : 'nl_NL';
    document.querySelector('meta[name="twitter:title"]').content = values[0];
    document.querySelector('meta[name="twitter:description"]').content = values[1];
    var imageAlt = language === 'en' ? 'BONSAI3D — bonsai logo' : 'BONSAI3D — bonsai-logo';
    document.querySelector('meta[property="og:image:alt"]').content = imageAlt;
    document.querySelector('meta[name="twitter:image:alt"]').content = imageAlt;
  }
  window.BonsaiDiscovery = Object.freeze({update: update});
  var token = (window.BonsaiSiteConfig || {}).cloudflareToken;
  var valid = typeof token === 'string' && /^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(token);
  var production = location.protocol === 'https:' && ['bonsai3d.nl', 'www.bonsai3d.nl'].includes(location.hostname);
  var optedOut = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  window.BonsaiAnalyticsConfigured = Boolean(valid && production);
  if (!valid || !production || optedOut) return;
  var beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.defer = true;
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({token: token}));
  document.head.appendChild(beacon);
}());
