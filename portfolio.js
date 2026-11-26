const grid = document.getElementById('work-grid');
const filters = document.querySelector('.filters');
const filterButtons = [...filters.querySelectorAll('button')];
const cards = [...grid.querySelectorAll('[data-category]')];
const filterStatus = document.getElementById('filter-status');

filters.hidden = false;
filters.addEventListener('click', (event) => {
  const choice = event.target.closest('button[data-filter]');
  if (!choice) return;
  const category = choice.dataset.filter;
  grid.dataset.collection = category;
  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(choice === button));
  }
  for (const card of cards) {
    card.hidden = category !== 'all' && card.dataset.category !== category;
  }
  filterStatus.textContent = `顯示 ${cards.filter((card) => !card.hidden).length} 件作品`;
});

const player = document.querySelector('.player');
const video = document.getElementById('player-video');
const title = document.getElementById('player-title');
const duration = document.getElementById('player-duration');
const directLink = document.getElementById('player-link');
const videoError = document.getElementById('player-error');
const closeButton = player.querySelector('.close');
let trigger;

if (typeof player.showModal === 'function') {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-video]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    title.textContent = link.dataset.title;
    duration.textContent = link.dataset.duration;
    directLink.href = link.href;
    videoError.hidden = true;
    video.poster = `media/${link.dataset.video}.webp`;
    video.src = link.href;
    player.showModal();
    video.play().catch(() => {});
  });
}

video.addEventListener('error', () => {
  if (player.open) videoError.hidden = false;
});
closeButton.addEventListener('click', () => player.close());
player.addEventListener('click', (event) => {
  if (event.target !== player) return;
  const bounds = player.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) {
    player.close();
  }
});
player.addEventListener('close', () => {
  video.pause();
  video.removeAttribute('src');
  video.removeAttribute('poster');
  video.load();
  trigger?.focus({ preventScroll: true });
});
