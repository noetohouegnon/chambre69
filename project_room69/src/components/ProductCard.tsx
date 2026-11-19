import { Link } from 'react-router-dom';
import { productUrl, formatPrice, type Product } from '../data/catalog';
import { Img } from './ui/Img';

export function sizeSummary(p: Product): string | null {
  const c = p.sizes.cups;
  if (c?.length) return c.length > 1 ? `Bonnets ${c[0]} à ${c[c.length - 1]}` : `Bonnet ${c[0]}`;
  const a = p.sizes.alpha;
  if (a?.length) return a.length > 1 ? `Tailles ${a[0]} à ${a[a.length - 1]}` : `Taille ${a[0]}`;
  return null;
}

export function ProductCard({ p, priority, sizes }: { p: Product; priority?: boolean; sizes?: string }) {
  const summary = sizeSummary(p);
  return (
    <article className="group relative">
      <Link to={productUrl(p)} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-ink-3">
          <Img image={p.images[0]} alt={`${p.name}${p.color ? `, coloris ${p.color.toLowerCase()}` : ''} — ${p.brand}`} priority={priority} sizes={sizes} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
          {p.isNew && <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/85 px-2.5 py-1 text-[12px] text-gold">Nouveauté</span>}
          {p.lastPieces && <span className="absolute right-2.5 top-2.5 rounded-full bg-ink/85 px-2.5 py-1 text-[12px] text-ivory">Dernières pièces</span>}
        </div>
        <div className="pt-3">
          <p className="text-[12px] uppercase tracking-label text-gold">{p.brand}</p>
          <h3 className="mt-1 font-sans text-[15px] font-normal leading-snug text-ivory group-hover:text-gold-soft">{p.name}</h3>
          <p className="mt-1 text-sm text-mute">
            {p.price ? formatPrice(p.price) : summary || p.color || ''}
            {p.price && summary ? <span> · {summary}</span> : null}
          </p>
        </div>
      </Link>
    </article>
  );
}
