
(function(){
  if (window.location.protocol === 'file:') return;

  function esc(s){
    return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  fetch('content/site.json', {cache:'no-store'})
    .then(r => {
      if (!r.ok) throw new Error('Content file not found');
      return r.json();
    })
    .then(data => {
      const path = location.pathname.split('/').pop() || 'index.html';

      if (path === '' || path === 'index.html') {
        const h = data.home || {};
        const eyebrow = document.querySelector('.hero-copy .eyebrow');
        const name = document.querySelector('.hero-copy h1');
        const studio = document.querySelector('.hero-copy .intro strong');
        const portrait = document.querySelector('.home-portrait-figure img');
        const review = document.querySelector('.home-review-inner');
        if (eyebrow) eyebrow.textContent = h.eyebrow || '';
        if (name && h.name) {
          const parts = h.name.trim().split(/\s+/);
          const first = parts.shift() || '';
          const rest = parts.join(' ');
          name.innerHTML = esc(first) + (rest ? '<br><em>' + esc(rest) + '</em>' : '');
        }
        if (studio) studio.textContent = h.studio_line || '';
        if (portrait && h.portrait) portrait.src = h.portrait;
        if (review) {
          review.innerHTML =
            '<p class="eyebrow">' + esc(h.critical_eyebrow || '') + '</p>' +
            '<h2>' + esc(h.critical_title || '') + '</h2>' +
            (h.critical_paragraphs || []).map(p => '<p>' + esc(typeof p === 'string' ? p : p.value) + '</p>').join('');
        }
      }

      if (path === 'contact.html') {
        const c = data.contact || {};
        const hero = document.querySelector('.page-hero');
        if (hero) {
          hero.innerHTML =
            '<p class="eyebrow">Contact</p>' +
            '<h1>' + esc(c.page_title || '') + '</h1>' +
            '<p>' + esc(c.intro || '') + '</p>' +
            '<div class="studio-contact-inline">' +
            '<p><strong>' + esc(c.name || '') + '</strong></p>' +
            '<p><a href="mailto:' + esc(c.email || '') + '">' + esc(c.email || '') + '</a></p>' +
            '<p><a href="tel:' + esc(c.phone_link || '') + '">' + esc(c.phone_display || '') + '</a></p>' +
            '</div>';
        }
      }

      if (path === 'available.html') {
        const a = data.available || {};
        const title = document.querySelector('.page-hero h1');
        const gallery = document.querySelector('.available-gallery');
        if (title) title.textContent = a.page_title || 'Available';
        if (gallery) {
          gallery.innerHTML = (a.works || []).map(w =>
            '<article class="work-card">' +
              '<div class="art-image"><img src="' + esc(w.image) + '" alt="' + esc(w.title) + '"></div>' +
              '<div class="meta"><h3>' + esc(w.title) + '</h3>' +
              '<p>' + esc(w.details || '') + '</p>' +
              '<p>' + esc(w.medium || '') + '</p></div>' +
            '</article>'
          ).join('');
        }
      }

      if (path === 'artworks.html') {
        const a = data.artworks || {};
        const title = document.querySelector('.page-hero h1');
        const intro = document.querySelector('.page-hero p:last-child');
        const gallery = document.querySelector('.artworks-gallery');
        if (title) title.textContent = a.page_title || 'Artworks';
        if (intro) intro.textContent = a.intro || '';
        if (gallery) {
          gallery.innerHTML = (a.works || []).map(w =>
            '<article class="artwork-thumb"><a class="thumb-link" href="' + esc(w.view) + '" aria-label="View ' + esc(w.title) + ' larger">' +
            '<span class="thumb-frame"><img src="' + esc(w.thumb) + '" alt="' + esc(w.title) + ', tapestry by Susan Klebanoff"></span>' +
            '<h3>' + esc(w.title) + '</h3></a></article>'
          ).join('');
        }
      }

      if (path === 'corporate.html') {
        const style = document.createElement('style');
        style.textContent = `
          .corporate-installation-gallery.corporate-thumbnails{
            display:grid!important;
            grid-template-columns:repeat(4,minmax(140px,1fr))!important;
            gap:4rem 2.5rem!important;
            max-width:1000px!important;
            margin:2rem auto 0!important;
            align-items:start!important;
          }
          .corporate-installation-gallery.corporate-thumbnails .corporate-thumb{
            display:block!important;
            width:100%!important;
            max-width:210px!important;
            margin:0 auto!important;
          }
          .corporate-installation-gallery.corporate-thumbnails .corporate-thumb-frame{
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            width:100%!important;
            height:220px!important;
            padding:.65rem!important;
            border:1px solid var(--line)!important;
            background:#f3f0eb!important;
            overflow:hidden!important;
            box-sizing:border-box!important;
          }
          .corporate-installation-gallery.corporate-thumbnails .corporate-thumb-frame img{
            display:block!important;
            width:100%!important;
            height:100%!important;
            object-fit:contain!important;
          }
          .corporate-installation-gallery.corporate-thumbnails .corporate-thumb h3{
            font:400 1rem/1.25 Georgia,serif!important;
            text-align:center!important;
            margin:.7rem 0 0!important;
          }
          @media(max-width:850px){
            .corporate-installation-gallery.corporate-thumbnails{
              grid-template-columns:repeat(3,minmax(130px,1fr))!important;
              gap:3.5rem 2rem!important;
            }
          }
          @media(max-width:650px){
            .corporate-installation-gallery.corporate-thumbnails{
              grid-template-columns:repeat(2,minmax(120px,1fr))!important;
              gap:3rem 1.5rem!important;
            }
            .corporate-installation-gallery.corporate-thumbnails .corporate-thumb-frame{
              height:190px!important;
            }
          }
          @media(max-width:390px){
            .corporate-installation-gallery.corporate-thumbnails{
              grid-template-columns:1fr!important;
            }
            .corporate-installation-gallery.corporate-thumbnails .corporate-thumb{
              max-width:200px!important;
            }
            .corporate-installation-gallery.corporate-thumbnails .corporate-thumb-frame{
              height:210px!important;
            }
          }
        `;
        document.head.appendChild(style);

        const c = data.corporate || {};
        const pageTitle = document.querySelector('.corporate-hero h1, .page-hero h1');
        if (pageTitle) pageTitle.textContent = c.page_title || 'Corporate Installations';
        const sectionTitle = Array.from(document.querySelectorAll('h2,.section-title')).find(el => /select installations|installation titles/i.test(el.textContent));
        if (sectionTitle) sectionTitle.textContent = c.gallery_title || 'Select Installations';
        const gallery = document.querySelector('.corporate-installation-gallery');
        if (gallery) {
          gallery.innerHTML = (c.installations || []).map(w =>
            '<article class="corporate-thumb"><a class="corporate-thumb-link" href="' + esc(w.view) + '" aria-label="View ' + esc(w.title) + ' larger">' +
            '<span class="corporate-thumb-frame"><img src="' + esc(w.thumb) + '" alt="' + esc(w.title) + ', installation by Susan Klebanoff"></span>' +
            '<h3>' + esc(w.title) + '</h3></a></article>'
          ).join('');
        }
      }

      if (path === 'video.html') {
        const v = data.videos || {};
        const title = document.querySelector('.page-intro h1');
        const corp = document.getElementById('corporate-video-title');
        const light = document.getElementById('featured-video-title');
        if (title) title.textContent = v.page_title || 'Videos';
        if (corp) corp.textContent = v.corporate_title || '';
        if (light) light.textContent = v.light_title || '';
      }
    })
    .catch(err => console.warn('Editable content could not be loaded:', err));
})();
