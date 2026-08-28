document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const b=document.querySelector('[data-menu-button]'),n=document.querySelector('[data-nav]');if(b&&n){b.addEventListener('click',()=>{const open=n.classList.toggle('open');b.setAttribute('aria-expanded',open?'true':'false')})}

// Corporate page: place selected installation thumbnails above the introductory statement.
(() => {
  if (!/corporate\.html$/.test(location.pathname)) return;
  const thumbnails = document.querySelector('.legacy-corporate');
  const statement = document.querySelector('.corporate-statement');
  if (thumbnails && statement && statement.parentNode) {
    statement.parentNode.insertBefore(thumbnails, statement);
  }
})();

// Artworks lightbox
(() => {
  const box = document.getElementById('art-lightbox');
  if (!box) return;
  const image = document.getElementById('art-lightbox-image');
  const title = document.getElementById('art-lightbox-title');
  const closeButton = box.querySelector('.art-lightbox-close');
  let lastTrigger = null;

  const close = () => {
    box.hidden = true;
    box.setAttribute('aria-hidden', 'true');
    image.src = '';
    image.alt = '';
    document.body.classList.remove('lightbox-open');
    if (lastTrigger) lastTrigger.focus();
  };

  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      lastTrigger = trigger;
      const img = trigger.querySelector('img');
      image.src = trigger.dataset.full || img.src;
      image.alt = img.alt || trigger.dataset.title || 'Artwork';
      title.textContent = trigger.dataset.title || '';
      box.hidden = false;
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    });
  });

  box.querySelectorAll('[data-lightbox-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !box.hidden) close();
  });
})();
