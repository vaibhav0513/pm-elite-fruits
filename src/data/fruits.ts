import type { Fruit } from '@/types';

// Photos live in /public/images/fruits/<slug>/1.jpg, 2.jpg, 3.jpg ...
// photos('mango', 6) means 1.jpg to 6.jpg. Use a third value for other types: photos('mango', 6, 'webp').
// Photos that are missing are skipped automatically.
const photos = (slug: string, count = 6, ext = 'jpeg') =>
  Array.from({ length: count }, (_, i) => `/images/fruits/${slug}/${i + 1}.${ext}`);

// SAMPLE DATA. Replace names, descriptions and prices with the owner's real list.
export const fruits: Fruit[] = [
  {
    slug: 'mango', images: photos('mango'), category: 'tropical', pricePerKg: 180, inStock: true, emoji: '🥭', tint: 'bg-mango/15', featured: true,
    name: { en: 'Mango', mr: 'आंबा', hi: 'आम' },
    description: {
      en: 'Sweet, juicy and ripe. Great for eating fresh or making juice and shakes.',
      mr: 'गोड, रसाळ आणि पिकलेला. थेट खाण्यासाठी किंवा ज्यूस व शेकसाठी उत्तम.',
      hi: 'मीठा, रसीला और पका हुआ। सीधे खाने या जूस और शेक के लिए बढ़िया।'
    }
  },
  {
    slug: 'strawberry', images: photos('strawberry'), category: 'berries', pricePerKg: 320, inStock: true, emoji: '🍓', tint: 'bg-berry/10', featured: true,
    name: { en: 'Strawberry', mr: 'स्ट्रॉबेरी', hi: 'स्ट्रॉबेरी' },
    description: {
      en: 'Bright red and tangy-sweet. Good for desserts, cakes and snacking.',
      mr: 'चमकदार लाल आणि आंबट-गोड. मिष्टान्न, केक आणि खाण्यासाठी चांगली.',
      hi: 'चटक लाल और खट्टा-मीठा। मिठाई, केक और नाश्ते के लिए अच्छी।'
    }
  },
  {
    slug: 'blueberry', images: photos('blueberry'), category: 'berries', pricePerKg: 900, inStock: true, emoji: '🫐', tint: 'bg-blueberry/10', featured: true,
    name: { en: 'Blueberry', mr: 'ब्लूबेरी', hi: 'ब्लूबेरी' },
    description: {
      en: 'Small, plump and mildly sweet. Nice in smoothies, yogurt and breakfast bowls.',
      mr: 'लहान, गोलसर आणि सौम्य गोड. स्मूदी, दही आणि नाश्त्यासाठी छान.',
      hi: 'छोटी, गोलमटोल और हल्की मीठी। स्मूदी, दही और नाश्ते के लिए बढ़िया।'
    }
  },
  {
    slug: 'mulberry', images: photos('mulberry'), category: 'berries', pricePerKg: 400, inStock: true, emoji: '🍇', tint: 'bg-purple-900/10', featured: true,
    name: { en: 'Mulberry', mr: 'तुती', hi: 'शहतूत' },
    description: {
      en: 'Deep purple and soft, with a sweet-tart taste. Best eaten fresh.',
      mr: 'गडद जांभळी आणि मऊ, गोड-आंबट चव. ताजी खाणे सर्वोत्तम.',
      hi: 'गहरी बैंगनी और नरम, खट्टा-मीठा स्वाद। ताज़ा खाना सबसे अच्छा।'
    }
  },
 
];

export const getFruit = (slug: string) => fruits.find((f) => f.slug === slug);