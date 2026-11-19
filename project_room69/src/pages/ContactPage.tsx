import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { PageHero, Section } from '../components/ui/Section';
import { WaButton } from '../components/ui/WaButton';
import { BRAND, DIAL_CODES } from '../data/site';
import { MESSAGES } from '../lib/whatsapp';
import { isEmail, isPhone, sendForm } from '../lib/forms';

export function ContactPage() {
  const [f, setF] = useState({ prenom: '', email: '', dial: '+221', tel: '', sujet: 'Une question sur une taille', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.prenom.trim()) er.prenom = 'Indiquez votre prénom.';
    if (!isEmail(f.email) && !isPhone(f.tel)) er.email = 'Indiquez au moins une adresse e-mail ou un numéro de téléphone pour que nous puissions vous répondre.';
    if (f.message.trim().length < 5) er.message = 'Écrivez votre message.';
    setErrors(er);
    if (Object.keys(er).length) return;
    await sendForm('contact', f, `Bonjour Chambre 69,\nSujet : ${f.sujet}\n\n${f.message}\n\n${f.prenom}${f.email ? ` · ${f.email}` : ''}${f.tel ? ` · ${f.dial} ${f.tel}` : ''}`);
    setDone(true);
  };
  const err = (k: string) => errors[k] && <p id={`ct-${k}-e`} className="mt-1.5 text-sm text-[#B3261E]">{errors[k]}</p>;
  return (
    <>
      <PageHero eyebrow="Contact" title="Nous contacter" crumbs={[{ label: 'Contact' }]}>
        <p>Le plus simple, c’est WhatsApp : une conseillère vous répond, y compris depuis l’étranger. Vous pouvez aussi nous écrire ci-dessous.</p>
      </PageHero>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <WaButton message={MESSAGES.general} source="contact" className="w-full sm:w-auto">Parler à une conseillère</WaButton>
            <ul className="space-y-4 text-ivory-2">
              <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-gold" /><span><a href={BRAND.phoneHref} className="text-ivory hover:text-gold">{BRAND.whatsappDisplay}</a><br /><span className="text-sm text-mute">WhatsApp et appels. Le numéro fonctionne depuis l’étranger comme un numéro ordinaire.</span></span></li>
              <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-gold" /><a href={`mailto:${BRAND.email}`} className="text-ivory hover:text-gold">{BRAND.email}</a></li>
              <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-gold" /><span>Nous répondons sous 24 heures.</span></li>
              <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-gold" /><span>Boutiques Point E et Corniche Ouest, Dakar. <Link to="/nos-boutiques" className="text-gold hover:underline">Adresses et itinéraires</Link></span></li>
            </ul>
          </div>
          {done ? (
            <div className="card p-8" role="status"><h2 className="font-serif text-3xl">Merci {f.prenom}</h2><p className="mt-3 text-ivory-2">Votre message est prêt sur WhatsApp. Nous vous répondons sous 24 heures.</p></div>
          ) : (
            <form onSubmit={submit} noValidate className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
              <div>
                <label htmlFor="ct-prenom" className="label">Prénom</label>
                <input id="ct-prenom" className="field" autoComplete="given-name" value={f.prenom} onChange={(e) => setF({ ...f, prenom: e.target.value })} aria-invalid={!!errors.prenom} aria-describedby={errors.prenom ? 'ct-prenom-e' : undefined} />{err('prenom')}
              </div>
              <div>
                <label htmlFor="ct-email" className="label">Adresse e-mail</label>
                <input id="ct-email" type="email" inputMode="email" autoComplete="email" className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'ct-email-e' : undefined} />{err('email')}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ct-tel" className="label">Téléphone (facultatif)</label>
                <div className="flex gap-2">
                  <select aria-label="Indicatif" className="field w-[8.5rem] shrink-0" value={f.dial} onChange={(e) => setF({ ...f, dial: e.target.value })}>{DIAL_CODES.map((d) => <option key={d.label} value={d.code}>{d.label}</option>)}</select>
                  <input id="ct-tel" type="tel" inputMode="tel" className="field" value={f.tel} onChange={(e) => setF({ ...f, tel: e.target.value })} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ct-sujet" className="label">Sujet</label>
                <select id="ct-sujet" className="field" value={f.sujet} onChange={(e) => setF({ ...f, sujet: e.target.value })}>
                  {['Une question sur une taille', 'Une commande', 'Une livraison hors Sénégal', 'Un rendez-vous', 'Après une mastectomie', 'Presse et partenariats', 'Autre'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ct-message" className="label">Message</label>
                <textarea id="ct-message" className="field min-h-[140px]" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'ct-message-e' : undefined} />{err('message')}
              </div>
              <div className="sm:col-span-2"><button type="submit" className="btn-gold">Envoyer</button></div>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
