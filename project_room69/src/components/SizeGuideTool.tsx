import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ruler } from 'lucide-react';
import { computeSize, type SizeResult } from '../lib/sizing';
import { WaButton } from './ui/WaButton';
import { MESSAGES } from '../lib/whatsapp';
import { storage } from '../lib/storage';

/** Schéma neutre (aucune photographie de corps, 2.5). */
function Diagram({ level }: { level: 'under' | 'bust' }) {
  const y = level === 'under' ? 118 : 92;
  return (
    <svg viewBox="0 0 200 180" className="mx-auto h-40 w-auto" role="img" aria-label={level === 'under' ? 'Schéma : mètre ruban sous la poitrine' : 'Schéma : mètre ruban au niveau le plus fort de la poitrine'}>
      <path d="M60 20 C60 50 40 60 42 100 C44 140 56 160 60 175 M140 20 C140 50 160 60 158 100 C156 140 144 160 140 175" fill="none" stroke="#ADA496" strokeWidth="2" />
      <path d="M66 82 C70 112 96 116 100 100 C104 116 130 112 134 82" fill="none" stroke="#ADA496" strokeWidth="1.5" opacity="0.7" />
      <ellipse cx="100" cy={y} rx="62" ry="9" fill="none" stroke="#C9A96E" strokeWidth="3" strokeDasharray="5 4" />
      <text x="100" y={y - 16} textAnchor="middle" fill="#C9A96E" fontSize="11" fontFamily="Jost, sans-serif">{level === 'under' ? 'tour de dos' : 'tour de poitrine'}</text>
    </svg>
  );
}

export function SizeGuideTool({ onNavigate, compact }: { onNavigate?: () => void; compact?: boolean }) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [under, setUnder] = useState('');
  const [bust, setBust] = useState('');
  const [result, setResult] = useState<SizeResult | null>(null);
  const [error, setError] = useState('');

  const parse = (v: string) => Number(v.replace(',', '.'));
  const next1 = () => {
    const u = parse(under);
    if (!u || u < 55 || u > 150) { setError('Indiquez votre tour de dos en centimètres, par exemple 82.'); return; }
    setError(''); setStep(2);
  };
  const finish = () => {
    const b = parse(bust);
    if (!b || b < 60 || b > 200) { setError('Indiquez votre tour de poitrine en centimètres, par exemple 98.'); return; }
    setError('');
    const r = computeSize(parse(under), b);
    setResult(r);
    if (r.ok) storage.set('c69-taille', r.label);
    setStep(3);
  };

  const heading = compact ? 'h2' : 'h2';
  const H = heading;

  return (
    <div className="mx-auto max-w-xl">
      <ol className="mb-8 flex items-center gap-2" aria-label="Progression">
        {['Accueil', 'Tour de dos', 'Tour de poitrine', 'Résultat'].map((s, i) => (
          <li key={s} className="flex-1">
            <span className={`block h-1 rounded-full ${i <= step ? 'bg-gold' : 'bg-ivory/15'}`} />
            <span className="sr-only">{s}{i === step ? ' (étape en cours)' : ''}</span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div>
          <Ruler className="mb-5 h-8 w-8 text-gold" aria-hidden />
          <H className="font-serif text-3xl sm:text-4xl">Deux mesures, deux minutes</H>
          <div className="body-copy mt-5">
            <p>La plupart des femmes portent la mauvaise taille sans le savoir. Ce n’est pas une question d’attention : c’est que personne ne leur a jamais montré.</p>
            <p>Munissez-vous d’un mètre ruban souple. Prenez vos mesures sans soutien-gorge, ou avec un soutien-gorge fin sans rembourrage.</p>
          </div>
          <button className="btn-gold mt-8" onClick={() => setStep(1)}>Commencer</button>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); next1(); }} noValidate>
          <H className="font-serif text-3xl">Votre tour de dos</H>
          <Diagram level="under" />
          <p className="body-copy">Passez le mètre juste sous la poitrine, bien à l’horizontale, contre la peau. Serrez fermement sans comprimer. Expirez normalement, puis lisez le chiffre.</p>
          <label htmlFor="sg-under" className="label mt-6">Tour de dos, en centimètres</label>
          <input id="sg-under" className="field max-w-[12rem]" inputMode="decimal" autoComplete="off" value={under} onChange={(e) => setUnder(e.target.value)} aria-invalid={!!error} aria-describedby={error ? 'sg-err' : undefined} autoFocus />
          {error && <p id="sg-err" role="alert" className="mt-2 text-sm text-[#F2A999]">{error}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn-line" onClick={() => { setError(''); setStep(0); }}><ArrowLeft className="h-4 w-4" />Retour</button>
            <button type="submit" className="btn-gold">Continuer</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); finish(); }} noValidate>
          <H className="font-serif text-3xl">Votre tour de poitrine</H>
          <Diagram level="bust" />
          <p className="body-copy">Passez le mètre au niveau le plus fort de la poitrine, sans serrer, en gardant le dos droit et les bras le long du corps.</p>
          <label htmlFor="sg-bust" className="label mt-6">Tour de poitrine, en centimètres</label>
          <input id="sg-bust" className="field max-w-[12rem]" inputMode="decimal" autoComplete="off" value={bust} onChange={(e) => setBust(e.target.value)} aria-invalid={!!error} aria-describedby={error ? 'sg-err2' : undefined} autoFocus />
          {error && <p id="sg-err2" role="alert" className="mt-2 text-sm text-[#F2A999]">{error}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn-line" onClick={() => { setError(''); setStep(1); }}><ArrowLeft className="h-4 w-4" />Retour</button>
            <button type="submit" className="btn-gold">Voir ma taille</button>
          </div>
        </form>
      )}

      {step === 3 && result && (
        <div aria-live="polite">
          {result.ok ? (
            <>
              <p className="eyebrow mb-3">Résultat</p>
              <H className="font-serif text-4xl sm:text-5xl">Votre taille est <span className="text-gold">{result.label}</span></H>
              <p className="body-copy mt-5">C’est votre point de départ. Une taille varie légèrement d’une maison à l’autre, comme pour les chaussures. Si une pièce ne vous convient pas, échangez-la en boutique ou écrivez-nous.</p>
              <p className="mt-5 rounded-xl border border-gold/25 bg-gold/[0.06] p-4 text-[15px] leading-relaxed text-ivory-2">{result.message}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to={`/boutique?bonnet=${result.cup}&dos=${result.band}`} onClick={onNavigate} className="btn-gold">Voir les pièces disponibles en {result.label}</Link>
                <WaButton message={MESSAGES.sizeCheck(result.label)} source="guide_resultat" variant="line">Faire vérifier par une conseillère</WaButton>
              </div>
            </>
          ) : (
            <>
              <H className="font-serif text-3xl">Reprenons ensemble</H>
              <p className="mt-5 rounded-xl border border-gold/25 bg-gold/[0.06] p-4 text-[15px] leading-relaxed text-ivory-2">{result.message}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="btn-line" onClick={() => setStep(1)}>Reprendre la mesure</button>
                <WaButton message={MESSAGES.sizeCheck()} source="guide_incoherent">Écrire à une conseillère</WaButton>
              </div>
            </>
          )}
          <button className="btn-ghost mt-6" onClick={() => { setStep(0); setUnder(''); setBust(''); setResult(null); }}>Recommencer</button>
        </div>
      )}
    </div>
  );
}
