import { useState } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRY_OPTIONS } from '../data/site';
import { isEmail, sendForm } from '../lib/forms';

/** Capture de contact (2.1 bloc 5, 9.3) — jamais en fenêtre surgissante. */
export function Newsletter({ id = 'nl' }: { id?: string }) {
  const [f, setF] = useState({ prenom: '', email: '', whatsapp: '', pays: '', ok: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<null | 'sent' | 'whatsapp'>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.prenom.trim()) er.prenom = 'Indiquez votre prénom.';
    if (!isEmail(f.email)) er.email = 'Indiquez une adresse e-mail valide, par exemple aminata@exemple.com.';
    if (!f.pays) er.pays = 'Choisissez votre pays.';
    if (!f.ok) er.ok = 'Cochez la case pour confirmer votre inscription.';
    setErrors(er);
    if (Object.keys(er).length) return;
    const res = await sendForm('inscription', { prenom: f.prenom, email: f.email, whatsapp: f.whatsapp, pays: f.pays },
      `Bonjour Chambre 69, je souhaite recevoir votre guide des tailles et vos nouveautés.\nPrénom : ${f.prenom}\nE-mail : ${f.email}${f.whatsapp ? `\nWhatsApp : ${f.whatsapp}` : ''}\nPays : ${f.pays}\nJ'accepte de recevoir les actualités de Chambre 69.`);
    setDone(res);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-gold/25 bg-gold/[0.05] p-5" role="status">
        <p className="font-serif text-2xl text-ivory">Merci {f.prenom}.</p>
        <p className="mt-2 text-sm text-ivory-2">{done === 'sent' ? 'Votre inscription est enregistrée. Le guide des tailles arrive dans votre boîte.' : 'Votre demande d’inscription a été préparée sur WhatsApp : il ne reste qu’à l’envoyer.'}</p>
      </div>
    );
  }

  const err = (k: string) => errors[k] && <p id={`${id}-${k}-e`} className="mt-1.5 text-sm text-[#F2A999]">{errors[k]}</p>;
  return (
    <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-prenom`} className="label">Prénom</label>
        <input id={`${id}-prenom`} className="field" autoComplete="given-name" value={f.prenom} onChange={(e) => setF({ ...f, prenom: e.target.value })} aria-invalid={!!errors.prenom} aria-describedby={errors.prenom ? `${id}-prenom-e` : undefined} />
        {err('prenom')}
      </div>
      <div>
        <label htmlFor={`${id}-email`} className="label">Adresse e-mail</label>
        <input id={`${id}-email`} type="email" inputMode="email" className="field" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-e` : undefined} />
        {err('email')}
      </div>
      <div>
        <label htmlFor={`${id}-wa`} className="label">Numéro WhatsApp <span className="text-mute">(facultatif)</span></label>
        <input id={`${id}-wa`} type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="+221 …" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} />
      </div>
      <div>
        <label htmlFor={`${id}-pays`} className="label">Pays</label>
        <select id={`${id}-pays`} className="field" value={f.pays} onChange={(e) => setF({ ...f, pays: e.target.value })} aria-invalid={!!errors.pays} aria-describedby={errors.pays ? `${id}-pays-e` : undefined}>
          <option value="">Choisir…</option>
          {COUNTRY_OPTIONS.map((c) => <option key={c.country} value={c.country}>{c.country}</option>)}
          <option value="Autre pays">Autre pays</option>
        </select>
        {err('pays')}
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-ivory-2">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[#C9A96E]" checked={f.ok} onChange={(e) => setF({ ...f, ok: e.target.checked })} aria-invalid={!!errors.ok} />
          <span>J’accepte de recevoir les actualités de Chambre 69. <Link to="/confidentialite" className="text-gold underline-offset-2 hover:underline">Confidentialité</Link></span>
        </label>
        {err('ok')}
      </div>
      <div className="sm:col-span-2"><button type="submit" className="btn-gold w-full sm:w-auto">Je m’inscris</button></div>
    </form>
  );
}
