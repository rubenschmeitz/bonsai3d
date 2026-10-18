(function () {
  'use strict';
  var dialog, photos, index, scale, title, onChange, returnFocus, x = 0, y = 0;
  var pointers = new Map(), gesture, stage, photo;
  function tr(nl, en) { return document.documentElement.lang === 'en' ? en : nl; }
  function button(action, label, text) {
    var node = document.createElement('button');
    node.type = 'button'; node.dataset.viewerAction = action;
    node.setAttribute('aria-label', label); node.title = label; node.textContent = text;
    return node;
  }
  function transform() {
    var bounds = stage.getBoundingClientRect();
    var maxX = Math.max(0, (photo.clientWidth * scale - bounds.width) / 2);
    var maxY = Math.max(0, (photo.clientHeight * scale - bounds.height) / 2);
    x = Math.max(-maxX, Math.min(maxX, x)); y = Math.max(-maxY, Math.min(maxY, y));
    photo.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
    stage.classList.toggle('is-zoomed', scale > 1);
    dialog.querySelector('[data-viewer-action="out"]').disabled = scale <= 1;
    dialog.querySelector('[data-viewer-action="in"]').disabled = scale >= 4;
    dialog.querySelector('[data-viewer-action="fit"]').textContent = Math.round(scale * 100) + '%';
  }
  function zoom(value) { scale = Math.max(1, Math.min(4, value)); if (scale === 1) x = y = 0; transform(); }
  function show(value, notify) {
    index = (value + photos.length) % photos.length; scale = 1; x = y = 0;
    pointers.clear(); gesture = null;
    photo.src = photos[index].src; photo.alt = photos[index].alt || title;
    dialog.querySelector('.photo-viewer-count').textContent = (index + 1) + ' / ' + photos.length;
    dialog.querySelectorAll('[data-viewer-step]').forEach(function (node) { node.hidden = photos.length < 2; });
    transform(); if (notify && onChange) onChange(index);
  }
  function cleanup() {
    if (dialog.open) return;
    document.documentElement.classList.remove('photo-viewer-open');
    pointers.clear(); gesture = null;
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
  }
  function close() { dialog.close(); cleanup(); }
  function ensure() {
    if (dialog) return;
    dialog = document.createElement('dialog'); dialog.id = 'photo-viewer';
    dialog.className = 'photo-viewer'; document.body.appendChild(dialog);
    dialog.addEventListener('close', cleanup);
    dialog.addEventListener('cancel', function (event) { event.preventDefault(); close(); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1), true);
      } else if (['+', '=', '-', '0'].includes(event.key)) {
        event.preventDefault(); zoom(event.key === '0' ? 1 : scale * (event.key === '-' ? 1 / 1.5 : 1.5));
      }
    });
    window.addEventListener('resize', function () { if (dialog.open) transform(); });
  }
  function distance() {
    var p = Array.from(pointers.values()); return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
  }
  function open(options) {
    if (!options.photos || !options.photos.length) return;
    ensure(); if (dialog.open) dialog.close();
    photos = options.photos; title = options.title || tr('Foto vergroten', 'Enlarge photograph');
    onChange = options.onChange; returnFocus = document.activeElement;
    dialog.setAttribute('aria-label', title);
    dialog.replaceChildren();
    var toolbar = document.createElement('div'); toolbar.className = 'photo-viewer-toolbar';
    var count = document.createElement('span'); count.className = 'photo-viewer-count'; count.setAttribute('role', 'status'); count.setAttribute('aria-live', 'polite');
    toolbar.append(count, button('out', tr('Uitzoomen', 'Zoom out'), '−'), button('fit', tr('Passend maken', 'Fit photograph'), '100%'), button('in', tr('Inzoomen', 'Zoom in'), '+'), button('close', tr('Sluiten', 'Close'), '×'));
    stage = document.createElement('div'); stage.className = 'photo-viewer-stage';
    photo = document.createElement('img'); photo.draggable = false; photo.onload = transform;
    stage.appendChild(photo); dialog.append(toolbar, stage);
    [-1, 1].forEach(function (step) {
      var node = button('step', step < 0 ? tr('Vorige foto', 'Previous photograph') : tr('Volgende foto', 'Next photograph'), step < 0 ? '←' : '→');
      node.dataset.viewerStep = step; node.className = 'photo-viewer-step ' + (step < 0 ? 'previous' : 'next');
      node.onclick = function () { show(index + step, true); }; dialog.appendChild(node);
    });
    toolbar.querySelector('[data-viewer-action="close"]').onclick = close;
    toolbar.querySelector('[data-viewer-action="out"]').onclick = function () { zoom(scale / 1.5); };
    toolbar.querySelector('[data-viewer-action="in"]').onclick = function () { zoom(scale * 1.5); };
    toolbar.querySelector('[data-viewer-action="fit"]').onclick = function () { zoom(1); };
    stage.ondblclick = function () { zoom(scale > 1 ? 1 : 2); };
    stage.onpointerdown = function (event) {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      stage.setPointerCapture(event.pointerId); pointers.set(event.pointerId, {x:event.clientX, y:event.clientY});
      gesture = pointers.size === 2 ? {distance:distance(), scale:scale} : {startX:event.clientX, startY:event.clientY, x:x, y:y};
    };
    stage.onpointermove = function (event) {
      if (!pointers.has(event.pointerId) || !gesture) return;
      pointers.set(event.pointerId, {x:event.clientX, y:event.clientY});
      if (pointers.size === 2 && gesture.distance) zoom(gesture.scale * distance() / Math.max(1, gesture.distance));
      else if (pointers.size === 1 && gesture.startX !== undefined && scale > 1) {
        x = gesture.x + event.clientX - gesture.startX; y = gesture.y + event.clientY - gesture.startY; transform();
      }
    };
    stage.onpointerup = function (event) {
      if (pointers.size === 1 && scale === 1 && gesture && gesture.startX !== undefined) {
        var dx = event.clientX - gesture.startX, dy = event.clientY - gesture.startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1), true);
      }
      pointers.delete(event.pointerId); gesture = null;
    };
    stage.onpointercancel = function (event) { pointers.delete(event.pointerId); gesture = null; };
    show(options.index || 0, false); dialog.showModal();
    document.documentElement.classList.add('photo-viewer-open');
    toolbar.querySelector('[data-viewer-action="close"]').focus();
  }
  function bind() {
    var home = document.querySelector('.home-gallery');
    if (home) {
      var buttons = Array.from(home.querySelectorAll('.home-gallery-image'));
      buttons.forEach(function (node, i) {
        node.setAttribute('aria-label', tr('Foto vergroten: ', 'Enlarge photograph: ') + node.querySelector('img').alt);
        node.onclick = function () { open({photos:buttons.map(function (b) { var img = b.querySelector('img'); return {src:img.src, alt:img.alt}; }), index:i}); };
      });
    }
    document.querySelectorAll('main img').forEach(function (img) {
      if (img.closest('button, a, .product, .home-gallery') || !/\.(webp|png|jpe?g)(\?|$)/i.test(img.src)) return;
      var node = document.createElement('button'); node.type = 'button'; node.className = 'editorial-photo-enlarge';
      node.setAttribute('aria-label', tr('Foto vergroten: ', 'Enlarge photograph: ') + img.alt);
      img.parentNode.insertBefore(node, img); node.appendChild(img);
      node.onclick = function () { open({photos:[{src:img.src, alt:img.alt}]}); };
    });
  }
  window.BonsaiPhotoViewer = {open:open, bind:bind};
})();
