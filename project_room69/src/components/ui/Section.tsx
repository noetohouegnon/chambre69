import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Section({ children, className = '', id, tone = 'ink' }: { children: ReactNode; className?: string; id?: string; tone?: 'ink' | 'ink2' | 'none' }) {
  const bg = tone === 'ink2' ? 'bg-ink-2' : tone === 'ink' ? 'bg-ink' : '';
  return (
    <section id={id} className={`${bg} py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, children, center, as: As = 'h2' }: { eyebrow?: string; title: ReactNode; children?: ReactNode; center?: boolean; as?: 'h1' | 'h2' }) {
  return (
    <header className={`mb-10 sm:mb-12 ${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <As className={As === 'h1' ? 'h-display text-balance' : 'h-section text-balance'}>{title}</As>
      {children && <div className={`lead mt-5 ${center ? 'mx-auto' : ''} max-w-prose`}>{children}</div>}
    </header>
  );
}

export function PageHero({ eyebrow, title, children, crumbs }: { eyebrow?: string; title: ReactNode; children?: ReactNode; crumbs?: { label: string; to?: string }[] }) {
  return (
    <div className="relative overflow-hidden border-b border-gold/10 bg-ink pb-12 pt-8 sm:pb-16 sm:pt-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(228,157,39,0.12),transparent_60%)]" />
      <div className="container-x relative">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow mb-4 mt-6">{eyebrow}</p>}
        <h1 className={`h-display max-w-4xl text-balance ${eyebrow ? '' : 'mt-6'}`}>{title}</h1>
        {children && <div className="lead mt-6 max-w-prose space-y-4">{children}</div>}
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="text-sm text-mute">
      <ol className="flex flex-wrap items-center gap-1">
        <li><Link to="/" className="hover:text-gold">Accueil</Link></li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
            {it.to ? <Link to={it.to} className="hover:text-gold">{it.label}</Link> : <span aria-current="page" className="text-ivory-2">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Bloc d'attente neutre, clairement identifié, pour une donnée à transmettre (3.3). */
export function Pending({ children }: { children: ReactNode }) {
  return <p className="pending"><span className="mr-1.5 font-medium text-gold">À compléter :</span>{children}</p>;
}
