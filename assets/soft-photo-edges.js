(function () {
  'use strict';
  var selector = '.home-gallery-image img, .home-category-card img, .product-art img, #product-main-image, .finish-story-image img, .tree-story figure img';
  var scheduled = false;
  function update(img) {
    if (!img.naturalWidth || !img.clientWidth || !img.clientHeight) return;
    var frame = img.parentElement;
    if (!frame.classList.contains('soft-photo-frame')) {
      frame = document.createElement('span');
      frame.className = 'soft-photo-frame';
      img.parentElement.insertBefore(frame, img);
      frame.appendChild(img);
      img.addEventListener('load', schedule);
    }
    frame.style.setProperty('--photo-backdrop', 'url(' + JSON.stringify(img.currentSrc || img.src) + ')');
    var width = img.clientWidth, height = img.clientHeight;
    var scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    var left = (width - img.naturalWidth * scale) / 2;
    var top = (height - img.naturalHeight * scale) / 2;
    img.style.setProperty('--edge-left', left + 'px');
    img.style.setProperty('--edge-right', (width - left) + 'px');
    img.style.setProperty('--edge-top', top + 'px');
    img.style.setProperty('--edge-bottom', (height - top) + 'px');
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      document.querySelectorAll(selector).forEach(update);
    });
  }
  new MutationObserver(function (mutations) {
    if (mutations.some(function (m) { return m.type === 'childList' || m.attributeName === 'src' || m.attributeName === 'hidden'; })) schedule();
  }).observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['src','hidden']});
  document.addEventListener('load', schedule, true);
  window.addEventListener('resize', schedule);
  schedule();
})();
