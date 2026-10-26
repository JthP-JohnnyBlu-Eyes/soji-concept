document.addEventListener('click', (event) => {
  const menuButton = event.target.closest('[data-menu-toggle]');
  if (menuButton) {
    const menu = document.getElementById(menuButton.getAttribute('aria-controls'));
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', open);
    return;
  }

  const thumb = event.target.closest('[data-thumb]');
  if (thumb) {
    const gallery = thumb.closest('[data-gallery]');
    gallery.querySelectorAll('[data-slide]').forEach((slide) => {
      slide.hidden = slide.dataset.slide !== thumb.dataset.thumb;
    });
    gallery.querySelectorAll('[data-thumb]').forEach((button) => {
      button.classList.toggle('is-on', button === thumb);
    });
  }
});

// Filters and sorting on collection pages submit as soon as something changes.
document.addEventListener('change', (event) => {
  const form = event.target.closest('[data-auto-submit]');
  if (form) form.submit();
});

// Keep the product form's variant id in sync with the chosen options.
document.querySelectorAll('[data-product-form]').forEach((form) => {
  const data = form.querySelector('[data-variants]');
  if (!data) return;
  const variants = JSON.parse(data.textContent);
  const idInput = form.querySelector('input[name="id"]');
  const button = form.querySelector('[type="submit"]');

  form.addEventListener('change', () => {
    const chosen = [...form.querySelectorAll('[data-option]:checked')].map((input) => input.value);
    const variant = variants.find((v) => v.options.every((value, i) => value === chosen[i]));
    if (!variant) return;
    idInput.value = variant.id;
    button.disabled = !variant.available;
    button.textContent = variant.available ? button.dataset.labelAdd : button.dataset.labelSoldOut;
  });
});

// Pause videos that are hidden when switching gallery slides.
document.addEventListener('click', (event) => {
  const thumb = event.target.closest('[data-thumb]');
  if (!thumb) return;
  thumb.closest('[data-gallery]').querySelectorAll('[data-slide]').forEach((slide) => {
    const video = slide.querySelector('video');
    if (!video) return;
    if (slide.hidden) video.pause();
    else video.play().catch(() => {});
  });
});
