# Vindbaarheid en bezoekersmeting voor bonsai3d.nl

Voorbereiding van 25 oktober 2026. Hosting blijft GitHub Pages; domeinregistratie
en DNS blijven bij Mijn.host. Cloudflare wordt hier gebruikt voor Web Analytics,
niet voor hosting of een nameserververhuizing. Google Search Console is de
aanvulling voor zichtbaarheid in Google. De voorbereide websiteversie is nog niet gepubliceerd. Ontvangst van externe
metingen en sitemapinzendingen zijn nog niet gecontroleerd.

Update: de Cloudflare Web Analytics-site voor bonsai3d.nl is inmiddels aangemaakt
en de echte openbare sitecode is in assets/site-config.js opgenomen. De koppeling
is via de bestaande browsersessie ingericht zonder Codex af te sluiten. De code
is nog niet gepubliceerd; ontvangst van echte bezoeken is nog niet vastgesteld.

## Wat de website nu voorbereidt

- De vijf inhoudspagina’s staan in sitemap.xml en krijgen `index,follow` in de
  voorbereide release. De oude `noindex,nofollow` blokkeerde opname in Google.
- Iedere pagina heeft een eigen titel en omschrijving. De renderer behoudt die
  informatie en schakelt de tekst mee met de bestaande NL/EN-taalkeuze.
- Canonical-URL’s wijzen naar de Nederlandse hoofd-URL’s op https://bonsai3d.nl/.
  Filters, stijlen en productselecties krijgen geen afzonderlijke indexvermelding.
  Dit is bewust een eerste inrichting voor de Nederlandse website. Voor aparte
  Engelse zoekresultaten zijn later stabiele, afzonderlijk indexeerbare taal-URL’s
  en bijbehorende hreflang-links nodig; die worden hier niet gesimuleerd.
- robots.txt verwijst naar de sitemap. Privacy en de oude afwerkingen-redirect
  blijven `noindex,follow`; ze staan niet in de sitemap.
- Open Graph-tags helpen bij gedeelde links. De homepage heeft WebSite-schema,
  zonder verzonnen bedrijfsadres, reviews, voorraad of Product/Offer-claims.
- Cloudflare Web Analytics kan met één openbare sitecode worden aangezet.
  Zonder code wordt geen analytics-script geladen. Ook met code meet de loader
  uitsluitend op HTTPS bonsai3d.nl/www.bonsai3d.nl, en slaat hij lokale previews,
  het oude github.io-adres, Do Not Track en Global Privacy Control over.
- De privacytekst beschrijft of meting is geconfigureerd of nog uitstaat.

## Cloudflare Web Analytics koppelen

1. Log in op https://dash.cloudflare.com/ of maak zelf je account aan.
2. Open Web Analytics, bijvoorbeeld via Analytics & Logs, en kies **Add a site**.
3. Vul `bonsai3d.nl` in, selecteer de ingevoerde hostname en bevestig.
4. Open **Manage site** en kopieer de JavaScript-snippet. De waarde achter
   `token` is de openbare meetcode, niet een Cloudflare API-token of wachtwoord.
5. Zet alleen deze meetcode in `assets/site-config.js` in plaats van `null`:

```javascript
window.BonsaiSiteConfig = Object.freeze({cloudflareToken: 'DE_ECHTE_SITE_MEETCODE'});
```

De voorbeeldtekst hierboven is geen werkende token; de loader accepteert alleen
de gebruikelijke hex/UUID-sitecodes. Deel de volledige echte snippet voor controle
als het formaat afwijkt. Plak niet nog een tweede beacon in de HTML: de loader
voegt één script toe aan alle zes inhoudspagina’s. Gebruik de handmatige
JavaScript-installatie; het domein hoeft niet als Cloudflare DNS-zone toegevoegd
te worden en de nameservers hoeven niet te veranderen.

6. Controleer de wijziging en publiceer na de afgesproken releasegoedkeuring.
7. Open de echte website. Controleer dat beacon.min.js laadt, dat Cloudflare
   meetverzoeken accepteert en dat het dashboard daarna gegevens toont. Test
   vanuit een browser zonder meetblokkering; schakel bezoekerskeuzes niet om.

Cloudflare toont paginaweergaven, bezoeken, verwijzende websites en
prestatiegegevens. Dit is geen exacte telling van unieke personen. Blokkeerders,
browserkeuzes en verlies van meetverzoeken veroorzaken verschillen; dezelfde
persoon kan meerdere bezoeken opleveren. De cookie-vrije meting probeert geen
personen over sessies heen te volgen. Meetgegevens beginnen pas na activering;
er is geen terugwerkende kracht. Productkeuzes in queryparameters en klikken op
e-mailknoppen zijn geen afzonderlijke custom events in deze inrichting.

