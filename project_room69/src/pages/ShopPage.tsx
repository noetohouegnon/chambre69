import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Ruler } from 'lucide-react';
import { PRODUCTS, CATEGORIES, LINES, OCCASIONS, BRANDS_DISTRIBUTED, type Product, type CategoryId } from '../data/catalog';
import { BRAND } from '../data/site';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/ui/Section';
import { WaButton } from '../components/ui/WaButton';
import { searchProducts } from '../lib/search';
import { MESSAGES } from '../lib/whatsapp';
import { track } from '../lib/analytics';
import { useUi } from '../context/UiContext';

const ALPHA = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const PAGE = 24;

type Filters = {
  categorie: string[]; maison: string[]; bonnet: string[]; dos: string[]; taille: string[]; couleur: string[]; ligne: string[]; occasion: string[];
};
const KEYS: (keyof Filters)[] = ['categorie', 'maison', 'bonnet', 'dos', 'taille', 'couleur', 'ligne', 'occasion'];

function readFilters(sp: URLSearchParams): Filters {
  const f = {} as Filters;
  for (const k of KEYS) f[k] = (sp.get(k) || '').split(',').filter(Boolean);
  return f;
}

function matches(p: Product, f: Filters, skip?: keyof Filters) {
  if (skip !== 'categorie' && f.categorie.length && !f.categorie.includes(p.category)) return false;
  if (skip !== 'maison' && f.maison.length && !f.maison.includes(p.brand)) return false;
  if (skip !== 'couleur' && f.couleur.length && !(p.color && f.couleur.includes(p.color))) return false;
  if (skip !== 'ligne' && f.ligne.length && !p.lines.some((l) => f.ligne.includes(l))) return false;
  if (skip !== 'occasion' && f.occasion.length && !p.occasions.some((o) => f.occasion.includes(o))) return false;
  // Deux systèmes de taille qui coexistent sans conflit (4.5) : numérique (dos + bonnet) OU alphabétique.
  const wantNum = (skip !== 'bonnet' && f.bonnet.length > 0) || (skip !== 'dos' && f.dos.length > 0);
  const wantAlpha = skip !== 'taille' && f.taille.length > 0;
  if (wantNum || wantAlpha) {
    const unavailable = new Set(p.unavailable || []);
    const numOk = wantNum && !!p.sizes.cups?.length &&
      (skip === 'bonnet' || !f.bonnet.length || p.sizes.cups!.some((c) => f.bonnet.includes(c))) &&
      (skip === 'dos' || !f.dos.length || (p.sizes.bands || []).some((b) => f.dos.includes(String(b)))) &&
      !(f.bonnet.length === 1 && f.dos.length === 1 && unavailable.has(`${f.dos[0]}${f.bonnet[0]}`));
    const alphaOk = wantAlpha && !!p.sizes.alpha?.some((a) => f.taille.includes(a) && !unavailable.has(a));
    if (!numOk && !alphaOk) return false;
  }
  return true;
}

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-gold/10 py-4">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between text-[15px] font-medium text-ivory">
        {title}<span className="text-gold transition-transform group-open:rotate-45" aria-hidden>+</span>
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  );
}

