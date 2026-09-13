/**
 * JT HAIR & BEAUTY SALON — SCROLL ANIMATION ENGINE
 * Smooth 60fps/120fps Scroll-Driven Frame Scrubbing (194 frames)
 */

document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_FRAMES = 194;
  const FRAME_DIR = 'frames';
  const FRAME_PREFIX = 'ezgif-frame-';
  const FRAME_EXT = '.jpg';

  const scrollTrack = document.getElementById('scrollTrack') || document.querySelector('.scroll-anim-track');
  const canvas = document.getElementById('sequenceCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  const images = [];
  let targetFrame = 1;
  let currentFrame = 1;
  let renderedFrame = -1;
  let initialRenderDone = false;

  // Frame URL Helper
  function getFrameUrl(index) {
    const padded = String(index).padStart(3, '0');
    return `${FRAME_DIR}/${FRAME_PREFIX}${padded}${FRAME_EXT}`;
  }

  // High-DPI Canvas Resizing
  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const frameToRender = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrame)));
    if (images[frameToRender - 1]) {
      renderFrame(frameToRender);
    }
  }

  // Render Frame with Aspect-Ratio "Cover" centering
  function renderFrame(frameIndex) {
    const img = images[frameIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const canvasRatio = width / height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawWidth, drawHeight, dx, dy;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      dx = 0;
      dy = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      dx = (width - drawWidth) / 2;
      dy = 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    renderedFrame = frameIndex;
  }

  // Preload All 194 Frames in Background
  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);

      img.onload = () => {
        // Immediately render frame 1 as soon as available
        if (i === 1 && !initialRenderDone) {
          resizeCanvas();
          renderFrame(1);
          initialRenderDone = true;
        }
      };

      images.push(img);
    }
  }

  // Compute Scroll Progress specifically within the scrollTrack (0.0 to 1.0)
  function getScrollProgress() {
    if (!scrollTrack) return 0;
    const rect = scrollTrack.getBoundingClientRect();
    const trackScrollable = scrollTrack.offsetHeight - window.innerHeight;
    if (trackScrollable <= 0) return 0;

    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / trackScrollable));
  }

  // 60fps/120fps Animation Loop
  function animate() {
    const progress = getScrollProgress();
    targetFrame = 1 + progress * (TOTAL_FRAMES - 1);

    // Smooth momentum interpolation
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.001) {
      currentFrame += diff * 0.18;
    } else {
      currentFrame = targetFrame;
    }

    const frameToDraw = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrame)));
    if (frameToDraw !== renderedFrame) {
      renderFrame(frameToDraw);
    }

    requestAnimationFrame(animate);
  }

  // Header Scroll Effect
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // Event Listeners
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('orientationchange', resizeCanvas, { passive: true });

  // Start Engine
  preloadFrames();
  resizeCanvas();
  animate();
});
