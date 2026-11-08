import Image from 'next/image';

export default function Loader() {
  return (
    <div role="status" aria-label="Loading" className="flex min-h-[60vh] items-center justify-center">
      <Image src="/logo.jpeg" alt="" width={110} height={110} className="animate-breathe rounded-full" />
    </div>
  );
}