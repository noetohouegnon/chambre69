import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { storage } from '../lib/storage';
import { track } from '../lib/analytics';
import { BY_SLUG, type Product } from '../data/catalog';

export type CartLine = { slug: string; size: string; qty: number };
export type CartItem = CartLine & { product: Product };

type Ctx = {
  items: CartItem[];
  count: number;
  add: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
  country: string;
  setCountry: (c: string) => void;
  lastAdded: CartItem | null;
  dismissAdded: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = 'c69-panier';

export function CartProvider({ children }: { children: ReactNode }) {
  // Le panier est lu après le montage, pour que le rendu serveur et le premier rendu client coïncident.
  const [lines, setLines] = useState<CartLine[]>([]);
  const [country, setCountryState] = useState('');
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  useEffect(() => {
    setLines(storage.getJSON<CartLine[]>(KEY, []).filter((l) => BY_SLUG.has(l.slug)));
    setCountryState(storage.get('c69-pays') || '');
    setReady(true);
  }, []);
  useEffect(() => { if (ready) storage.setJSON(KEY, lines); }, [lines, ready]);

  const dismissAdded = useCallback(() => setLastAdded(null), []);
  const items: CartItem[] = lines.map((l) => ({ ...l, product: BY_SLUG.get(l.slug)! })).filter((i) => i.product);

  const add = (slug: string, size: string) => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug && l.size === size);
      return found ? prev.map((l) => (l === found ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { slug, size, qty: 1 }];
    });
    const product = BY_SLUG.get(slug);
    if (product) setLastAdded({ slug, size, qty: 1, product });
    track('add_to_cart', { item: slug, size });
  };
  const setQty = (slug: string, size: string, qty: number) =>
    setLines((prev) => (qty <= 0 ? prev.filter((l) => !(l.slug === slug && l.size === size)) : prev.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l))));
  const remove = (slug: string, size: string) => setQty(slug, size, 0);
  const clear = () => setLines([]);
  const setCountry = (c: string) => { setCountryState(c); storage.set('c69-pays', c); track('select_country', { country: c }); };

  return (
    <CartContext.Provider value={{ items, count: items.reduce((n, i) => n + i.qty, 0), add, setQty, remove, clear, country, setCountry, lastAdded, dismissAdded }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error('useCart doit être utilisé dans CartProvider');
  return c;
};
