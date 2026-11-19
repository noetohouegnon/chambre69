import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Heart, Ruler, CalendarCheck, ShoppingBag, Share2, Package, Plane, RefreshCw, MessageCircle, X, MapPin, Check, BellRing } from 'lucide-react';
import { BY_SLUG, CATEGORIES, coordinated, related, formatPrice, isWearable, type Product } from '../data/catalog';
import { STORES, PENDING, SITE_URL } from '../data/site';
import { Breadcrumbs } from '../components/ui/Section';
import { Img } from '../components/ui/Img';
import { WaButton } from '../components/ui/WaButton';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useList } from '../context/ListContext';
import { useUi } from '../context/UiContext';
import { MESSAGES, waLink, waShare } from '../lib/whatsapp';
import { track } from '../lib/analytics';
import { NotFoundPage } from './NotFoundPage';

/** « Cette pièce vous ira si » : renseigné par la boutique, sinon déduit des seules caractéristiques connues. */
function fitLines(p: Product): string[] {
  if (p.fit?.length) return p.fit;
  const t = `${p.name} ${p.description} ${p.features.join(' ')}`.toLowerCase();
  const out: string[] = [];
  const maxCup = p.sizes.cups?.[p.sizes.cups.length - 1];
  if (/grossesse|allaitement/.test(t)) out.push('Vous attendez un enfant, ou vous venez d’accoucher');
  if (/sport/.test(t)) out.push('Vous bougez beaucoup et voulez un maintien réel, même en grand bonnet');
  if (maxCup && 'KLMNO'.includes(maxCup)) out.push('Vous portez un grand bonnet et cherchez de la dentelle, pas seulement du maintien');
  if (/sans armature|non wired|unwired/.test(t)) out.push('Vous avez la peau sensible et préférez sans armature');
  if (/moulé|moulded|coques?/.test(t) && !/sans coques/.test(t)) out.push('Vous cherchez une pièce invisible sous un vêtement fin');
  if (/sans bretelles|strapless/.test(t)) out.push('Vous portez des tenues aux épaules dégagées, pour une cérémonie ou un soir');
  if (/emboîtant|3 pans|trois parties|3 parties|renfort latéral/.test(t)) out.push('Vous cherchez un maintien ferme au quotidien');
  if (/coton/.test(t)) out.push('Vous privilégiez une matière douce, à porter tous les jours');
  return out.slice(0, 3);
}

