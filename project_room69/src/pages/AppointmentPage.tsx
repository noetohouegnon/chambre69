import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PageHero, Section } from '../components/ui/Section';
import { STORES, DIAL_CODES } from '../data/site';
import { BY_SLUG } from '../data/catalog';
import { pieceLink } from '../lib/whatsapp';
import { isPhone, sendForm, fullPhone } from '../lib/forms';
import { track } from '../lib/analytics';

/** Quatre chemins vers la boutique, chacun avec son créneau et sa durée (4.6, 2.12, 5 ter). */
export const APPOINTMENTS = [
  { id: 'mesures', label: 'Prise de mesures', duration: '20 minutes', desc: 'Gratuite et sans obligation d’achat, en salon fermé.' },
  { id: 'essayage', label: 'Réserver pour essayage', duration: '30 minutes', desc: 'Vos pièces choisies en ligne, mises de côté dans votre taille.' },
  { id: 'trousseau', label: 'Rendez-vous trousseau', duration: '1 heure', desc: 'En salon fermé, accompagnée de qui vous voulez.' },
  { id: 'prive', label: 'Rendez-vous privé après mastectomie', duration: 'Créneau long, sans limite', desc: 'Salon fermé, conseillère formée à cet accompagnement.' },
];
const SLOTS = ['Matin', 'Début d’après-midi', 'Fin d’après-midi'];

