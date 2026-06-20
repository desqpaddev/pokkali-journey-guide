import { useEffect, useRef } from "react";

/**
 * Custom cursor: a glowing rice-grain that follows the pointer, with
 * a trailing flock of smaller grains drifting like husks in the breeze.
 * Disabled on touch / coarse pointer devices.
 */
export function RiceCursor() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (coarse) return;

    document.documentElement.classList.add("rice-cursor-active");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const main = { x: target.x, y: target.y, a: 0 };
    const trail = trailRefs.current.map(() => ({ x: target.x, y: target.y, a: 0 }));
    let lastX = target.x;
    let lastY = target.y;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onDown = () => mainRef.current?.classList.add("is-press");
    const onUp = () => mainRef.current?.classList.remove("is-press");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const tick = () => {
      // smooth main
      main.x += (target.x - main.x) * 0.28;
      main.y += (target.y - main.y) * 0.28;
      const dx = main.x - lastX;
      const dy = main.y - lastY;
      lastX = main.x;
      lastY = main.y;
      const moving = Math.hypot(dx, dy);
      if (moving > 0.5) {
        main.a = Math.atan2(dy, dx) * (180 / Math.PI);
      }
      if (mainRef.current) {
        mainRef.current.style.transform = `translate3d(${main.x}px, ${main.y}px, 0) translate(-50%, -50%) rotate(${main.a + 90}deg)`;
      }
      // trail eased chain
      let px = main.x;
      let py = main.y;
      let pa = main.a;
      trail.forEach((t, i) => {
        const ease = 0.18 - i * 0.018;
        t.x += (px - t.x) * ease;
        t.y += (py - t.y) * ease;
        const ddx = px - t.x;
        const ddy = py - t.y;
        if (Math.hypot(ddx, ddy) > 0.4) {
          t.a = Math.atan2(ddy, ddx) * (180 / Math.PI);
        } else {
          t.a = pa;
        }
        const el = trailRefs.current[i];
        if (el) {
          const scale = 1 - i * 0.09;
          el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) translate(-50%, -50%) rotate(${t.a + 90}deg) scale(${scale})`;
          el.style.opacity = String(Math.max(0, 0.55 - i * 0.07));
        }
        px = t.x;
        py = t.y;
        pa = t.a;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("rice-cursor-active");
    };
  }, []);

  const grain = (
    <svg viewBox="0 0 24 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="riceFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8e1" />
          <stop offset="55%" stopColor="#f5d97a" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      <ellipse cx="12" cy="24" rx="6.5" ry="22" fill="url(#riceFill)" stroke="#7a5a13" strokeWidth="0.8" />
      <path d="M12 4 C 9 14, 9 34, 12 44" stroke="#7a5a13" strokeWidth="0.7" fill="none" opacity="0.55" />
    </svg>
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          className="rice-cursor-trail absolute left-0 top-0 h-6 w-3 will-change-transform"
        >
          {grain}
        </div>
      ))}
      <div
        ref={mainRef}
        className="rice-cursor-main absolute left-0 top-0 h-8 w-4 will-change-transform"
      >
        {grain}
      </div>
    </div>
  );
}

export default RiceCursor;