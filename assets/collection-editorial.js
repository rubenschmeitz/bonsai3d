(function () {
  'use strict';
  window.BonsaiEditorial = {
    home: function (api) {
      var tr=api.tr,esc=api.esc,shop=api.shop,image=api.image;
      var hero = '<section class="editorial-hero wrap" aria-labelledby="hero-title">' +
        '<figure class="hero-tree"><img src="' + image(shop.heroPhoto.image) + '" alt="' + esc(api.t(shop.heroPhoto.alt)) + '" width="1280" height="960" fetchpriority="high"><figcaption>' + tr('BLOEI / GEGENEREERDE TENTOONSTELLINGSSETTING', 'FLOWERS / GENERATED EXHIBITION SETTING') + '</figcaption></figure>' +
        '<div class="editorial-hero-copy"><p class="eyebrow">BONSAI3D / ' + tr('PRESENTATIE', 'DISPLAY') + '</p><h1 id="hero-title">' + tr('De boom.<br>De vorm.<br>Het geheel.', 'The tree.<br>The form.<br>The whole.') + '</h1><p>' + tr('Tafels, schalen en kleine accenten. Geprint en afgewerkt rond jouw bonsai.', 'Stands, pots and small accents. Printed and finished around your bonsai.') + '</p><a class="text-link" href="' + api.pageUrl('collection') + '">' + tr('Ontdek de collectie', 'Explore the collection') + ' <span aria-hidden="true">↗</span></a></div></section>';

      var groups = [
        {category:'display',product:'bonsai-classic-table',nl:'Tafels & jita’s',en:'Stands & jitas',copyNl:'Een basis voor jouw opstelling.',copyEn:'A foundation for your display.'},
        {category:'pots',product:'bonsai-firethorn-pot',nl:'Schalen',en:'Pots',copyNl:'Een eigen vorm rond de boom.',copyEn:'A distinctive form around the tree.'},
        {category:'miniatures',product:'bonsai-mini-walker-dog',nl:'Figuren',en:'Figures',copyNl:'Een klein accent naast de bonsai.',copyEn:'A small accent beside your bonsai.'}
      ];
      return hero + '<section class="home-collection wrap" aria-labelledby="browse-title"><div class="section-heading"><h2 id="browse-title">' + tr('Rond de bonsai.', 'Around the bonsai.') + '</h2>' + api.link('collection',tr('Bekijk alles','View all objects')+' ↗','text-link') + '</div><div class="category-grid">' + groups.map(function (group) {
        var p=shop.products.find(function(item){return item.id===group.product;}),photo=api.finishImage(p,api.style);
        var content='<figure><img src="'+image(photo.image)+'" alt="'+esc(api.t(photo.alt))+'" width="1254" height="1254" loading="lazy"><figcaption>'+api.imageLabel(photo)+'</figcaption></figure><div class="category-copy"><h3>'+tr(group.nl,group.en)+'</h3><span aria-hidden="true">↗</span><p>'+tr(group.copyNl,group.copyEn)+'</p></div>';
        return api.link('collection',content,'category-card',{category:group.category});
      }).join('')+'</div></section>' +
      '<section class="home-next wrap" aria-label="'+tr('Afwerking en maatwerk','Finishes and custom work')+'"><p>'+tr('Houtlook of matzwart. Afgestemd op jouw opstelling.','Wood look or matte black. Made to suit your display.')+'</p><div>'+api.link('examples',tr('Bekijk voorbeeldopstellingen','See display examples')+' ↗','text-link')+api.link('finishes',tr('Kies je afwerking','Choose your finish')+' ↗','text-link')+api.link('atelier',tr('Over Ruben & maatwerk','About Ruben & custom work')+' ↗','text-link')+'</div></section>';
    },
    examples: function (api) {
      var tr=api.tr, image=api.image;
      var examples=[
        {
                "id": "maple-wood",
                "nl": "Een luchtige esdoorn.",
                "en": "An airy maple.",
                "copyNl": "Een open kroon boven de lage houtlook tafel. Het kleine roodborstje kijkt naar de boom; de lege ruimte ertussen houdt de opstelling rustig.",
                "copyEn": "An open crown above the low wood-look stand. The little robin looks towards the tree; the empty space between them keeps the display calm.",
                "altNl": "Gegenereerde esdoorn in de bestaande grijze takkenpot op Rubens houtlook tafel, met een klein matzwart roodborstje als accent",
                "altEn": "Generated maple in the existing grey branch pot on Ruben’s wood-look stand, with a small matte-black robin accent",
                "product": "bonsai-classic-table",
                "finish": "wood",
                "linkNl": "Bekijk de displaytafel",
                "linkEn": "View the low display stand",
                "figure": "bonsai-mini-robin",
                "figureNl": "Bekijk het roodborstje",
                "figureEn": "View the robin",
                "image": "exhibition/maple-wood-dutch-v3.webp"
        },
        {
                "id": "juniper-wood",
                "nl": "Beweging & houtlook.",
                "en": "Movement & wood look.",
                "copyNl": "Een halfcascade met ruimte aan de kant waar de takken naartoe groeien. De ronde wortelstandaard geeft hoogte; zonder extra figuur blijven de lijnen leesbaar.",
                "copyEn": "A semi-cascade with space in the direction of its branches. The round root stand adds height; the lines remain clear without an extra figure.",
                "altNl": "Gegenereerde halfcascadejeneverbes in een bruine pot op de ronde houtlook wortelstandaard, zonder figuur en met lege ruimte naast de takken",
                "altEn": "Generated semi-cascade juniper in a brown pot on the round wood-look root stand, with no figure and open space beside the branches",
                "product": "bonsai-root-pedestal",
                "finish": "wood",
                "linkNl": "Bekijk de wortelstandaard",
                "linkEn": "View the round root stand",
                "image": "exhibition/juniper-wood-v2.webp"
        },
        {
                "id": "pine-black",
                "nl": "Den, ruimte & matzwart.",
                "en": "Pine, space & matte black.",
                "copyNl": "Een asymmetrische den op de lage zwarte tafel. Een kleine egel staat los van het onderstel en keert zijn neus naar de boom.",
                "copyEn": "An asymmetrical pine on the low black stand. A little hedgehog sits apart from the support, its nose turned towards the tree.",
                "altNl": "Gegenereerde den in de bestaande grijze takkenpot op Rubens matzwarte tafel, met een kleine zwarte egel als accent",
                "altEn": "Generated pine in the existing grey branch pot on Ruben’s matte-black stand, with a small black hedgehog accent",
                "product": "bonsai-classic-table",
                "finish": "black",
                "linkNl": "Bekijk de displaytafel",
                "linkEn": "View the low display stand",
                "figure": "bonsai-mini-hedgehog",
                "figureNl": "Bekijk de egel",
                "figureEn": "View the hedgehog",
                "image": "exhibition/pine-black-dutch-v3.webp"
        },
        {
                "id": "cascade-refined-black",
                "nl": "Een vrije cascade.",
                "en": "A free cascade.",
                "copyNl": "De neerhangende takken krijgen ruimte naast het open onderstel. De rode pot vormt het kleuraccent; de boom en de zwarte standaard dragen samen de opstelling.",
                "copyEn": "The descending branches have room beside the open support. The red pot provides the colour accent; the tree and black stand form the display together.",
                "altNl": "Gegenereerde cascadejeneverbes in de ongewijzigde rode takkenpot op de matzwarte open wortelstandaard, zonder figuren",
                "altEn": "Generated cascade juniper in the unchanged red branch pot on the matte-black open root stand, with no figures",
                "product": "bonsai-open-root-pedestal",
                "finish": "black",
                "linkNl": "Bekijk de open wortelstandaard",
                "linkEn": "View the open root stand",
                "image": "exhibition/cascade-refined-black-v2.webp"
        }
];
      return '<section class="examples wrap" aria-labelledby="examples-title"><div class="section-heading"><div><p class="eyebrow">BONSAI3D / '+tr('VOORBEELDOPSTELLINGEN','DISPLAY EXAMPLES')+'</p><h1 class="page-title" id="examples-title">'+tr('Ideeën voor<br>jouw opstelling.','Ideas for<br>your display.')+'</h1></div><p>'+tr('Vier opstellingen waarin de boom de richting bepaalt. Een passende tafel, voldoende ruimte en soms één klein accent. In houtlook en matzwart.','Four displays shaped by the direction of the tree. A suitable stand, room to breathe and sometimes one small accent. In wood look and matte black.')+'</p></div><div class="example-stories">'+examples.map(function (example,i) {
        return '<article class="display-example" id="'+example.id+'" data-example="'+example.id+'"><figure><img src="'+image(example.image)+'" alt="'+tr(example.altNl,example.altEn)+'" width="1536" height="1024" loading="'+(i===0?'eager':'lazy')+'"><figcaption>'+tr('Gegenereerde tentoonstellingsstudie met BONSAI3D-ontwerpen. Boom en styling zijn voorbeelden.','Generated exhibition study with BONSAI3D designs. Tree and styling are examples.')+'</figcaption></figure><div class="example-copy"><p class="eyebrow">0'+(i+1)+' / '+tr(example.finish==='wood'?'HOUTLOOK':'MATZWART',example.finish==='wood'?'WOOD LOOK':'MATTE BLACK')+'</p><h2>'+tr(example.nl,example.en)+'</h2><p>'+tr(example.copyNl,example.copyEn)+'</p><button class="text-link" data-product="'+example.product+'" data-finish="'+example.finish+'">'+tr(example.linkNl,example.linkEn)+' ↗</button>'+(example.figure?'<button class="text-link example-figure-link" data-product="'+example.figure+'" data-finish="'+example.finish+'">'+tr(example.figureNl,example.figureEn)+' ↗</button>':'')+'</div></article>';
      }).join('')+'</div><div class="examples-note"><p>'+tr('De beelden zijn bedoeld als inspiratie. De bomen en styling zijn presentatievoorbeelden; maat, afwerking en uitvoering bespreken we per aanvraag.','These images are for inspiration. Trees and styling are display examples; size, finish and final version are discussed for each enquiry.')+'</p><a class="text-link" href="'+api.pageUrl('atelier')+'#display">'+tr('Bekijk ook een eigen opstelling','See one of my own displays')+' ↗</a></div></section>';
    },
    finishes: function (api) {
      var tr=api.tr,esc=api.esc,shop=api.shop,image=api.image;
      return '<section class="finish-section wrap" id="finishes" aria-labelledby="finish-title"><div class="section-heading"><div><p class="eyebrow">' + tr('TWEE AFWERKINGEN', 'TWO FINISHES') + '</p><h1 class="page-title" id="finish-title">' + tr('Dezelfde vorm.<br>Een ander karakter.', 'The same form.<br>A different character.') + '</h1></div><p>' + tr('Houtlook en matzwart voor tafels, jita’s en figuren. Combineer ze in één afwerking of kies per stuk. De potten houden hun eigen uitstraling.', 'Wood look and matte black for stands, jitas and figures. Combine them in one finish or choose for each piece. Pots keep their own look.') + '</p></div><div class="finish-story-grid">' +
        ['wood', 'black'].map(function (finish, i) {
          var p = shop.products[0], photo = p.finishes[finish];
          return '<article class="finish-story"><button class="finish-story-image" type="button" data-browse-style="' + finish + '" aria-label="' + tr('Bekijk de collectie in ', 'Explore the collection in ') + (finish === 'wood' ? tr('houtlook', 'wood look') : tr('matzwart', 'matte black')) + '"><img src="' + image(photo.image) + '" alt="' + esc(api.t(photo.alt)) + '" width="1254" height="1254" loading="lazy"></button><div class="finish-story-copy"><div><p class="eyebrow">0' + (i + 1) + ' / ' + tr('AFWERKING', 'FINISH') + '</p><h3>' + (finish === 'wood' ? tr('Houtlook', 'Wood look') : tr('Matzwart', 'Matte black')) + '</h3></div><p>' + (finish === 'wood' ? tr('Warm bruin, met diepte in de structuur. De uitstraling van mijn eigen gemaakte tafels.', 'Warm brown, with depth in the texture. The look of my own existing stands.') : tr('Een rustige, donkere afwerking. De vorm blijft zichtbaar en het groen krijgt de ruimte.', 'A quiet, dark finish. The form stays visible and the foliage has room.')) + '</p></div><button class="text-link" type="button" data-browse-style="' + finish + '">' + tr('Bekijk deze afwerking', 'Explore this finish') + ' ↗</button></article>';
        }).join('') + '<p class="finish-disclosure">' + tr('De tafels en figuren zijn 3D-geprint. Houtlook beschrijft de afwerking. Nieuwe kleurvarianten zijn beeldvoorstellen; de oorspronkelijke prints staan in de productgalerijen.', 'Stands and figures are 3D printed. Wood look describes the finish. New colour variants are visual proposals; original prints are shown in the product galleries.') + '</p></div></section>';
    },
    atelier: function (api) {
      var tr=api.tr,esc=api.esc,t=api.t,shop=api.shop,image=api.image;
      return '<section class="studio wrap" id="studio"><figure class="studio-art"><img src="' + image(shop.storyImage) + '" alt="' + tr('Rubens oorspronkelijke foto van de geprinte houtlook displaytafel in de werkplaats', 'Ruben’s original photograph of the printed wood-look display table in the workshop') + '" width="1280" height="960" loading="lazy"><figcaption>' + tr('UIT DE WERKPLAATS / EIGEN FOTO', 'FROM THE WORKSHOP / OWN PHOTOGRAPH') + '</figcaption></figure><div class="studio-copy"><p class="eyebrow">' + tr('GEMAAKT DOOR RUBEN', 'MADE BY RUBEN') + '</p><h1 class="page-title">' + tr('Van print<br>tot presentatie.', 'From print<br>to display.') + '</h1><p>' + tr('Ik maak bonsai-accessoires met 3D-printtechniek en werk ze af in een stijl die bij de opstelling past. Deze collectie begint bij de tafels en objecten die ik zelf al heb gemaakt.', 'I make bonsai accessories with 3D printing and finish them in a style that suits the arrangement. This collection starts with the stands and objects I have already made myself.') + '</p><p>' + tr('Een andere maat, meer hoogte of een eigen kleur? Vertel me hoe je de boom wilt presenteren.', 'A different size, more height or a colour of your own? Tell me how you want to present the tree.') + '</p><button class="text-link" data-open-inquiry>' + tr('Bespreek jouw opstelling', 'Discuss your display') + ' ↗</button></div></section>' +
        '<section class="custom-section" id="custom"><div class="custom-inner wrap"><div><p class="eyebrow">' + tr('OP MAAT', 'MADE TO FIT') + '</p><h2>' + tr('Jouw boom.<br>Jouw opstelling.', 'Your tree.<br>Your display.') + '</h2></div><div class="custom-copy"><p>' + tr('Kies de objecten en de afwerking die je aanspreken. Voeg de maten van je pot en je wensen toe. We stemmen de uitvoering samen af.', 'Choose the objects and finish you like. Add your pot’s dimensions and your preferences. We agree the final version together.') + '</p><button class="button primary" data-open-inquiry>' + tr('Maak een aanvraag', 'Prepare an enquiry') + ' ↗</button></div></div></section>' +
        '<section class="tree-story" id="display"><div class="tree-story-inner wrap"><figure><img src="' + image('prints/natural/root-pedestal-arrangement-natural-v1.webp') + '" alt="' + tr('Echte cascadebonsai op Rubens ronde wortelstandaard', 'Real cascade bonsai on Ruben’s round root stand') + '" width="960" height="1280" loading="lazy"><figcaption>' + tr('EIGEN FOTO / CASCADE & WORTELSTANDAARD', 'OWN PHOTOGRAPH / CASCADE & ROOT STAND') + '</figcaption></figure><div><p class="eyebrow">' + tr('ROND DE BOOM', 'AROUND THE TREE') + '</p><h2>' + tr('De boom<br>komt eerst.', 'The tree<br>comes first.') + '</h2><p>' + tr('Een hoge standaard geeft een cascade de ruimte. Een lage tafel houdt een compacte opstelling dicht bij de grond. Kies de hoogte en het draagvlak vanuit je boom en je pot.', 'A tall stand gives a cascade space. A low table keeps a compact arrangement close to the ground. Choose the height and support area around your tree and pot.') + '</p><button class="text-link" data-product="bonsai-root-pedestal">' + tr('Bekijk de wortelstandaard', 'Explore the root stand') + ' ↗</button><p class="photo-note">' + tr('Deze boom is echt. De eigen foto is licht gecorrigeerd; boom en pot zijn presentatievoorbeelden.', 'This is a real tree. The own photograph is lightly corrected; the tree and pot are display examples.') + '</p></div></div></section>' +
        '<section class="guide wrap" id="guide"><div><p class="eyebrow">' + tr('GOED OM TE WETEN', 'GOOD TO KNOW') + '</p><h2>' + tr('Over de uitvoering.', 'About the final piece.') + '</h2></div><div class="faqs">' + shop.faqs.map(function (f) { return '<details><summary>' + esc(t(f.q)) + '<span aria-hidden="true">+</span></summary><p>' + esc(t(f.a)) + '</p></details>'; }).join('') + '</div></section>';
    }
  };
})();