function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  useEffect(() => setI(0), [p.slug]);
  useEffect(() => {
    if (!zoom) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(false);
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [zoom]);
  const img = p.images[i] || p.images[0];
  return (
    <div>
      <button type="button" onClick={() => setZoom(true)} className="block w-full overflow-hidden rounded-2xl bg-ink-3 cursor-zoom-in" aria-label="Agrandir la photo">
        <div className="aspect-[4/5]"><Img image={img} alt={`${p.name}, vue ${i + 1} sur ${p.images.length}`} priority sizes="(min-width:1024px) 45vw, 100vw" className="h-full w-full" fit="contain" /></div>
      </button>
      {p.images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar" aria-label="Autres vues">
          {p.images.map((im, k) => (
            <li key={im.src}>
              <button type="button" onClick={() => setI(k)} aria-label={`Vue ${k + 1}`} aria-current={k === i} className={`block h-24 w-20 overflow-hidden rounded-lg border-2 bg-ink-3 ${k === i ? 'border-gold' : 'border-transparent opacity-75 hover:opacity-100'}`}>
                <Img image={im} alt="" sizes="80px" className="h-full w-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {zoom && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black" role="dialog" aria-modal="true" aria-label="Photo agrandie">
          <button onClick={() => setZoom(false)} className="fixed right-3 top-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink-3 text-ivory" aria-label="Fermer"><X className="h-6 w-6" /></button>
          <img src={img.src} alt={p.name} className="mx-auto min-h-full w-auto max-w-none object-contain" style={{ width: 'max(100vw, 960px)', touchAction: 'pinch-zoom' }} />
        </div>
      )}
    </div>
  );
}

export function ProductPage() {
  const { slug = '' } = useParams();
  const p = BY_SLUG.get(slug);
  const navigate = useNavigate();
  const { add } = useCart();
  const { toggle, has } = useList();
  const { openSizeGuide, setWaMessage } = useUi();
  const [band, setBand] = useState<number | null>(null);
  const [cup, setCup] = useState<string | null>(null);
  const [alpha, setAlpha] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notify, setNotify] = useState<string | null>(null);

  const isBra = !!(p?.sizes.cups?.length && p.sizes.bands?.length);
  const size = p ? (isBra ? (band && cup ? `${band}${cup}` : '') : (p.sizes.alpha?.length ? alpha || '' : 'Taille unique')) : '';
  const unavailable = useMemo(() => new Set(p?.unavailable || []), [p]);

  useEffect(() => {
    setBand(null); setCup(null); setAlpha(null); setError(''); setNotify(null);
  }, [slug]);
  useEffect(() => {
    if (!p) return;
    track('view_item', { item: p.slug, brand: p.brand });
    setWaMessage(MESSAGES.product(p.name, p.reference));
    return () => setWaMessage(null);
  }, [p, setWaMessage]);
  useEffect(() => { if (p && size && size !== 'Taille unique') setWaMessage(MESSAGES.product(p.name, p.reference, size)); }, [size, p, setWaMessage]);

  if (!p) return <NotFoundPage />;
  const wearable = isWearable(p);

  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const fits = fitLines(p);
  const coord = coordinated(p);
  const rel = related(p, 4).filter((r) => !coord.includes(r));
  const url = `${SITE_URL}/boutique/${p.slug}`;
  const sizeUnavailable = size && unavailable.has(size);

  const requireSize = () => {
    if (!size) { setError(isBra ? 'Choisissez votre tour de dos et votre bonnet.' : 'Choisissez votre taille.'); return false; }
    if (sizeUnavailable) { setError('Cette taille est indisponible pour le moment. Nous pouvons vous prévenir de son retour.'); return false; }
    setError(''); return true;
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product', name: p.name, sku: p.reference, image: p.images.map((im) => SITE_URL + im.src),
        description: p.description || `${p.name}, ${p.brand}.`, brand: { '@type': 'Brand', name: p.brand }, color: p.color || undefined,
        ...(p.price ? { offers: { '@type': 'Offer', price: p.price, priceCurrency: 'XOF', availability: 'https://schema.org/InStock', url } } : {}),
      },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: 'La boutique en ligne', item: SITE_URL + '/boutique' },
        { '@type': 'ListItem', position: 3, name: p.name, item: url },
      ] },
    ],
  };

  return (
    <div className="pb-20 pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x">
        <Breadcrumbs items={[{ label: 'La boutique en ligne', to: '/boutique' }, { label: cat.short, to: `/boutique?categorie=${cat.id}` }, { label: p.name }]} />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Gallery p={p} />

          <div>
            <Link to={p.brandKind === 'maison' ? `/boutique?maison=${encodeURIComponent(p.brand)}` : '/boutique?maison=Chambre%2069'} className="eyebrow hover:text-gold-soft">{p.brand === 'Chambre 69' ? 'Sélection Chambre 69' : p.brand}</Link>
            <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{p.name}</h1>
            <p className="mt-3 text-sm text-mute">Référence {p.reference}{p.color ? ` · Coloris ${p.color.toLowerCase()}` : ''} · Provenance : {p.origin}</p>
            <p className="mt-5 text-2xl text-ivory">{p.price ? formatPrice(p.price) : <span className="text-lg text-ivory-2">Prix communiqué par votre conseillère</span>}</p>
            {p.lastPieces && <p className="mt-2 text-sm text-gold">Dernières pièces disponibles</p>}

            {/* Sélecteur de taille — micro-textes 2.4 */}
            {(isBra || p.sizes.alpha?.length) ? (
              <fieldset className="mt-8">
                <div className="flex items-baseline justify-between gap-4">
                  <legend className="text-[15px] font-medium text-ivory">Votre taille{size && size !== 'Taille unique' ? <span className="ml-2 text-gold">{size}</span> : null}</legend>
                  <button type="button" onClick={() => openSizeGuide('fiche-produit')} className="btn-ghost text-sm"><Ruler className="h-4 w-4" />Je ne connais pas ma taille</button>
                </div>
                {isBra ? (
                  <>
                    <p className="mb-2 mt-4 text-sm text-mute">Tour de dos</p>
                    <div className="flex flex-wrap gap-2">
                      {p.sizes.bands!.map((b) => (
                        <button key={b} type="button" aria-pressed={band === b} onClick={() => { setBand(b); setError(''); }} className={`chip min-w-[56px] ${band === b ? 'border-gold bg-gold text-ink' : 'border-ivory/20 text-ivory-2 hover:border-gold'}`}>{b}</button>
                      ))}
                    </div>
                    <p className="mb-2 mt-4 text-sm text-mute">Bonnet</p>
                    <div className="flex flex-wrap gap-2">
                      {p.sizes.cups!.map((c) => {
                        const off = band !== null && unavailable.has(`${band}${c}`);
                        return (
                          <button key={c} type="button" aria-pressed={cup === c} onClick={() => { setCup(c); setError(''); }} aria-label={off ? `Bonnet ${c}, indisponible` : `Bonnet ${c}`}
                            className={`chip h-11 w-11 px-0 font-serif text-lg ${cup === c ? 'border-gold bg-gold text-ink' : off ? 'border-ivory/10 text-mute/60 line-through' : 'border-ivory/20 text-ivory-2 hover:border-gold'}`}>{c}</button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.sizes.alpha!.map((a) => {
                      const off = unavailable.has(a);
                      return <button key={a} type="button" aria-pressed={alpha === a} onClick={() => { setAlpha(a); setError(''); }} aria-label={off ? `${a}, indisponible` : a}
                        className={`chip min-w-[56px] ${alpha === a ? 'border-gold bg-gold text-ink' : off ? 'border-ivory/10 text-mute/60 line-through' : 'border-ivory/20 text-ivory-2 hover:border-gold'}`}>{a}</button>;
                    })}
                  </div>
                )}
                {sizeUnavailable && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-gold/25 p-3 text-sm">
                    <span>{size} — indisponible pour le moment.</span>
                    <a className="btn-ghost text-sm" href={waLink(MESSAGES.backInStock(p.name, p.reference, size))} target="_blank" rel="noopener noreferrer" onClick={() => setNotify(size)}><BellRing className="h-4 w-4" />Prévenez-moi du retour</a>
                  </div>
                )}
                {notify && <p className="mt-2 text-sm text-gold" role="status">Demande d’alerte préparée sur WhatsApp pour la taille {notify}.</p>}
                {p.sizesProvisional && <p className="mt-3 text-xs text-mute">Tailles habituelles de la maison {p.brand}. La disponibilité exacte est confirmée par votre conseillère avant l’expédition.</p>}
                {error && <p role="alert" className="mt-3 text-sm text-[#F2A999]">{error}</p>}
              </fieldset>
            ) : null}

            {/* Les quatre actions (4.4) */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button className="btn-gold sm:col-span-2" onClick={() => requireSize() && add(p.slug, size)}><ShoppingBag className="h-5 w-5" />Ajouter au panier</button>
              {wearable && <button className="btn-line" onClick={() => { track('appointment_intent', { type: 'essayage', item: p.slug }); navigate(`/rendez-vous?type=essayage&piece=${p.slug}${size ? `&taille=${encodeURIComponent(size)}` : ''}`); }}><CalendarCheck className="h-5 w-5" />Réserver pour essayage</button>}
              <WaButton message={MESSAGES.product(p.name, p.reference, size && size !== 'Taille unique' ? size : undefined)} source="fiche-produit" variant="line" className={wearable ? '' : 'sm:col-span-2'}>Demander conseil sur cette pièce</WaButton>
              <button className="btn-ghost sm:col-span-2 sm:justify-center" onClick={() => { toggle({ slug: p.slug, size: size || '' }); track('trousseau_toggle', { item: p.slug }); }} aria-pressed={has(p.slug)}>
                {has(p.slug) ? <><Check className="h-4 w-4" />Dans ma liste de trousseau — <Link to="/mariee/liste" className="underline">voir ma liste</Link></> : <><Heart className="h-4 w-4" />Ajouter à ma liste de trousseau</>}
              </button>
            </div>

            {/* Bandeau de réassurance de la fiche produit */}
            <ul className="mt-8 grid gap-3 rounded-2xl border border-gold/15 bg-ink-2 p-5 text-sm text-ivory-2 sm:grid-cols-2">
              <li className="flex gap-2.5"><Plane className="h-4 w-4 shrink-0 text-gold" />{p.brandKind === 'maison' ? 'Importé directement d’Europe' : 'Sélectionné par Chambre 69'}</li>
              <li className="flex gap-2.5"><Package className="h-4 w-4 shrink-0 text-gold" />Emballage neutre</li>
              <li className="flex gap-2.5"><RefreshCw className="h-4 w-4 shrink-0 text-gold" />{wearable ? `Échange en boutique${PENDING.exchangeDays ? ` sous ${PENDING.exchangeDays} jours` : ''}` : 'Neuf, dans son emballage d’origine'}</li>
              <li className="flex gap-2.5"><MessageCircle className="h-4 w-4 shrink-0 text-gold" />Conseil gratuit sur WhatsApp</li>
              <li className="flex gap-2.5 sm:col-span-2"><MapPin className="h-4 w-4 shrink-0 text-gold" />Livraison Sénégal, Afrique de l’Ouest et international — <Link to="/livraison-retours" className="text-gold hover:underline">livraison et retours</Link></li>
            </ul>

            {fits.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl">Cette pièce vous ira si</h2>
                <ul className="mt-4 space-y-2">{fits.map((f) => <li key={f} className="flex gap-3 text-ivory-2"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{f}</li>)}</ul>
              </section>
            )}

            <div className="mt-10 divide-y divide-gold/10 border-y border-gold/10">
              {(p.description || p.features.length > 0) && (
                <details open className="group py-4">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between font-medium">Description<span className="text-gold group-open:rotate-45 transition-transform">+</span></summary>
                  <div className="body-copy mt-3">
                    {p.description.split('\n\n').filter(Boolean).map((para, k) => <p key={k}>{para}</p>)}
                    {p.features.length > 0 && <ul className="mt-4 list-disc space-y-1 pl-5">{p.features.map((x) => <li key={x}>{x}</li>)}</ul>}
                  </div>
                </details>
              )}
              <details className="group py-4">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between font-medium">Composition, entretien et provenance<span className="text-gold group-open:rotate-45 transition-transform">+</span></summary>
                <div className="body-copy mt-3 space-y-3">
                  <p><strong className="font-medium text-ivory">Composition : </strong>{p.composition.length ? p.composition.join(' · ') : 'communiquée sur demande par votre conseillère.'}</p>
                  {(p.care.length > 0 || wearable) && <p><strong className="font-medium text-ivory">Entretien : </strong>{p.care.length ? p.care.join(' · ') : 'lavage à la main à l’eau froide, séchage à plat et à l’ombre.'} <Link to="/conseils/prendre-soin-de-sa-lingerie" className="text-gold hover:underline">Nos conseils d’entretien</Link></p>}
                  <p><strong className="font-medium text-ivory">Provenance : </strong>{p.brandKind === 'maison' ? `maison ${p.brand}, importée directement par Chambre 69 (${p.origin}).` : `${p.origin}.`}</p>
                </div>
              </details>
              <details className="group py-4">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between font-medium">Où l’essayer<span className="text-gold group-open:rotate-45 transition-transform">+</span></summary>
                <ul className="mt-3 space-y-2 text-ivory-2">
                  {STORES.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-2">
                      <Link to={`/nos-boutiques/${s.id}`} className="hover:text-gold">Boutique {s.district}, Dakar</Link>
                      <span className="text-sm text-mute">{p.stores ? (p.stores.includes(s.id) ? 'Disponible' : 'Sur demande') : 'Disponibilité confirmée sur WhatsApp'}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            <a href={waShare(`${p.name} — ${p.brand}, chez Chambre 69 : ${url}`)} target="_blank" rel="noopener noreferrer" onClick={() => track('share', { method: 'whatsapp', item: p.slug })} className="btn-ghost mt-6"><Share2 className="h-4 w-4" />Partager sur WhatsApp</a>
          </div>
        </div>
      </div>

      {coord.length > 0 && (
        <section className="container-x mt-20">
          <h2 className="mb-6 font-serif text-3xl">Les pièces coordonnées</h2>
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">{coord.slice(0, 4).map((r) => <li key={r.slug}><ProductCard p={r} /></li>)}</ul>
        </section>
      )}
      {rel.length > 0 && (
        <section className="container-x mt-16">
          <h2 className="mb-6 font-serif text-3xl">Vous aimerez aussi</h2>
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">{rel.map((r) => <li key={r.slug}><ProductCard p={r} /></li>)}</ul>
        </section>
      )}
    </div>
  );
}
