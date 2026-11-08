'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Shows the photo if it exists, otherwise the emoji. Parent must be `relative`.
export default function FruitImage({ src, emoji, alt = '', sizes }: { src?: string; emoji: string; alt?: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The error can happen before React is ready, so check once after load
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (!src || failed) {
    return (
      <span className="flex h-full w-full items-center justify-center text-7xl transition duration-300 group-hover:scale-125 group-hover:-rotate-6" aria-hidden="true">
        {emoji}
      </span>
    );
  }
  return (
    <Image ref={ref} src={src} alt={alt} fill sizes={sizes} onError={() => setFailed(true)} className="object-cover transition duration-500 group-hover:scale-110" />
  );
}