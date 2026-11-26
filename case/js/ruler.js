const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

for (const target of document.querySelectorAll('.ruler-target')) {
  const fullPage = target === document.body;
  const overlay = document.createElement('span');
  const horizontal = document.createElement('span');
  const vertical = document.createElement('span');
  overlay.className = fullPage ? 'case-ruler case-ruler--viewport' : 'case-ruler';
  overlay.setAttribute('aria-hidden', 'true');
  horizontal.className = 'ruler-line horizontal';
  vertical.className = 'ruler-line vertical';
  overlay.append(horizontal, vertical);
  target.append(overlay);

  let nextX;
  let nextY;
  let x;
  let y;
  let frame = 0;
  let hideTimer;

  function hideLines() {
    horizontal.style.opacity = '0';
    vertical.style.opacity = '0';
    clearTimeout(hideTimer);
    cancelAnimationFrame(frame);
    frame = 0;
    x = undefined;
  }

  function followPointer() {
    const easing = reducedMotion.matches ? 1 : .18;
    x += (nextX - x) * easing;
    y += (nextY - y) * easing;
    horizontal.style.top = `${y}px`;
    vertical.style.left = `${x}px`;
    frame = Math.abs(nextX - x) + Math.abs(nextY - y) > .4
      ? requestAnimationFrame(followPointer) : 0;
  }

  function showLines(event) {
    if (event.pointerType === 'touch') return;
    if (fullPage && event.target.closest('a, button, .case-disclosure, .ruler-target:not(body)')) {
      hideLines();
      return;
    }
    const box = overlay.getBoundingClientRect();
    nextX = event.clientX - box.left;
    nextY = event.clientY - box.top;
    if (x === undefined) {
      x = nextX;
      y = nextY;
    }
    horizontal.style.opacity = '1';
    vertical.style.opacity = '1';
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideLines, 2000);
    if (!frame) followPointer();
  }

  target.addEventListener('pointerenter', showLines);
  target.addEventListener('pointermove', showLines);
  target.addEventListener('pointerleave', hideLines);
  target.addEventListener('pointercancel', hideLines);
  window.addEventListener('blur', hideLines);
  if (fullPage) window.addEventListener('scroll', hideLines, { passive: true });
}
