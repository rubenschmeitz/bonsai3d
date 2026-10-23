(function () {
  'use strict';
  window.BonsaiHomeGallery = {bind: function () {
    var gallery = document.querySelector('.home-gallery');
    if (!gallery) return;
    var slides = Array.from(gallery.querySelectorAll('[data-home-slide]'));
    var buttons = Array.from(gallery.querySelectorAll('[data-home-photo]'));
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) { slide.hidden = i !== current; });
      buttons.forEach(function (button, i) { button.setAttribute('aria-pressed', String(i === current)); });
      gallery.querySelector('.home-gallery-position').textContent=(current+1)+' / '+slides.length;
      gallery.querySelector('[data-home-status]').textContent=slides[current].querySelector('button').getAttribute('aria-label');
    }
    buttons.forEach(function (button, i) { button.onclick = function () { show(i); }; });
    gallery.querySelectorAll('[data-home-step]').forEach(function (button) {
      button.onclick = function () { show(current + Number(button.dataset.homeStep)); };
    });
    gallery.onkeydown = function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
  }};
})();
