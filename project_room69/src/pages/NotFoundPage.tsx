import { Link } from 'react-router-dom';
import { WaButton } from '../components/ui/WaButton';
import { MESSAGES } from '../lib/whatsapp';

export function NotFoundPage() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p aria-hidden data-deco="404" className="deco-text font-serif text-[7rem] leading-none text-gold/40" />
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Cette page n’existe pas, ou plus</h1>
      <p className="lead mt-4 max-w-xl">La porte est restée fermée. Voici celles qui sont ouvertes.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-line">Retour à l’accueil</Link>
        <Link to="/boutique" className="btn-gold">La boutique en ligne</Link>
        <WaButton message={MESSAGES.general} source="404">Parler à une conseillère</WaButton>
      </div>
    </div>
  );
}