export function ShopPage() {
  const [sp, setSp] = useSearchParams();
  const f = readFilters(sp);
  const q = sp.get('q') || '';
  const tri = sp.get('tri') || 'selection';
  const shown = Number(sp.get('voir')) || PAGE;
  const [drawer, setDrawer] = useState(false);
  const { openSizeGuide } = useUi();

  const base = useMemo(() => (q ? searchProducts(q) : PRODUCTS), [q]);
  const results = useMemo(() => {
    const r = base.filter((p) => matches(p, f));
    if (tri === 'nouveautes') return [...r].sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.rank - b.rank);
    if (tri === 'prix-croissant') return [...r].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (tri === 'prix-decroissant') return [...r].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, sp.toString()]);

  const countFor = (key: keyof Filters, value: string) => base.filter((p) => matches(p, { ...f, [key]: [value] })).length;
  const hasPrices = PRODUCTS.some((p) => p.price);
  const colors = [...new Set(PRODUCTS.map((p) => p.color).filter(Boolean))].sort() as string[];
  const bands = [...new Set(PRODUCTS.flatMap((p) => p.sizes.bands || []))].sort((a, b) => a - b);
  const activeCount = KEYS.reduce((n, k) => n + f[k].length, 0) + (q ? 1 : 0);

  const update = (mut: (n: URLSearchParams) => void) => {
    const n = new URLSearchParams(sp);
    mut(n);
    n.delete('voir');
    setSp(n, { replace: true, preventScrollReset: true });
  };
  const toggle = (key: keyof Filters, value: string) => update((n) => {
    const cur = new Set(f[key]);
    if (cur.has(value)) cur.delete(value); else { cur.add(value); if (key === 'bonnet') track('cup_filter', { cup: value }); }
    if (cur.size) n.set(key, [...cur].join(',')); else n.delete(key);
  });
  const reset = () => setSp(new URLSearchParams(tri !== 'selection' ? { tri } : {}), { replace: true });

  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [drawer]);

  const chip = (key: keyof Filters, value: string, label: string, opts: { square?: boolean } = {}) => {
    const active = f[key].includes(value);
    const n = active ? null : countFor(key, value);
    const disabled = !active && n === 0;
    return (
      <button
        key={value}
        type="button"
        onClick={() => toggle(key, value)}
        aria-pressed={active}
        disabled={disabled}
        title={disabled ? 'Aucune pièce avec les filtres actuels' : undefined}
        className={`chip ${opts.square ? 'h-11 w-11 px-0 font-serif text-lg' : ''} ${active ? 'border-gold bg-gold text-ink' : disabled ? 'border-ivory/10 text-mute/50 line-through decoration-1' : 'border-ivory/20 text-ivory-2 hover:border-gold hover:text-ivory'}`}
      >
        {label}{!opts.square && n !== null && !disabled ? <span className="ml-1.5 text-xs text-mute">{n}</span> : null}
      </button>
    );
  };

  const panel = (
    <div>
      <Group title="Bonnet, du A au O">
        <div className="flex flex-wrap gap-2">{BRAND.cups.map((c) => chip('bonnet', c, c, { square: true }))}</div>
        <button type="button" onClick={() => openSizeGuide('boutique-filtres')} className="btn-ghost mt-3 text-sm"><Ruler className="h-4 w-4" />Je ne connais pas ma taille</button>
      </Group>
      <Group title="Tour de dos">
        <div className="flex flex-wrap gap-2">{bands.map((b) => chip('dos', String(b), String(b)))}</div>
      </Group>
      <Group title="Taille (culottes et pièces souples)">
        <div className="flex flex-wrap gap-2">{ALPHA.map((a) => chip('taille', a, a))}</div>
      </Group>
      <Group title="Catégorie">
        <div className="flex flex-wrap gap-2">{CATEGORIES.map((c) => chip('categorie', c.id, c.short))}</div>
      </Group>
      <Group title="Maison">
        <div className="flex flex-wrap gap-2">{[...BRANDS_DISTRIBUTED, 'Chambre 69'].map((b) => chip('maison', b, b === 'Chambre 69' ? 'Sélection Chambre 69' : b))}</div>
      </Group>
      <Group title="Occasion" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">{OCCASIONS.map((o) => chip('occasion', o.id, o.label))}</div>
      </Group>
      <Group title="Lignes" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">{LINES.filter((l) => PRODUCTS.some((p) => p.lines.includes(l.id))).map((l) => chip('ligne', l.id, l.name))}</div>
      </Group>
      <Group title="Couleur" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">{colors.map((c) => chip('couleur', c, c))}</div>
      </Group>
      {!hasPrices && <p className="pt-4 text-xs leading-relaxed text-mute">Filtre par prix et disponibilité : activés dès que les prix et le stock à la taille sont renseignés.</p>}
    </div>
  );

  const catLabel = f.categorie.length === 1 ? CATEGORIES.find((c) => c.id === f.categorie[0])?.label : null;
  const list = results.slice(0, shown);

  return (
    <div className="container-x pb-20 pt-8">
      <Breadcrumbs items={catLabel ? [{ label: 'La boutique en ligne', to: '/boutique' }, { label: catLabel }] : [{ label: 'La boutique en ligne' }]} />
      <header className="mb-8 mt-6 max-w-3xl">
        <h1 className="h-display">{catLabel || 'La boutique en ligne'}</h1>
        <p className="lead mt-4">Du bonnet A au bonnet O, dans une amplitude réelle de tailles. Chaque commande est confirmée avec une conseillère sur WhatsApp avant expédition.</p>
      </header>

      <div className="sticky top-[104px] z-20 -mx-4 mb-6 flex items-center gap-3 border-y border-gold/10 bg-ink/95 px-4 py-3 backdrop-blur sm:top-[112px] lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
        <button className="btn-line min-h-[44px] px-4 text-sm lg:hidden" onClick={() => setDrawer(true)}>
          <SlidersHorizontal className="h-4 w-4" />Filtrer{activeCount ? ` (${activeCount})` : ''}
        </button>
        <p className="text-sm text-ivory-2" aria-live="polite"><strong className="font-medium text-ivory">{results.length}</strong> pièce{results.length > 1 ? 's' : ''}</p>
        {activeCount > 0 && <button onClick={reset} className="btn-ghost hidden text-sm sm:inline-flex">Tout réinitialiser</button>}
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="hidden text-mute sm:inline">Trier</span>
          <select className="field w-auto min-w-[10rem] py-2 text-sm" value={tri} onChange={(e) => update((n) => (e.target.value === 'selection' ? n.delete('tri') : n.set('tri', e.target.value)))} aria-label="Trier les pièces">
            <option value="selection">Notre sélection</option>
            <option value="nouveautes">Nouveautés</option>
            {hasPrices && <option value="prix-croissant">Prix croissant</option>}
            {hasPrices && <option value="prix-decroissant">Prix décroissant</option>}
          </select>
        </label>
      </div>

      {(q || activeCount > 0) && (
        <ul className="mb-6 flex flex-wrap gap-2" aria-label="Filtres actifs">
          {q && <li><button className="chip border-gold/40 text-ivory" onClick={() => update((n) => n.delete('q'))}>« {q} »<X className="ml-1.5 h-3.5 w-3.5" aria-label="retirer" /></button></li>}
          {KEYS.flatMap((k) => f[k].map((v) => (
            <li key={k + v}><button className="chip border-gold/40 text-ivory" onClick={() => toggle(k, v)}>
              {k === 'bonnet' ? `Bonnet ${v}` : k === 'dos' ? `Dos ${v}` : k === 'categorie' ? CATEGORIES.find((c) => c.id === v)?.short : k === 'ligne' ? LINES.find((l) => l.id === v)?.name : k === 'occasion' ? OCCASIONS.find((o) => o.id === v)?.label : v}
              <X className="ml-1.5 h-3.5 w-3.5" aria-label="retirer" />
            </button></li>
          )))}
          <li><button onClick={reset} className="chip border-transparent text-gold underline-offset-4 hover:underline">Tout réinitialiser</button></li>
        </ul>
      )}

      <div className="grid gap-10 lg:grid-cols-[17rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filtres">{panel}</aside>

        <div>
          {results.length === 0 ? (
            <div className="card mx-auto max-w-xl p-8 text-center">
              <h2 className="font-serif text-3xl">Nous n’avons pas encore cette taille dans ce modèle</h2>
              <p className="mt-4 text-ivory-2">Dites-nous laquelle vous cherchez : nous vous répondons sous 24 heures et nous en tenons compte pour nos prochaines commandes.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <WaButton message={MESSAGES.emptyResult(describe(f, q))} source="resultat-vide">Écrire à une conseillère</WaButton>
                <button onClick={reset} className="btn-line">Voir toutes les pièces</button>
              </div>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
                {list.map((p, i) => <li key={p.slug}><ProductCard p={p} priority={i < 4} sizes="(min-width:1280px) 18vw, (min-width:768px) 28vw, 46vw" /></li>)}
              </ul>
              {shown < results.length && (
                <div className="mt-12 text-center">
                  <button className="btn-line px-8" onClick={() => { const n = new URLSearchParams(sp); n.set('voir', String(shown + PAGE)); setSp(n, { replace: true, preventScrollReset: true }); }}>
                    Voir plus de pièces ({results.length - shown} restantes)
                  </button>
                </div>
              )}
            </>
          )}
          <aside className="mt-16 flex flex-col items-start gap-4 rounded-2xl border border-gold/15 bg-ink-2 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-ivory-2"><strong className="font-medium text-ivory">Vous hésitez sur votre taille ?</strong> Une conseillère vérifie avec vous avant que vous ne commandiez.</p>
            <WaButton message={MESSAGES.sizeCheck()} source="boutique-bas" className="shrink-0">Demander conseil</WaButton>
          </aside>
          <p className="mt-6 text-xs text-mute">Les tailles affichées sont l’amplitude habituelle de chaque maison : votre conseillère vous confirme la disponibilité de la vôtre avant toute expédition.</p>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-3xl bg-ink-2">
            <div className="flex items-center justify-between border-b border-gold/10 px-5 py-3">
              <p className="font-serif text-2xl">Filtrer</p>
              <button onClick={() => setDrawer(false)} aria-label="Fermer les filtres" className="inline-flex h-11 w-11 items-center justify-center"><X className="h-6 w-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">{panel}</div>
            <div className="flex gap-3 border-t border-gold/10 p-4">
              <button onClick={reset} className="btn-line flex-1">Réinitialiser</button>
              <button onClick={() => setDrawer(false)} className="btn-gold flex-1">Voir {results.length} pièce{results.length > 1 ? 's' : ''}</button>
            </div>
          </div>
        </div>
      )}
      <p className="sr-only"><Link to="/guide-des-tailles">Guide des tailles</Link></p>
    </div>
  );
}

function describe(f: Filters, q: string) {
  const parts: string[] = [];
  if (f.dos.length || f.bonnet.length) parts.push(`la taille ${f.dos.join('/')}${f.bonnet.join('/')}`);
  if (f.taille.length) parts.push(`la taille ${f.taille.join('/')}`);
  if (f.categorie.length) parts.push(f.categorie.map((c) => CATEGORIES.find((x) => x.id === (c as CategoryId))?.short.toLowerCase()).join(', '));
  if (f.maison.length) parts.push(`de la maison ${f.maison.join(', ')}`);
  if (q) parts.push(`« ${q} »`);
  return parts.join(' ') || 'une pièce';
}