## Google Search Console koppelen

1. Open https://search.google.com/search-console/ en log in met het Google-account
   waarin je de website wilt beheren.
2. Voeg een property toe van het type **Domein**: `bonsai3d.nl`, zonder https of www.
3. Google geeft een TXT-waarde `google-site-verification=...`.
4. Bij Mijn.host voeg je een extra DNS-record toe: **Naam leeg**, **Type TXT**,
   **Content de volledige echte Google-waarde**, **TTL 15 min**, prioriteit leeg.
   Laat GitHub-verificatie, SPF, DMARC, MX en alle andere bestaande TXT-records staan.
5. Kies bij Google Verifiëren zodra het record publiek zichtbaar is. Bewaar het
   record ook na verificatie. Een unieke waarde kan pas in jouw account worden
   gegenereerd en is daarom nog niet ingevuld.
6. Rond eerst de domeinkoppeling en HTTPS af. Publiceer daarna de voorbereide
   indexeerbare pagina’s. Controleer dat https://bonsai3d.nl/sitemap.xml bereikbaar
   is en dat de pagina’s geen noindex-meta of X-Robots-Tag-header meer hebben.
7. Open in Search Console **Sitemaps** en dien
   `https://bonsai3d.nl/sitemap.xml` in.
8. Gebruik **URL-inspectie** op https://bonsai3d.nl/ en vervolgens op de collectie.
   Bekijk de live test en de gerenderde HTML: de inhoud wordt door JavaScript
   opgebouwd. Controleer dat tekst, afbeeldingen en links zichtbaar zijn. Vraag
   pas daarna indexering aan voor deze hoofd-URL’s.
9. Bekijk later **Pagina-indexering** en **Prestaties / Zoekresultaten** voor
   opgenomen pagina’s, zoekopdrachten, vertoningen en klikken. Verificatie alleen
   is nog geen opname in Google en levert geen positiegarantie op.

Search Console toont Google-zoekverkeer, niet alle websitebezoekers. Er hoeft
geen Google Analytics-script of Tag Manager aan de website toegevoegd te worden
voor Search Console. GA4 is in deze voorbereiding niet geïnstalleerd.

## Release en controles

De publicatiekandidaat staat op branch `codex/domain-bonsai3d-20261025` in de
aparte publieke BONSAI3D-worktree. Dezelfde gerichte wijzigingen zijn ook in de
actieve private BONSAI3D-bron verwerkt, zonder PrintQueue of andere broncode mee
te kopiëren. De private bron heeft aanvullende bestaande functionaliteit;
publiceer daarom uitsluitend de gereviewde publieke kandidaat.

Deze SEO-uitbreiding volgt op de eerdere CNAME-voorbereiding. Gebruik bij de
uitgebreide release het nieuwste discovery-release.patch en de nieuwe
discovery-completion.json, niet alleen het eerdere domain-change.patch.
De eerdere baseline.json beschrijft de oude publieke site en is geen hashbewijs
voor de nieuwe SEO-bestanden.

Voer `npm run check` en `npm test` uit. De extra discovery-test controleert onder
andere canonical-URL’s, indexering, sitemap, NL/EN-metagegevens na renderen,
privacytekst en de gevallen waarin analytics wel of niet mag laden. De positieve
analytics-loader is gesimuleerd: er worden geen echte meetverzoeken met een
verzonnen token verstuurd. Dashboardontvangst blijft een controle na koppeling.

Na livegang: controleer de domein/HTTPS-voorwaarden uit LEESMIJ.md in het lokale
overdrachtspakket, voer verify-domain.py --after uit vanuit de nieuwste
publicatieworktree, en controleer robots.txt en sitemap.xml live. De verifier
vergelijkt de aangepaste hoofd-HTML/data/JS-bestanden met de nieuwste lokale
commit; de nieuwe discovery-bestanden en analyticsontvangst controleer je apart.

Indexeerbaarheid maakt de site vindbaar voor zoekmachines, maar garandeert geen
opname of hoge positie. Duidelijke eigen teksten, relevante afbeeldingen en
verwijzingen vanaf bijvoorbeeld je bonsaivereniging kunnen later helpen; schrijf
of publiceer die links alleen waar dat inhoudelijk past en met toestemming.

## Bronnen

- https://developers.cloudflare.com/web-analytics/get-started/
- https://developers.cloudflare.com/web-analytics/faq/
- https://www.cloudflare.com/web-analytics/
- https://support.google.com/webmasters/answer/34592
- https://support.google.com/webmasters/answer/9008080
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
