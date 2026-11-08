'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Props = { images: string[]; alt: string; emoji: string; tint: string };

export default function FruitGallery({ images, alt, emoji, tint }: Props) {
  const t = useTranslations('shop');
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const list = images.filter((src) => !failed.includes(src));
  const n = list.length;
  const idx = n ? Math.min(current, n - 1) : 0;
  const go = useCallback((d: number) => setCurrent((c) => (Math.min(c, n - 1) + d + n) % n), [n]);
  const markFailed = (src: string) => setFailed((f) => (f.includes(src) ? f : [...f, src]));

  // Test every photo once in the browser and drop the ones that are missing
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.onerror = () => markFailed(src);
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, go]);

  if (n === 0) {
    return (
      <div className={`flex aspect-square items-center justify-center rounded-3xl border border-gold/40 ${tint}`}>
        <span className="text-8xl" aria-hidden="true">{emoji}</span>
      </div>
    );
  }

  const arrow = 'absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-forest shadow-md transition hover:bg-gold hover:text-white';

  return (
    <div>
      <div className={`group relative aspect-square overflow-hidden rounded-3xl border border-gold/40 ${tint}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={list[idx]}
            className="absolute inset-0 cursor-zoom-in"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            drag={n > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
            onTap={() => setOpen(true)}
            role="button"
            tabIndex={0}
            aria-label={t('zoom')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}
          >
            <Image src={list[idx]} alt={alt} fill priority={idx === 0} sizes="(min-width: 768px) 380px, 384px" draggable={false}
              className="pointer-events-none object-cover transition duration-500 group-hover:scale-105" />
          </motion.div>
        </AnimatePresence>

        {n > 1 && (
          <>
            <button type="button" aria-label={t('prevPhoto')} onClick={() => go(-1)} className={`${arrow} left-3`}>‹</button>
            <button type="button" aria-label={t('nextPhoto')} onClick={() => go(1)} className={`${arrow} right-3`}>›</button>
          </>
        )}
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-forest-dark/70 px-3 py-1 text-xs font-medium text-white">
          {t('photo', { n: idx + 1, total: n })}
        </span>
      </div>

      {n > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {list.map((src, i) => (
            <button key={src} type="button" onClick={() => setCurrent(i)} aria-label={t('photo', { n: i + 1, total: n })} aria-current={i === idx}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                i === idx ? 'border-gold ring-2 ring-gold/40' : 'border-transparent opacity-70 hover:opacity-100'
              }`}>
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/95 p-4">
          <button ref={closeRef} type="button" aria-label={t('closeViewer')} onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl text-forest hover:bg-gold hover:text-white">✕</button>
          {n > 1 && (
            <>
              <button type="button" aria-label={t('prevPhoto')} onClick={(e) => { e.stopPropagation(); go(-1); }} className={`${arrow} left-3`}>‹</button>
              <button type="button" aria-label={t('nextPhoto')} onClick={(e) => { e.stopPropagation(); go(1); }} className={`${arrow} right-3`}>›</button>
            </>
          )}
          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={list[idx]} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}