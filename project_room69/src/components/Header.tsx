import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUi } from '../context/UiContext';
import { searchProducts } from '../lib/search';
import { productUrl } from '../data/catalog';
import { BRAND } from '../data/site';
import { WhatsAppIcon } from './ui/icons';
import { waLink, MESSAGES } from '../lib/whatsapp';
import { track } from '../lib/analytics';

/** Sept entrées au premier niveau (4.2 et 5 quater.1). */
export const NAV = [
  { to: '/boutique', label: 'La boutique en ligne' },
  { to: '/heritage', label: 'Héritage' },
  { to: '/mariee', label: 'Mariée' },
  { to: '/apres-mastectomie', label: 'Après-mastectomie' },
  { to: '/conseils', label: 'Conseils' },
  { to: '/nos-boutiques', label: 'Nos boutiques' },
  { to: '/notre-histoire', label: 'Notre histoire' },
];

function SearchBox({ onDone, autoFocus }: { onDone?: () => void; autoFocus?: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const results = q.trim().length >= 2 ? searchProducts(q).slice(0, 6) : [];
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/boutique?q=${encodeURIComponent(q.trim())}`);
    setOpen(false); setQ(''); onDone?.();
  };
  return (
    <form role="search" onSubmit={submit} className="relative w-full">
      <label htmlFor={autoFocus ? 'search-m' : 'search-d'} className="sr-only">Rechercher une pièce, une maison, une taille</label>
      <input
        id={autoFocus ? 'search-m' : 'search-d'}
        type="search"
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Rechercher : Elomi, bonnet G, bétio…"
        autoComplete="off"
        className="field rounded-full py-2.5 pl-11 pr-4 text-[15px]"
      />
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gold/20 bg-ink-2 shadow-2xl" role="listbox">
          {results.map((p) => (
            <li key={p.slug}>
              <Link to={productUrl(p)} onClick={() => { setOpen(false); setQ(''); onDone?.(); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-3">
                <img src={p.images[0].srcSmall} alt="" width={40} height={52} className="h-12 w-10 rounded object-cover" />
                <span className="text-sm"><span className="block text-ivory">{p.name}</span><span className="text-mute">{p.brand}</span></span>
              </Link>
            </li>
          ))}
          <li><button type="submit" className="w-full px-4 py-3 text-left text-sm text-gold hover:bg-ink-3">Voir tous les résultats pour « {q} »</button></li>
        </ul>
      )}
    </form>
  );
}

export function Header() {
  const { count } = useCart();
  const { openSizeGuide } = useUi();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const loc = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMenu(false); setSearchOpen(false); }, [loc.pathname]);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [menu]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-ink">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-ink">Aller au contenu</a>
      <div className="border-b border-gold/10 bg-ink-2">
        <p className="container-x py-2 text-center text-[13px] text-ivory-2">
          <span className="text-gold">Du bonnet A au bonnet O</span>
          <span className="mx-2 text-mute" aria-hidden>·</span>
          <Link to="/livraison-retours" className="hover:text-gold">Livraison au Sénégal, en Afrique de l’Ouest et à l’international</Link>
        </p>
      </div>

      <div className="container-x flex h-16 items-center gap-3 lg:h-20">
        <button className="-ml-2 inline-flex h-11 w-11 items-center justify-center text-ivory lg:hidden" onClick={() => setMenu(true)} aria-label="Ouvrir le menu" aria-expanded={menu} aria-controls="menu-mobile">
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="mr-auto flex shrink-0 items-center lg:mr-0" aria-label="Chambre 69, retour à l’accueil">
          <img src="/brand/logo-wide.png" alt="Chambre 69" width={482} height={105} className="h-9 w-auto sm:h-10 lg:h-11" />
        </Link>

        <div className="ml-auto hidden max-w-xs flex-1 lg:block xl:max-w-sm"><SearchBox /></div>

        <div className="flex items-center gap-1 sm:gap-2 lg:ml-4">
          <button className="inline-flex h-11 w-11 items-center justify-center text-ivory hover:text-gold lg:hidden" onClick={() => setSearchOpen((v) => !v)} aria-label="Rechercher" aria-expanded={searchOpen}>
            <Search className="h-5 w-5" />
          </button>
          <button className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm text-ivory hover:text-gold md:inline-flex" onClick={() => openSizeGuide('en-tete')}>
            <Ruler className="h-5 w-5" aria-hidden />Trouver ma taille
          </button>
          <a href={waLink(MESSAGES.general)} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { source: 'en-tete' })} className="hidden h-11 w-11 items-center justify-center text-ivory hover:text-wa sm:inline-flex" aria-label="Écrire sur WhatsApp">
            <WhatsAppIcon />
          </a>
          <Link to="/panier" className="relative inline-flex h-11 w-11 items-center justify-center text-ivory hover:text-gold" aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}>
            <ShoppingBag className="h-5 w-5" />
            <span className={`absolute right-0.5 top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-medium ${count ? 'bg-gold text-ink' : 'bg-ink-4 text-mute'}`}>{count}</span>
          </Link>
        </div>
      </div>

      {searchOpen && <div className="container-x pb-3 lg:hidden"><SearchBox autoFocus onDone={() => setSearchOpen(false)} /></div>}

      <nav aria-label="Navigation principale" className="hidden border-t border-gold/10 lg:block">
        <ul className="container-x flex items-center justify-center gap-1 xl:gap-3">
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink to={n.to} className={({ isActive }) => `relative inline-flex h-12 items-center px-3 text-[14px] tracking-wide transition-colors ${isActive ? 'text-gold' : 'text-ivory-2 hover:text-ivory'}`}>
                {({ isActive }) => (<>{n.label}{isActive && <span className="absolute inset-x-3 bottom-0 h-px bg-gold" />}</>)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {menu && (
        <div id="menu-mobile" ref={menuRef} className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-ink-2 shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-gold/10 px-4">
              <img src="/brand/logo-wide.png" alt="Chambre 69" width={482} height={105} className="h-8 w-auto" />
              <button className="inline-flex h-11 w-11 items-center justify-center" onClick={() => setMenu(false)} aria-label="Fermer le menu"><X className="h-6 w-6" /></button>
            </div>
            <ul className="px-2 py-3">
              {NAV.map((n) => (
                <li key={n.to}><NavLink to={n.to} className={({ isActive }) => `flex min-h-[52px] items-center rounded-lg px-3 font-serif text-2xl ${isActive ? 'text-gold' : 'text-ivory'}`}>{n.label}</NavLink></li>
              ))}
            </ul>
            <div className="mt-auto space-y-3 border-t border-gold/10 p-4">
              <button className="btn-line w-full" onClick={() => { setMenu(false); openSizeGuide('menu'); }}><Ruler className="h-5 w-5" />Trouver ma taille</button>
              <a className="btn-wa w-full" href={waLink(MESSAGES.general)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Parler à une conseillère</a>
              <p className="pt-1 text-center text-xs text-mute">WhatsApp {BRAND.whatsappDisplay} — joignable depuis l’étranger</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
