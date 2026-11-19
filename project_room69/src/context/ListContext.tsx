import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { storage } from '../lib/storage';
import { BY_SLUG } from '../data/catalog';

/**
 * Liste de trousseau (5 ter.3). Sans compte : la liste est encodée dans son lien unique.
 * La réservation en temps réel par les contributrices nécessitera un service serveur
 * (base de données) : en attendant, chaque réservation est transmise à une conseillère.
 */
export type ListItem = { slug: string; size: string };
export type TrousseauList = { name: string; date: string; hideGivers: boolean; items: ListItem[] };

const KEY = 'c69-trousseau';
const empty: TrousseauList = { name: '', date: '', hideGivers: true, items: [] };

type Ctx = {
  list: TrousseauList;
  update: (patch: Partial<TrousseauList>) => void;
  toggle: (item: ListItem) => void;
  has: (slug: string) => boolean;
};
const ListContext = createContext<Ctx | null>(null);

export function ListProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<TrousseauList>(empty);
  const [ready, setReady] = useState(false);
  useEffect(() => { setList({ ...empty, ...storage.getJSON(KEY, empty) }); setReady(true); }, []);
  useEffect(() => { if (ready) storage.setJSON(KEY, list); }, [list, ready]);

  const update = (patch: Partial<TrousseauList>) => setList((l) => ({ ...l, ...patch }));
  const toggle = (item: ListItem) => setList((l) => ({
    ...l,
    items: l.items.some((i) => i.slug === item.slug) ? l.items.filter((i) => i.slug !== item.slug) : [...l.items, item],
  }));
  const has = (slug: string) => list.items.some((i) => i.slug === slug);
  return <ListContext.Provider value={{ list, update, toggle, has }}>{children}</ListContext.Provider>;
}

export const useList = () => {
  const c = useContext(ListContext);
  if (!c) throw new Error('useList doit être utilisé dans ListProvider');
  return c;
};

// Encodage compact et lisible dans une URL : base64url du JSON.
export function encodeList(l: TrousseauList): string {
  const payload = { n: l.name, d: l.date, h: l.hideGivers ? 1 : 0, i: l.items.map((i) => [i.slug, i.size]) };
  const b64 = typeof window === 'undefined' ? '' : window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeList(s: string): TrousseauList | null {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(decodeURIComponent(escape(window.atob(b64))));
    return {
      name: String(json.n || '').slice(0, 40),
      date: String(json.d || ''),
      hideGivers: !!json.h,
      items: (json.i || []).filter((x: [string, string]) => BY_SLUG.has(x[0])).map((x: [string, string]) => ({ slug: x[0], size: String(x[1] || '').slice(0, 8) })),
    };
  } catch {
    return null;
  }
}
