import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Trash2, Copy, Check, Gift, Users } from 'lucide-react';
import { useList, encodeList, decodeList, type TrousseauList } from '../context/ListContext';
import { BY_SLUG, PRODUCTS, productUrl } from '../data/catalog';
import { SITE_URL } from '../data/site';
import { Breadcrumbs } from '../components/ui/Section';
import { Img } from '../components/ui/Img';
import { WhatsAppIcon } from '../components/ui/icons';
import { waLink, waShare, pieceLink } from '../lib/whatsapp';
import { track } from '../lib/analytics';

function ContributorView({ list, code }: { list: TrousseauList; code: string }) {
  const [reserving, setReserving] = useState<string | null>(null);
  const [mode, setMode] = useState<'seule' | 'plusieurs'>('seule');
  const [giver, setGiver] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState<string[]>([]);
  const name = list.name || 'la mariée';

  const reserve = (slug: string) => {
    const p = BY_SLUG.get(slug)!;
    const item = list.items.find((i) => i.slug === slug)!;
    const msg = `Bonjour Chambre 69, je souhaite ${mode === 'plusieurs' ? 'participer, à plusieurs,' : 'offrir'} une pièce de la liste de trousseau de ${name} (liste ${code.slice(0, 10)}) :\n${p.name} — ${p.brand}, réf. ${p.reference}${item.size ? `, taille ${item.size}` : ''}.\n${pieceLink(p.slug)}\nDe la part de : ${giver || '—'}${note ? `\nMon message pour elle : « ${note} »` : ''}\nMerci de la mettre de côté.`;
    track('trousseau_reserve', { item: slug, mode });
    window.open(waLink(msg), '_blank', 'noopener');
    setDone((d) => [...d, slug]);
    setReserving(null); setNote('');
  };

  return (
    <div className="container-x max-w-4xl pb-20 pt-10">
      <p className="eyebrow">Liste de trousseau</p>
      <h1 className="h-display mt-4">La liste de {name}</h1>
      <div className="lead mt-5 space-y-3">
        <p>{list.name || 'Elle'} se marie. Voici ce qu’elle a choisi, dans sa taille.</p>
        <p>Réservez une pièce : elle disparaîtra de la liste pour que personne n’offre la même chose. Vous pouvez aussi vous mettre à plusieurs sur une pièce.</p>
        <p>Tout sera livré ensemble, ou gardé en boutique jusqu’à ce qu’elle vienne.</p>
      </div>
      {list.date && <p className="mt-4 text-sm text-mute">Liste ouverte jusqu’au {new Date(list.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>}

      <ul className="mt-10 divide-y divide-gold/10 border-y border-gold/10">
        {list.items.map((it) => {
          const p = BY_SLUG.get(it.slug)!;
          const isDone = done.includes(it.slug);
          return (
            <li key={it.slug} className="py-6">
              <div className="flex gap-4">
                <Link to={productUrl(p)} className="h-36 w-28 shrink-0 overflow-hidden rounded-lg bg-ink-3"><Img image={p.images[0]} alt={p.name} sizes="112px" className="h-full w-full" /></Link>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-label text-gold">{p.brand}</p>
                  <p className="text-ivory">{p.name}</p>
                  <p className="text-sm text-mute">{it.size ? `Taille ${it.size}` : 'Taille confirmée avec la boutique'}</p>
                  {isDone ? (
                    <p className="mt-4 flex items-center gap-2 text-gold"><Check className="h-4 w-4" />C’est réservé — confirmation en cours sur WhatsApp</p>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="btn-gold min-h-[44px] px-5 text-sm" onClick={() => { setMode('seule'); setReserving(it.slug); }}><Gift className="h-4 w-4" />Réserver</button>
                      <button className="btn-line min-h-[44px] px-5 text-sm" onClick={() => { setMode('plusieurs'); setReserving(it.slug); }}><Users className="h-4 w-4" />Participer à plusieurs</button>
                    </div>
                  )}
                </div>
              </div>
              {reserving === it.slug && (
                <form className="mt-5 grid gap-4 rounded-2xl border border-gold/20 bg-ink-2 p-5" onSubmit={(e) => { e.preventDefault(); reserve(it.slug); }}>
                  <div>
                    <label htmlFor="giver" className="label">Votre prénom</label>
                    <input id="giver" className="field" value={giver} onChange={(e) => setGiver(e.target.value)} autoComplete="given-name" />
                  </div>
                  <div>
                    <label htmlFor="gnote" className="label">Un mot pour elle (facultatif)</label>
                    <textarea id="gnote" className="field min-h-[90px]" maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} />
                    <p className="mt-1.5 text-sm text-mute">Votre message lui sera remis avec la pièce.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="btn-wa"><WhatsAppIcon />{mode === 'plusieurs' ? 'Participer' : 'Réserver'} sur WhatsApp</button>
                    <button type="button" className="btn-line" onClick={() => setReserving(null)}>Annuler</button>
                  </div>
                </form>
              )}
            </li>
          );
        })}
      </ul>

      {done.length > 0 && (
        <div className="mt-10 card p-6" role="status">
          <h2 className="font-serif text-3xl">C’est réservé</h2>
          <p className="mt-3 text-ivory-2">Dès que vous avez envoyé le message WhatsApp, votre pièce est mise de côté et retirée de la liste de {name}. Nous lui remettrons votre message avec.</p>
          <p className="mt-2 text-ivory-2">Si vous souhaitez ajouter quelque chose pour vous, nous pouvons tout expédier ensemble.</p>
          <Link to="/boutique" className="btn-line mt-5">Voir la boutique</Link>
        </div>
      )}
    </div>
  );
}

export function TrousseauListPage() {
  const [sp] = useSearchParams();
  const code = sp.get('l');
  const [shared, setShared] = useState<TrousseauList | null>(null);
  const [mounted, setMounted] = useState(false);
  const { list, update, toggle } = useList();
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { setMounted(true); if (code) setShared(decodeList(code)); }, [code]);

  const link = useMemo(() => (mounted && list.items.length ? `${SITE_URL}/mariee/liste?l=${encodeList(list)}` : ''), [list, mounted]);
  useEffect(() => {
    setMsg(`Bonjour, voici ma liste de trousseau chez Chambre 69. Si vous souhaitez m’offrir quelque chose, tout est là, dans ma taille : ${link || '[lien]'}. Merci du fond du cœur.`);
  }, [link]);

  if (code && shared) return <ContributorView list={shared} code={code} />;
  if (code && mounted && !shared) {
    return <div className="container-x py-20 text-center"><h1 className="font-serif text-4xl">Ce lien de liste semble incomplet</h1><p className="mt-4 text-ivory-2">Demandez à la mariée de vous le renvoyer, ou écrivez-nous.</p></div>;
  }

  const suggestions = PRODUCTS.filter((p) => p.lines.includes('trousseau') && p.category !== 'bien-etre' && !list.items.some((i) => i.slug === p.slug)).slice(0, 8);

  return (
    <div className="container-x pb-20 pt-8">
      <Breadcrumbs items={[{ label: 'Mariée', to: '/mariee' }, { label: 'Ma liste de trousseau' }]} />
      <h1 className="h-display mt-6">Votre liste de trousseau</h1>
      <p className="lead mt-4 max-w-prose">Composez votre liste, partagez-la à celles qui veulent vous faire plaisir, et laissez-les choisir. Pas besoin de créer un compte : vous recevez un lien, et ce lien est votre liste.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="l-name" className="label">Votre prénom</label>
              <input id="l-name" className="field" value={list.name} onChange={(e) => update({ name: e.target.value })} autoComplete="given-name" />
            </div>
            <div>
              <label htmlFor="l-date" className="label">Clôture de la liste</label>
              <input id="l-date" type="date" className="field" value={list.date} onChange={(e) => update({ date: e.target.value })} />
            </div>
            <label className="flex items-start gap-3 text-sm text-ivory-2 sm:col-span-2">
              <input type="checkbox" className="mt-1 h-5 w-5 accent-[#5A1725]" checked={list.hideGivers} onChange={(e) => update({ hideGivers: e.target.checked })} />
              Ne pas voir qui a offert quoi avant le jour venu
            </label>
          </div>

          <h2 className="mt-10 font-serif text-3xl">Les pièces choisies ({list.items.length})</h2>
          {list.items.length === 0 ? (
            <p className="mt-4 text-ivory-2">Votre liste est vide. Ajoutez des pièces depuis une fiche produit (« Ajouter à ma liste de trousseau »), ou parmi nos suggestions ci-dessous.</p>
          ) : (
            <ul className="mt-6 divide-y divide-gold/10 border-y border-gold/10">
              {list.items.map((it) => {
                const p = BY_SLUG.get(it.slug);
                if (!p) return null;
                return (
                  <li key={it.slug} className="flex items-center gap-4 py-4">
                    <Link to={productUrl(p)} className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-3"><Img image={p.images[0]} alt={p.name} sizes="80px" className="h-full w-full" /></Link>
                    <div className="min-w-0 flex-1"><p className="text-xs uppercase tracking-label text-gold">{p.brand}</p><p className="truncate">{p.name}</p><p className="text-sm text-mute">{it.size ? `Taille ${it.size}` : <Link to={productUrl(p)} className="text-gold hover:underline">Préciser la taille</Link>}</p></div>
                    <button onClick={() => toggle(it)} className="inline-flex h-11 w-11 items-center justify-center text-mute hover:text-ivory" aria-label={`Retirer ${p.name}`}><Trash2 className="h-5 w-5" /></button>
                  </li>
                );
              })}
            </ul>
          )}

          <h2 className="mt-14 font-serif text-3xl">Suggestions pour le trousseau</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {suggestions.map((p) => (
              <li key={p.slug}>
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-ink-3"><Img image={p.images[0]} alt={p.name} className="h-full w-full" /></div>
                <p className="mt-2 text-sm">{p.name}</p>
                <button className="btn-ghost text-sm" onClick={() => toggle({ slug: p.slug, size: '' })}>+ Ajouter</button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-40">
          <h2 className="font-serif text-3xl">Partager ma liste</h2>
          {list.items.length === 0 ? (
            <p className="mt-3 text-sm text-mute">Ajoutez au moins une pièce pour obtenir votre lien.</p>
          ) : (
            <>
              <label htmlFor="l-msg" className="label mt-4">Message (modifiable)</label>
              <textarea id="l-msg" className="field min-h-[150px] text-sm" value={msg} onChange={(e) => setMsg(e.target.value)} />
              <a href={waShare(msg)} target="_blank" rel="noopener noreferrer" onClick={() => track('trousseau_share', { items: list.items.length })} className="btn-wa mt-4 w-full"><WhatsAppIcon />Partager ma liste</a>
              <button className="btn-line mt-3 w-full" onClick={() => { navigator.clipboard?.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}>
                {copied ? <><Check className="h-4 w-4" />Lien copié</> : <><Copy className="h-4 w-4" />Copier le lien</>}
              </button>
              <p className="mt-4 text-xs leading-relaxed text-mute">Chaque réservation est transmise à une conseillère, qui met la pièce de côté. Le retrait automatique des pièces réservées et les notifications à la mariée seront activés avec l’espace d’administration.</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
