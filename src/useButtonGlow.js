import { useEffect } from 'react';

const GLOW_SELECTOR = [
  '.mpp-btn',
  '.mpp-nav-link',
  '.mpp-nav-mobile-link',
  '.mpp-theme-toggle',
  '.mpp-lang-toggle',
  '.mpp-slider-btn',
  '.mpp-footer__links button',
].join(',');

/**
 * Publica la posición del cursor dentro del botón sobre el que está (--mx/--my)
 * para que ButtonGlow.css dibuje el foco de luz bajo el puntero.
 * Un solo listener delegado en document cubre también los botones que React
 * monta y desmonta al cambiar de pestaña.
 */
export default function useButtonGlow() {
  useEffect(() => {
    let frame = 0;

    const onMove = (event) => {
      const target = event.target instanceof Element ? event.target.closest(GLOW_SELECTOR) : null;
      if (!target) return;
      const { clientX, clientY } = event;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--mx', `${clientX - rect.left}px`);
        target.style.setProperty('--my', `${clientY - rect.top}px`);
      });
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
}
