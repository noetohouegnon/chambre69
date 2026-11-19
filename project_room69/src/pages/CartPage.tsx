import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Gift, Store, Truck, Check, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND, COUNTRY_OPTIONS, DIAL_CODES, STORES, ZONES } from '../data/site';
import { formatPrice } from '../data/catalog';
import { Img } from '../components/ui/Img';
import { WaButton } from '../components/ui/WaButton';
import { WhatsAppIcon } from '../components/ui/icons';
import { waLink, MESSAGES } from '../lib/whatsapp';
import { storage } from '../lib/storage';
import { track } from '../lib/analytics';
import { isEmail, isPhone, fullPhone } from '../lib/forms';

type Form = {
  mode: 'livraison' | 'retrait';
  store: string; visitDate: string;
  prenom: string; nom: string; dial: string; tel: string; email: string; whatsappOnly: boolean;
  gift: boolean; giftMessage: string; hidePrice: boolean; recipient: string; recipientDial: string; recipientTel: string;
  quartier: string; repere: string; ville: string;
  promo: string; note: string;
};
const EMPTY: Form = {
  mode: 'livraison', store: 'point-e', visitDate: '', prenom: '', nom: '', dial: '+221', tel: '', email: '', whatsappOnly: false,
  gift: false, giftMessage: '', hidePrice: true, recipient: '', recipientDial: '+221', recipientTel: '', quartier: '', repere: '', ville: '', promo: '', note: '',
};

const STEPS = ['Panier et pays', 'Coordonnées', 'Confirmation'];

