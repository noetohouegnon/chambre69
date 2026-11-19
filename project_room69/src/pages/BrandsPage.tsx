import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, Section } from '../components/ui/Section';
import { PRODUCTS, BRANDS_DISTRIBUTED } from '../data/catalog';
import { Img } from '../components/ui/Img';
import { sizeSummary } from '../components/ProductCard';

/** Textes de présentation par maison (proposition rédigée à partir du positionnement public de chaque maison, à relire par Chambre 69). */
const BRAND_TEXT: Record<string, string | null> = {
  Empreinte: 'Maison française réputée pour ses broderies et ses dentelles, et pour un maintien pensé dès l’origine pour les bonnets généreux. Le luxe, sans renoncer au confort.',
  Elomi: 'Maison anglaise entièrement consacrée aux femmes rondes et aux fortes poitrines : des coupes qui maintiennent vraiment, sans jamais renoncer à la dentelle ni à la couleur.',
  'Louisa Bracq': 'Maison française de lingerie raffinée, connue pour ses broderies délicates et ses lignes très féminines. Des pièces qui se portent comme un bijou.',
  Freya: 'Maison anglaise jeune et colorée, pensée pour les poitrines généreuses : imprimés, couleurs franches et maintien sérieux, jusque dans le sport et le bain.',
  Fantasie: 'Maison anglaise spécialiste des bonnets généreux, qui mise sur une élégance discrète et un confort qui tient toute la journée.',
  'Curvy Kate': 'Maison anglaise née pour les poitrines généreuses, au style affirmé et joueur. Des coupes modernes, du quotidien jusqu’à la brassière de sport.',
  'Dita Von Teese': 'La ligne de lingerie imaginée par l’artiste Dita Von Teese : satin, dentelle, porte-jarretelles et glamour d’inspiration rétro, assumé jusqu’au bout.',
  Wacoal: 'Maison d’origine japonaise, reconnue dans le monde entier pour la précision de ses coupes et la finesse de ses dentelles.',
  'Ysabel Mora': 'Maison espagnole du quotidien : basiques, pyjamas, pièces de grossesse et sous-vêtements homme, confortables et faciles à vivre, pour toute la famille.',
  LingaDore: 'Maison européenne de lingerie et de nuit, aux dentelles et aux coloris soignés, pour se faire plaisir à prix doux.',
};

export function BrandsPage() {
  const brands = BRANDS_DISTRIBUTED.map((b) => {
    const items = PRODUCTS.filter((p) => p.brand === b);
    const bras = items.filter((p) => p.sizes.cups?.length);
    const cups = [...new Set(bras.flatMap((p) => p.sizes.cups || []))].sort();
    return { name: b, origin: items[0].origin, count: items.length, cover: items.find((p) => p.category === 'soutiens-gorge') || items[0], range: cups.length ? `Bonnets ${cups[0]} à ${cups[cups.length - 1]}` : sizeSummary(items[0]) };
  });
  brands.sort((a, b) => { const o = ['Empreinte', 'Elomi', 'Louisa Bracq']; const ia = o.indexOf(a.name), ib = o.indexOf(b.name); return (ia < 0 ? 9 : ia) - (ib < 0 ? 9 : ib); });

  return (
    <>
      <PageHero eyebrow="Nos maisons" title="Les maisons que nous avons choisies" crumbs={[{ label: 'Nos maisons' }]}>
        <p>Nous ne distribuons pas tout ce qui se vend. Nous sélectionnons les maisons qui savent faire ce que nous cherchons : du beau, dans toutes les tailles, qui tient dans le temps.</p>
        <p>Nos pièces sont importées directement de France, d’Espagne et d’Angleterre. Ce sont des pièces authentiques, pas des copies.</p>
      </PageHero>

      <Section>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <li key={b.name} className="card overflow-hidden">
              <Link to={`/boutique?maison=${encodeURIComponent(b.name)}`} className="block aspect-[4/3] overflow-hidden bg-ink-3">
                <Img image={b.cover.images[0]} alt={`${b.cover.name}, ${b.name}`} sizes="(min-width:1024px) 30vw, 90vw" className="h-full w-full" />
              </Link>
              <div className="p-6">
                <h2 className="font-serif text-3xl">{b.name} <span className="text-lg text-mute">— {b.origin}</span></h2>
                {BRAND_TEXT[b.name] ? <p className="mt-3 text-ivory-2">{BRAND_TEXT[b.name]}</p> : null}
                <p className="mt-3 text-sm text-mute">{b.range} · {b.count} pièce{b.count > 1 ? 's' : ''} en ligne</p>
                <Link to={`/boutique?maison=${encodeURIComponent(b.name)}`} className="btn-ghost mt-3">Voir les pièces {b.name}<ArrowRight className="h-4 w-4" /></Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <section id="krizalid" className="scroll-mt-32 border-y border-gold/20 bg-[linear-gradient(135deg,#E5DED6,#F4F2EE)] py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <p className="font-serif text-5xl tracking-[0.12em] text-gold sm:text-7xl sm:tracking-[0.2em]">KRIZALID</p>
          <div>
            <h2 className="h-section">KRIZALID — notre maison</h2>
            <p className="body-copy mt-5">À côté des maisons que nous distribuons, nous créons les nôtres. KRIZALID est notre marque de lingerie et de linge de maison : c’est par elle que nous maîtrisons la matière, la finition et le prix, et c’est par elle que nous donnons à notre héritage le niveau d’exigence qu’il mérite.</p>
            <Link to="/heritage" className="btn-line mt-8">Découvrir KRIZALID</Link>
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="h-section">Vous connaissez déjà ces maisons</h2>
          <div className="body-copy mx-auto mt-5">
            <p>Si vous vivez en France, en Italie, en Espagne ou aux États-Unis, ces noms ne vous sont pas inconnus. Vous savez ce qu’ils valent.</p>
            <p>Ce que vous ne trouviez pas, c’est quelqu’un pour vous mesurer en français, vous conseiller sur WhatsApp, et livrer chez vous ou chez votre mère à Dakar.</p>
          </div>
          <Link to="/commander-depuis-l-etranger" className="btn-gold mt-8">Commander depuis l’étranger</Link>
        </div>
      </Section>
    </>
  );
}
