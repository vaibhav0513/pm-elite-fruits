'use client';

import { motion, useReducedMotion } from 'framer-motion';

// Placeholder emoji. Later swap each one for a real PNG from /public/images/hero.
const items = [
  { icon: '🥭', pos: '-left-3 top-4 text-6xl md:-left-8', delay: 0.4, drift: 10, speed: 4.2 },
  { icon: '🍓', pos: '-left-1 bottom-8 text-5xl md:-left-6', delay: 0.6, drift: 14, speed: 5 },
  { icon: '🫐', pos: '-right-1 top-24 text-5xl md:-right-6', delay: 0.8, drift: 12, speed: 4.6 },
  { icon: '🍃', pos: 'right-8 -top-3 text-5xl', delay: 1, drift: 8, speed: 3.8 }
];

export default function FloatingFruits() {
  const reduce = useReducedMotion();
  return (
    <>
      {items.map((it) => (
        <motion.span
          key={it.icon}
          aria-hidden="true"
          className={`pointer-events-none absolute select-none drop-shadow-lg ${it.pos}`}
          initial={reduce ? false : { y: -160, opacity: 0, rotate: -35 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 9, delay: it.delay }}
        >
          <motion.span
            className="block"
            animate={reduce ? undefined : { y: [0, -it.drift, 0] }}
            transition={{ duration: it.speed, repeat: Infinity, ease: 'easeInOut', delay: it.delay + 1 }}
          >
            {it.icon}
          </motion.span>
        </motion.span>
      ))}
    </>
  );
}