export function CartPage() {
  const { items, setQty, remove, clear, country, setCountry, count } = useCart();
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<{ id: string; url: string } | null>(null);

  useEffect(() => { setF({ ...EMPTY, ...storage.getJSON<Partial<Form>>('c69-commande', {}) }); }, []);
  useEffect(() => { storage.setJSON('c69-commande', f); }, [f]);

  const zone = useMemo(() => ZONES.find((z) => z.id === COUNTRY_OPTIONS.find((c) => c.country === country)?.zone), [country]);
  const inSenegal = zone?.id === 'dakar' || zone?.id === 'senegal';
  const total = items.reduce((n, i) => n + (i.product.price || 0) * i.qty, 0);
  const allPriced = items.every((i) => i.product.price);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));

  if (sent) {
    return (
      <div className="container-x max-w-2xl py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold"><Check className="h-8 w-8" /></span>
        <h1 className="mt-6 font-serif text-4xl sm:text-5xl">Votre commande est prête à être envoyée</h1>
        <p className="lead mt-4">Numéro de commande : <strong className="text-gold">{sent.id}</strong></p>
        <p className="body-copy mx-auto mt-4">Si WhatsApp ne s’est pas ouvert, utilisez le bouton ci-dessous. Une conseillère confirme la disponibilité de chaque taille, le montant de la livraison et le délai, puis convient avec vous du règlement. Rien n’est expédié avant votre accord.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={sent.url} target="_blank" rel="noopener noreferrer" className="btn-wa"><WhatsAppIcon />Envoyer ma commande sur WhatsApp</a>
          <Link to="/boutique" className="btn-line">Continuer mes achats</Link>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-x max-w-2xl py-20 text-center">
        <h1 className="font-serif text-5xl">Votre panier</h1>
        <p className="lead mt-4">Votre panier est vide pour le moment.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/boutique" className="btn-gold">Découvrir la collection</Link>
          <WaButton message={MESSAGES.general} source="panier-vide" variant="line">Parler à une conseillère</WaButton>
        </div>
      </div>
    );
  }

  const validate2 = () => {
    const e: Record<string, string> = {};
    if (!f.prenom.trim()) e.prenom = 'Indiquez votre prénom.';
    if (!isPhone(f.tel)) e.tel = 'Indiquez un numéro de téléphone valide (au moins 7 chiffres).';
    if (f.email && !isEmail(f.email)) e.email = 'Cette adresse e-mail ne semble pas valide.';
    if (f.mode === 'livraison') {
      if (!f.quartier.trim()) e.quartier = 'Indiquez le quartier.';
      if (!f.ville.trim()) e.ville = 'Indiquez la ville.';
    } else if (!f.visitDate) e.visitDate = 'Indiquez la date prévue de votre passage.';
    if (f.gift && f.recipientTel && !isPhone(f.recipientTel)) e.recipientTel = 'Ce numéro ne semble pas valide.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const send = () => {
    const d = new Date();
    const id = `C69-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const lines = items.map((i, k) => `${k + 1}. ${i.product.name} — ${i.product.brand}\n   Réf. ${i.product.reference} · Taille ${i.size || 'unique'} · Quantité ${i.qty}${i.product.price ? ` · ${formatPrice(i.product.price * i.qty)}` : ''}`).join('\n');
    const msg = [
      `Bonjour Chambre 69, voici ma commande n° ${id}.`, '', lines, '',
      `Pays de livraison : ${country}`,
      f.mode === 'retrait'
        ? `Retrait en boutique : ${STORES.find((s) => s.id === f.store)?.district}, passage prévu le ${f.visitDate}`
        : `Adresse : ${f.quartier}${f.repere ? `, repère : ${f.repere}` : ''}, ${f.ville}, ${country}`,
      `Nom : ${f.prenom} ${f.nom}`.trim(),
      `Téléphone : ${fullPhone(f.dial, f.tel)}`,
      f.email ? `E-mail : ${f.email}` : null,
      f.whatsappOnly ? 'Merci de ne pas m’appeler : écrivez-moi sur WhatsApp uniquement.' : null,
      f.gift ? `Commande à offrir${f.recipient ? ` à ${f.recipient}` : ''}${f.recipientTel ? ` (tél. ${f.recipientDial} ${f.recipientTel})` : ''}. ${f.hidePrice ? 'Prix masqué sur le bon de livraison.' : ''}${f.giftMessage ? ` Message à joindre : « ${f.giftMessage} »` : ''}` : null,
      f.promo ? `Code avantage : ${f.promo}` : null,
      f.note ? `Remarque : ${f.note}` : null,
      '', 'Merci de me confirmer la disponibilité, les frais de livraison et le délai.',
    ].filter((l) => l !== null).join('\n');
    const url = waLink(msg);
    track('purchase_request', { id, items: count, country, zone: zone?.id, value: total || undefined });
    window.open(url, '_blank', 'noopener');
    setSent({ id, url });
    clear();
    storage.set('c69-commande', JSON.stringify({ ...f, gift: false, giftMessage: '', promo: '', note: '' }));
  };

  const err = (k: string) => errors[k] && <p id={`e-${k}`} className="mt-1.5 text-sm text-[#B3261E]">{errors[k]}</p>;
  const input = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`c-${k}`} className="label">{label}</label>
      <input id={`c-${k}`} className="field" value={f[k] as string} onChange={(e) => set(k, e.target.value as never)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `e-${k}` : undefined} {...props} />
      {err(k)}
    </div>
  );

  const Summary = (
    <aside className="card h-fit p-5 lg:sticky lg:top-40" aria-label="Récapitulatif">
      <h2 className="font-sans text-[15px] font-medium uppercase tracking-label text-gold">Récapitulatif</h2>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i.slug + i.size} className="flex gap-3 text-sm">
            <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-ink-3"><Img image={i.product.images[0]} alt="" sizes="48px" className="h-full w-full" /></div>
            <div className="min-w-0"><p className="truncate text-ivory">{i.product.name}</p><p className="text-mute">Taille {i.size || 'unique'} · × {i.qty}</p></div>
          </li>
        ))}
      </ul>
      <dl className="mt-5 space-y-2 border-t border-gold/10 pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-mute">Articles</dt><dd>{count}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-mute">Livraison</dt><dd className="text-right">{zone ? (f.mode === 'retrait' ? 'Retrait en boutique, sans frais' : 'Convenue avec votre conseillère') : 'Choisissez votre pays'}</dd></div>
        <div className="flex justify-between border-t border-gold/10 pt-2 text-base"><dt>Total</dt><dd>{allPriced && total ? formatPrice(total) : 'Confirmé par votre conseillère'}</dd></div>
      </dl>
      <p className="mt-4 flex gap-2 text-xs leading-relaxed text-mute"><Lock className="h-4 w-4 shrink-0" />Colis neutre, sans mention du contenu ni du nom de la boutique. Le règlement est convenu avec votre conseillère après confirmation.</p>
    </aside>
  );

  return (
    <div className="container-x pb-20 pt-8">
      <h1 className="font-serif text-4xl sm:text-5xl">Votre panier</h1>
      <ol className="mt-6 flex gap-2 text-sm" aria-label="Étapes de la commande">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex flex-1 flex-col gap-2 ${i <= step ? 'text-ivory' : 'text-mute'}`} aria-current={i === step ? 'step' : undefined}>
            <span className={`h-1 rounded-full ${i <= step ? 'bg-gold' : 'bg-ivory/15'}`} />
            <span><span className="text-gold">{i + 1}.</span> {s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          {step === 0 && (
            <>
              <ul className="divide-y divide-gold/10 border-y border-gold/10">
                {items.map((i) => (
                  <li key={i.slug + i.size} className="flex gap-4 py-5">
                    <Link to={`/boutique/${i.slug}`} className="h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-ink-3"><Img image={i.product.images[0]} alt={i.product.name} sizes="96px" className="h-full w-full" /></Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-xs uppercase tracking-label text-gold">{i.product.brand}</p>
                      <Link to={`/boutique/${i.slug}`} className="text-ivory hover:text-gold">{i.product.name}</Link>
                      <p className="mt-1 text-sm text-mute">Taille {i.size || 'unique'} · Réf. {i.product.reference}</p>
                      {i.product.price && <p className="mt-1 text-sm">{formatPrice(i.product.price)}</p>}
                      <div className="mt-auto flex items-center gap-3 pt-3">
                        <div className="flex items-center rounded-full border border-ivory/20">
                          <button onClick={() => setQty(i.slug, i.size, i.qty - 1)} className="inline-flex h-11 w-11 items-center justify-center" aria-label="Retirer un exemplaire"><Minus className="h-4 w-4" /></button>
                          <span className="w-6 text-center" aria-live="polite">{i.qty}</span>
                          <button onClick={() => setQty(i.slug, i.size, i.qty + 1)} className="inline-flex h-11 w-11 items-center justify-center" aria-label="Ajouter un exemplaire"><Plus className="h-4 w-4" /></button>
                        </div>
                        <button onClick={() => remove(i.slug, i.size)} className="inline-flex h-11 items-center gap-1.5 text-sm text-mute hover:text-ivory"><Trash2 className="h-4 w-4" />Retirer</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 card p-5">
                <label htmlFor="c-pays" className="label text-[15px] text-ivory">Pays de livraison</label>
                <select id="c-pays" className="field" value={country} onChange={(e) => setCountry(e.target.value)} aria-invalid={!!errors.pays} aria-describedby="c-pays-help">
                  <option value="">Choisir votre pays…</option>
                  {ZONES.map((z) => (
                    <optgroup key={z.id} label={z.label}>{z.countries.map((c) => <option key={c} value={c}>{c}</option>)}</optgroup>
                  ))}
                </select>
                <p id="c-pays-help" className="mt-2 text-sm text-mute">Il permet à votre conseillère de vous indiquer les frais et le délai. Votre pays n’est pas dans la liste ? <a className="text-gold hover:underline" href={waLink(MESSAGES.abroad())} target="_blank" rel="noopener noreferrer">Écrivez-nous</a>.</p>
                {err('pays')}
                {zone && (
                  <div className="mt-4 grid gap-2 rounded-xl bg-ink-3 p-4 text-sm sm:grid-cols-2">
                    <p className="sm:col-span-2"><span className="text-mute">Frais et délai : </span>convenus avec votre conseillère, sur WhatsApp ou par téléphone.</p>
                    {zone.notes.map((n) => <p key={n} className="text-ivory-2 sm:col-span-2">· {n}</p>)}
                  </div>
                )}
              </div>

              <details className="mt-4 text-sm">
                <summary className="inline-flex min-h-[44px] cursor-pointer items-center text-mute hover:text-ivory">Vous avez un code avantage ?</summary>
                <div className="mt-2 max-w-xs"><label htmlFor="c-promo" className="sr-only">Code avantage</label><input id="c-promo" className="field" value={f.promo} onChange={(e) => set('promo', e.target.value.toUpperCase())} placeholder="Votre code" /></div>
              </details>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="btn-gold px-8" onClick={() => { if (!country) { setErrors({ pays: 'Choisissez votre pays de livraison pour continuer.' }); return; } setErrors({}); if (!f.ville && zone?.id === 'dakar') set('ville', 'Dakar'); track('begin_checkout', { country }); setStep(1); }}>Continuer</button>
                <Link to="/boutique" className="btn-line">Continuer mes achats</Link>
              </div>
              <div className="mt-6"><WaButton message={MESSAGES.general} source="panier" variant="ghost">Une question avant de commander ? Parler à une conseillère</WaButton></div>
            </>
          )}

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); if (validate2()) setStep(2); }} noValidate className="space-y-8">
              <fieldset>
                <legend className="mb-3 text-[15px] font-medium">Mode de réception</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[{ v: 'livraison', icon: <Truck className="h-5 w-5" />, t: 'Livraison', d: country }, { v: 'retrait', icon: <Store className="h-5 w-5" />, t: 'Retrait en boutique', d: 'Point E ou Corniche Ouest, Dakar' }].map((o) => (
                    <label key={o.v} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${f.mode === o.v ? 'border-gold bg-gold/[0.06]' : 'border-ivory/15'}`}>
                      <input type="radio" name="mode" className="sr-only" checked={f.mode === o.v} onChange={() => set('mode', o.v as Form['mode'])} />
                      <span className="text-gold">{o.icon}</span><span><span className="block text-ivory">{o.t}</span><span className="text-sm text-mute">{o.d}</span></span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {f.mode === 'retrait' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-store" className="label">Boutique</label>
                    <select id="c-store" className="field" value={f.store} onChange={(e) => set('store', e.target.value)}>{STORES.map((s) => <option key={s.id} value={s.id}>{s.district}, Dakar</option>)}</select>
                  </div>
                  {input('visitDate', 'Date prévue de votre passage', { type: 'date' })}
                  <p className="text-sm text-mute sm:col-span-2">Nous mettons vos pièces de côté jusqu’à votre passage. Pratique pendant un séjour à Dakar : vous essayez sur place et échangez si besoin.</p>
                </div>
              ) : (
                <fieldset className="grid gap-4 sm:grid-cols-2">
                  <legend className="mb-3 text-[15px] font-medium sm:col-span-2">Adresse de livraison</legend>
                  {input('quartier', 'Quartier', { autoComplete: 'address-level3' })}
                  {input('repere', 'Repère (facultatif)', { placeholder: 'Ex. : près de la pharmacie…' })}
                  {input('ville', 'Ville', { autoComplete: 'address-level2' })}
                  <div><span className="label">Pays</span><p className="field flex items-center text-ivory-2">{country}</p></div>
                </fieldset>
              )}

              <fieldset className="grid gap-4 sm:grid-cols-2">
                <legend className="mb-3 text-[15px] font-medium sm:col-span-2">Vos coordonnées</legend>
                {input('prenom', 'Prénom', { autoComplete: 'given-name' })}
                {input('nom', 'Nom (facultatif)', { autoComplete: 'family-name' })}
                <div className="sm:col-span-2">
                  <label htmlFor="c-tel" className="label">Téléphone</label>
                  <div className="flex gap-2">
                    <select aria-label="Indicatif" className="field w-[8.5rem] shrink-0" value={f.dial} onChange={(e) => set('dial', e.target.value)}>{DIAL_CODES.map((d) => <option key={d.code + d.label} value={d.code}>{d.label}</option>)}</select>
                    <input id="c-tel" type="tel" inputMode="tel" autoComplete="tel-national" className="field" value={f.tel} onChange={(e) => set('tel', e.target.value)} aria-invalid={!!errors.tel} aria-describedby={errors.tel ? 'e-tel' : undefined} />
                  </div>
                  {err('tel')}
                </div>
                {input('email', 'E-mail (facultatif)', { type: 'email', inputMode: 'email', autoComplete: 'email' })}
                <label className="flex items-start gap-3 self-end text-sm text-ivory-2">
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-[#5A1725]" checked={f.whatsappOnly} onChange={(e) => set('whatsappOnly', e.target.checked)} />
                  Ne pas m’appeler : écrire sur WhatsApp uniquement
                </label>
              </fieldset>

              <fieldset className="card p-5">
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-[#5A1725]" checked={f.gift} onChange={(e) => set('gift', e.target.checked)} />
                  <span><span className="flex items-center gap-2 text-ivory"><Gift className="h-4 w-4 text-gold" />Commande à offrir</span><span className="text-sm text-mute">Vous payez d’où vous êtes, nous livrons chez elle. Idéal pour faire livrer une femme restée au pays.</span></span>
                </label>
                {f.gift && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {input('recipient', 'Prénom de la destinataire')}
                    <div>
                      <label htmlFor="c-recipientTel" className="label">Téléphone de la destinataire</label>
                      <div className="flex gap-2">
                        <select aria-label="Indicatif de la destinataire" className="field w-[8.5rem] shrink-0" value={f.recipientDial} onChange={(e) => set('recipientDial', e.target.value)}>{DIAL_CODES.map((d) => <option key={d.code + d.label} value={d.code}>{d.label}</option>)}</select>
                        <input id="c-recipientTel" type="tel" inputMode="tel" className="field" value={f.recipientTel} onChange={(e) => set('recipientTel', e.target.value)} />
                      </div>
                      {err('recipientTel')}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="c-giftMessage" className="label">Message à joindre (facultatif)</label>
                      <textarea id="c-giftMessage" className="field min-h-[96px]" maxLength={300} value={f.giftMessage} onChange={(e) => set('giftMessage', e.target.value)} />
                    </div>
                    <label className="flex items-start gap-3 text-sm text-ivory-2 sm:col-span-2">
                      <input type="checkbox" className="mt-1 h-5 w-5 accent-[#5A1725]" checked={f.hidePrice} onChange={(e) => set('hidePrice', e.target.checked)} />
                      Masquer le prix sur le bon de livraison
                    </label>
                    <p className="text-sm text-mute sm:col-span-2">Nous vous prévenons par WhatsApp quand elle l’a reçu.</p>
                  </div>
                )}
              </fieldset>

              <div>
                <label htmlFor="c-note" className="label">Une précision pour votre conseillère (facultatif)</label>
                <textarea id="c-note" className="field min-h-[88px]" value={f.note} onChange={(e) => set('note', e.target.value)} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" className="btn-line" onClick={() => setStep(0)}><ArrowLeft className="h-4 w-4" />Retour</button>
                <button type="submit" className="btn-gold px-8">Vérifier ma commande</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-3xl">Vérifiez avant d’envoyer</h2>
              <dl className="mt-6 space-y-3 text-[15px]">
                <div><dt className="text-mute">Réception</dt><dd>{f.mode === 'retrait' ? `Retrait à la boutique ${STORES.find((s) => s.id === f.store)?.district}, le ${f.visitDate}` : `${f.quartier}${f.repere ? ` (${f.repere})` : ''}, ${f.ville}, ${country}`}</dd></div>
                <div><dt className="text-mute">Contact</dt><dd>{f.prenom} {f.nom} · {fullPhone(f.dial, f.tel)}{f.email ? ` · ${f.email}` : ''}{f.whatsappOnly ? ' · WhatsApp uniquement' : ''}</dd></div>
                {f.gift && <div><dt className="text-mute">Commande à offrir</dt><dd>{f.recipient || 'Destinataire'}{f.hidePrice ? ' · prix masqué' : ''}{f.giftMessage ? ` · « ${f.giftMessage} »` : ''}</dd></div>}
              </dl>
              <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/[0.05] p-5 text-[15px] leading-relaxed text-ivory-2">
                <p className="text-ivory">Comment se passe la suite</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Votre commande part sur WhatsApp, déjà rédigée, vers notre numéro {inSenegal ? '' : '(joignable depuis l’étranger) '}{BRAND.whatsappDisplay}.</li>
                  <li>Une conseillère confirme chaque taille, les frais et le délai.</li>
                  <li>Vous convenez ensemble du règlement. Rien n’est expédié avant votre accord.</li>
                </ol>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="btn-line" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" />Modifier</button>
                <button className="btn-wa px-8" onClick={send}><WhatsAppIcon />Envoyer ma commande sur WhatsApp</button>
              </div>
            </div>
          )}
        </div>
        {Summary}
      </div>
    </div>
  );
}
