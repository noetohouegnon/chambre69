import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SizeGuideTool } from '../components/SizeGuideTool';
import { Breadcrumbs } from '../components/ui/Section';
import { track } from '../lib/analytics';

export function SizeGuidePage() {
  useEffect(() => { track('size_guide_open', { source: 'page' }); }, []);
  return (
    <div className="container-x pb-20 pt-8">
      <Breadcrumbs items={[{ label: 'Conseils', to: '/conseils' }, { label: 'Guide des tailles' }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <header>
          <p className="eyebrow mb-4">L’École du bon maintien</p>
          <h1 className="h-display">Guide des tailles</h1>
          <p className="lead mt-5">Tout ce qu’on ne vous a jamais expliqué sur votre soutien-gorge, en commençant par votre taille. Sans créer de compte.</p>
          <p className="mt-6 text-sm text-mute">Vous préférez être mesurée ? <Link to="/conseils/rendez-vous-prise-de-mesures" className="text-gold hover:underline">Ce qui se passe pendant une prise de mesures</Link> — gratuit, vingt minutes, en salon fermé.</p>
        </header>
        <div className="card p-6 sm:p-10"><SizeGuideTool /></div>
      </div>
    </div>
  );
}