export function AppointmentPage() {
  const [sp] = useSearchParams();
  const piece = sp.get('piece') ? BY_SLUG.get(sp.get('piece')!) : undefined;
  const [f, setF] = useState({ type: 'mesures', store: 'point-e', date: '', slot: SLOTS[0], prenom: '', dial: '+221', tel: '', accompagnee: false, whatsappOnly: true, note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = sp.get('type');
    if (t && APPOINTMENTS.some((a) => a.id === t)) setF((x) => ({ ...x, type: t }));
  }, [sp]);

  const type = APPOINTMENTS.find((a) => a.id === f.type)!;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.prenom.trim()) er.prenom = 'Indiquez votre prénom.';
    if (!isPhone(f.tel)) er.tel = 'Indiquez un numéro de téléphone valide.';
    if (!f.date) er.date = 'Choisissez une date.';
    setErrors(er);
    if (Object.keys(er).length) return;
    track('appointment_request', { type: f.type, store: f.store });
    const store = STORES.find((s) => s.id === f.store)!;
    await sendForm('rendez-vous', { ...f, accompagnee: String(f.accompagnee), whatsappOnly: String(f.whatsappOnly), piece: piece?.reference || '' },
      [
        `Bonjour Chambre 69, je souhaite prendre rendez-vous : ${type.label} (${type.duration}).`,
        `Boutique : ${store.district}`,
        `Date souhaitée : ${new Date(f.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}, ${f.slot.toLowerCase()}`,
        piece ? `Pièce à essayer : ${piece.name} — réf. ${piece.reference}${sp.get('taille') ? `, taille ${sp.get('taille')}` : ''}\n${pieceLink(piece.slug)}` : '',
        `Prénom : ${f.prenom} · Téléphone : ${fullPhone(f.dial, f.tel)}`,
        f.accompagnee ? 'Je viendrai accompagnée.' : '',
        f.whatsappOnly ? 'Merci de me répondre sur WhatsApp plutôt que par appel.' : '',
        f.note ? `Précision : ${f.note}` : '',
      ].filter(Boolean).join('\n'));
    setDone(true);
  };

  const err = (k: string) => errors[k] && <p id={`a-${k}-e`} className="mt-1.5 text-sm text-[#B3261E]">{errors[k]}</p>;

  return (
    <>
      <PageHero eyebrow="Rendez-vous" title="Prendre rendez-vous en boutique" crumbs={[{ label: 'Prendre rendez-vous' }]}>
        <p>Choisissez le type de rendez-vous, la boutique et votre créneau. Une conseillère vous confirme l’horaire exact sur WhatsApp.</p>
      </PageHero>
      <Section>
        {done ? (
          <div className="mx-auto max-w-xl text-center" role="status">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold"><Check className="h-8 w-8" /></span>
            <h2 className="mt-6 font-serif text-4xl">Votre demande est prête</h2>
            <p className="mt-4 text-ivory-2">Elle a été préparée sur WhatsApp : envoyez le message, et une conseillère vous confirme le créneau. Vous pouvez venir accompagnée, et repartir sans rien acheter.</p>
            <Link to="/conseils/rendez-vous-prise-de-mesures" className="btn-line mt-8">Comment se passe le rendez-vous</Link>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto grid max-w-3xl gap-8">
            <fieldset>
              <legend className="mb-4 font-serif text-3xl">Type de rendez-vous</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {APPOINTMENTS.map((a) => (
                  <label key={a.id} className={`cursor-pointer rounded-2xl border p-5 ${f.type === a.id ? 'border-gold bg-gold/[0.06]' : 'border-ivory/15 hover:border-gold/50'}`}>
                    <input type="radio" name="type" className="sr-only" checked={f.type === a.id} onChange={() => setF({ ...f, type: a.id })} />
                    <span className="block text-ivory">{a.label}</span>
                    <span className="mt-1 block text-sm text-gold">{a.duration}</span>
                    <span className="mt-1 block text-sm text-mute">{a.desc}</span>
                  </label>
                ))}
              </div>
              {piece && <p className="mt-4 text-sm text-ivory-2">Pièce à essayer : <Link to={`/boutique/${piece.slug}`} className="text-gold hover:underline">{piece.name}</Link>{sp.get('taille') ? `, taille ${sp.get('taille')}` : ''}</p>}
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="a-store" className="label">Boutique</label>
                <select id="a-store" className="field" value={f.store} onChange={(e) => setF({ ...f, store: e.target.value })}>{STORES.map((s) => <option key={s.id} value={s.id}>{s.district}, Dakar</option>)}</select>
              </div>
              <div>
                <label htmlFor="a-date" className="label">Date souhaitée</label>
                <input id="a-date" type="date" className="field" value={f.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setF({ ...f, date: e.target.value })} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'a-date-e' : undefined} />
                {err('date')}
              </div>
              <div>
                <label htmlFor="a-slot" className="label">Moment de la journée</label>
                <select id="a-slot" className="field" value={f.slot} onChange={(e) => setF({ ...f, slot: e.target.value })}>{SLOTS.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="a-prenom" className="label">Prénom</label>
                <input id="a-prenom" className="field" autoComplete="given-name" value={f.prenom} onChange={(e) => setF({ ...f, prenom: e.target.value })} aria-invalid={!!errors.prenom} aria-describedby={errors.prenom ? 'a-prenom-e' : undefined} />
                {err('prenom')}
              </div>
              <div>
                <label htmlFor="a-tel" className="label">Téléphone</label>
                <div className="flex gap-2">
                  <select aria-label="Indicatif" className="field w-[8.5rem] shrink-0" value={f.dial} onChange={(e) => setF({ ...f, dial: e.target.value })}>{DIAL_CODES.map((d) => <option key={d.label} value={d.code}>{d.label}</option>)}</select>
                  <input id="a-tel" type="tel" inputMode="tel" autoComplete="tel-national" className="field" value={f.tel} onChange={(e) => setF({ ...f, tel: e.target.value })} aria-invalid={!!errors.tel} aria-describedby={errors.tel ? 'a-tel-e' : undefined} />
                </div>
                {err('tel')}
              </div>
              <label className="flex items-start gap-3 text-sm text-ivory-2"><input type="checkbox" className="mt-1 h-5 w-5 accent-[#5A1725]" checked={f.accompagnee} onChange={(e) => setF({ ...f, accompagnee: e.target.checked })} />Je viendrai accompagnée</label>
              <label className="flex items-start gap-3 text-sm text-ivory-2"><input type="checkbox" className="mt-1 h-5 w-5 accent-[#5A1725]" checked={f.whatsappOnly} onChange={(e) => setF({ ...f, whatsappOnly: e.target.checked })} />Me répondre sur WhatsApp plutôt que par appel</label>
              <div className="sm:col-span-2">
                <label htmlFor="a-note" className="label">Une précision (facultatif)</label>
                <textarea id="a-note" className="field min-h-[90px]" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
                <p className="mt-1.5 text-sm text-mute">Vous n’avez rien à justifier. Écrivez seulement ce que vous souhaitez nous dire.</p>
              </div>
            </div>
            <button type="submit" className="btn-gold w-full sm:w-auto sm:px-10">Demander ce rendez-vous</button>
          </form>
        )}
      </Section>
    </>
  );
}
