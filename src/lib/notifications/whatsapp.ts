import { site } from '@/config/site';

export type OrderLine = { name: string; kg: number };

export type OrderLabels = {
  hello: string;
  intro: string;
  items: string;
  unit: string;
  name: string;
  address: string;
  time: string;
  thanks: string;
};

export function buildOrderLink(lines: OrderLine[], l: OrderLabels) {
  const list = lines.map((x, i) => `${i + 1}. ${x.name} – ${x.kg} ${l.unit}`).join('\n');
  const text =
    `${l.hello} 👋\n${l.intro}\n\n` +
    `*${l.items}*\n${list}\n\n` +
    `*${l.name}:* \n*${l.address}:* \n*${l.time}:* \n\n${l.thanks}`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}