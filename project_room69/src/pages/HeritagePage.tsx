import { Link } from 'react-router-dom';
import { PageHero, Section } from '../components/ui/Section';
import { ProductCard } from '../components/ProductCard';
import { WaButton } from '../components/ui/WaButton';
import { PRODUCTS, BY_SLUG, isScent } from '../data/catalog';
import { Img } from '../components/ui/Img';
import { MESSAGES } from '../lib/whatsapp';

export function HeritagePage() {
  const pieces = PRODUCTS.filter((p) => p.category === 'heritage');
  const traditional = pieces.filter((p) => !isScent(p));
  const scents = pieces.filter(isScent);
  const lead = BY_SLUG.get('nuisette-traditionnelle-modele-02');
  return (
    <>
      <PageHero eyebrow="Héritage" title="Notre héritage, enfin au niveau qu’il mérite" crumbs={[{ label: 'Héritage' }]}>
        <p>Longtemps, le bétio (pagne intime traditionnel) est resté une affaire de chambre et de transmission orale. Nous avons décidé de lui donner ce qu’on ne lui avait jamais donné : de la soie, des finitions de maison, et une vitrine.</p>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="space-y-14">
            <article>
              <h2 className="h-section">Ce que nos grand-mères savaient</h2>
              <div className="body-copy mt-5">
                <p>Le bétio ne s’achetait pas dans une boutique. Il se transmettait. Une tante, une grande sœur, une amie de la mère vous en parlait la veille du mariage, avec des mots choisis, et vous compreniez que l’on vous confiait quelque chose de sérieux.</p>
                <p>Autour de lui, tout un art : les perles, l’encens, le parfum, le geste, le moment. Une science de l’intime qui n’a jamais eu besoin de se nommer pour être maîtrisée.</p>
                <p>Cette science n’a jamais été un tabou entre femmes. Elle était seulement protégée. C’est cela, la sutura (la dignité de ce qui reste privé).</p>
              </div>
            </article>
            <article>
              <h2 className="h-section">Ce que nous y ajoutons</h2>
              <div className="body-copy mt-5">
                <p>Rien au fond, tout dans la forme. Les mêmes gestes, mais dans des matières qui tiennent : soie, satin de qualité, dentelles choisies, coutures qui ne lâchent pas au troisième lavage.</p>
                <p>Des pièces qu’on n’a plus honte de ranger dans son armoire, qu’on peut offrir à sa fille le jour de son mariage, et qui traversent les années.</p>
                <p>Notre héritage mérite le même niveau d’exigence qu’une pièce de maison européenne. Il ne lui manquait que quelqu’un pour le décider.</p>
              </div>
            </article>
          </div>
          {lead && (
            <figure className="overflow-hidden rounded-2xl bg-ink-3 lg:sticky lg:top-40">
              <Img image={lead.images[0]} alt={lead.name} sizes="(min-width:1024px) 40vw, 100vw" className="max-h-[80vh] w-full" priority />
            </figure>
          )}
        </div>
      </Section>

      <Section tone="ink2">
        <h2 className="h-section">La collection traditionnelle</h2>
        <p className="body-copy mt-4">Nuisettes, kimonos et ensembles de dentelle et de satin, chaînes de taille, et le bin-bin (perles de taille) qui les accompagne. Chaque pièce est présentée avec la même exigence que nos maisons européennes.</p>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
          {traditional.map((p) => <li key={p.slug}><ProductCard p={p} /></li>)}
        </ul>
        <h3 className="mt-16 font-serif text-3xl">Le thiouraye (encens parfumé) et les senteurs</h3>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
          {scents.slice(0, 8).map((p) => <li key={p.slug}><ProductCard p={p} /></li>)}
        </ul>
        <div className="mt-10"><Link to="/boutique?categorie=heritage" className="btn-line">Voir toutes les pièces héritage ({pieces.length})</Link></div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <article>
            <h2 className="h-section">Un art que toute la région partage</h2>
            <div className="body-copy mt-5">
              <p>Le bétio est notre version sénégalaise d’un art que l’Afrique de l’Ouest connaît sous d’autres noms et d’autres formes. Les gestes changent d’un pays à l’autre, l’intention est la même.</p>
              <p>Si vous nous écrivez d’Abidjan, de Bamako, de Conakry ou de Nouakchott, dites-nous ce qui se transmet chez vous. Nous avons l’intention d’élargir cette collection, et nous préférons le faire avec vous plutôt qu’à votre place.</p>
            </div>
            <div className="mt-8"><WaButton message={MESSAGES.heritage} source="heritage">Écrire à une conseillère</WaButton></div>
          </article>
          <article className="card p-8">
            <h2 className="h-section">Il est à nous</h2>
            <p className="body-copy mt-5">Nous ne réinventons pas notre héritage, et nous ne le vendons pas comme un objet exotique à des étrangers de passage. Nous le rendons aux femmes à qui il appartient déjà, dans la qualité qu’elles méritent.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/boutique?categorie=heritage" className="btn-gold">Découvrir la collection</Link>
              <Link to="/mariee" className="btn-line">Composer un trousseau</Link>
            </div>
            <p className="mt-6 text-sm text-mute">KRIZALID, notre maison, est le véhicule de cette modernisation : c’est par elle que nous maîtrisons la matière, la finition et le prix. <Link to="/maisons#krizalid" className="text-gold hover:underline">Découvrir KRIZALID</Link></p>
          </article>
        </div>
      </Section>
    </>
  );
}
