import { Link } from 'react-router-dom';
import { Users, Clock, Gift, Share2 } from 'lucide-react';
import { PageHero, Section } from '../components/ui/Section';
import { WaButton } from '../components/ui/WaButton';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, BY_SLUG, type Product } from '../data/catalog';
import { MESSAGES } from '../lib/whatsapp';

const MOMENTS = [
  { t: 'Les préparatifs', d: 'Les semaines avant le takk (mariage). Ce qu’on porte au quotidien et ce qu’on garde pour le jour venu. C’est aussi le moment des séances entre femmes, et des cadeaux qui s’offrent à ce moment-là.', to: '/boutique?occasion=quotidien,cadeau' },
  { t: 'La cérémonie', d: 'Ce qui se porte en dessous d’une tenue de cérémonie, et qui doit tenir toute une journée sans qu’on y pense.', to: '/boutique?occasion=ceremonie' },
  { t: 'La nuit de noces', d: 'Le bétio (pagne intime traditionnel), le bin-bin (perles de taille), les pièces de soie. Ce que nos grand-mères transmettaient avec des mots choisis, dans la qualité que cela méritait depuis toujours.', to: '/boutique?occasion=mariage' },
  { t: 'Les premiers mois', d: 'Parce qu’un trousseau ne s’arrête pas au lendemain du mariage, et que ce qu’on achète à ce moment-là, on le porte des années.', to: '/boutique?categorie=nuit,soutiens-gorge' },
];

/** Sélection d'ouverture : un mélange lisible de maisons européennes, d'héritage et de senteurs, de la cérémonie à la nuit de noces. */
const BRIDE_PICKS = [
  'soutien-gorge-natsuki-wacoal', 'slip-natsuki-wacoal', 'nuisette-traditionnelle-modele-01', 'chaines-de-taille-modele-01',
  'ensemble-kimono-modele-01', 'ensemble-seduction-modele-18', 'senteur-et-encens-modele-12', 'senteur-et-encens-modele-01',
];
/** Trousseau de naissance : de quoi recevoir, se reposer et retrouver son corps à son rythme. */
const BIRTH_PICKS = [
  'ensemble-kimono-blanc-de-lait', 'pyjamas-femme-ysabel-mora', 'nuisette-camisole-ysabel-mora', 'soutien-gorge-celeste-sans-armatures-elomi',
  'soutien-gorge-sans-armatures-non-rembourre-ysabel-mora', 'culotte-de-grossesse-ysabel-mora', 'ensemble-pyjama-lingadore', 'senteur-et-encens-modele-12',
];
const pick = (slugs: string[]) => slugs.map((s) => BY_SLUG.get(s)).filter((p): p is Product => Boolean(p));

export function BridePage() {
  const picks = pick(BRIDE_PICKS).length >= 4 ? pick(BRIDE_PICKS) : PRODUCTS.filter((p) => p.lines.includes('trousseau')).slice(0, 8);
  const birth = pick(BIRTH_PICKS);
  return (
    <>
      <PageHero eyebrow="Mariée" title="Le trousseau de la mariée" crumbs={[{ label: 'Mariée' }]}>
        <p>Chez nous, le trousseau ne se prépare pas seule. Une mère, des tantes, des amies, un mbotaay (groupe de femmes qui se soutiennent) : tout le monde y participe.</p>
        <p>Nous avons conçu cette section pour cela. Les plus belles maisons européennes d’un côté, notre héritage de l’autre, et de quoi organiser l’ensemble sans y passer ses nuits.</p>
      </PageHero>

      <Section>
        <p className="eyebrow mb-4">Ce que contient un trousseau</p>
        <h2 className="h-section">Les quatre moments</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {MOMENTS.map((m, i) => (
            <li key={m.t} className="card flex flex-col p-6 sm:p-8">
              <span className="font-serif text-5xl text-gold/70">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-serif text-3xl">{m.t}</h3>
              <p className="mt-3 flex-1 text-ivory-2">{m.d}</p>
              <Link to={m.to} className="btn-ghost mt-4">Voir les sélections</Link>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="ink2">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-4">Le rendez-vous trousseau</p>
            <h2 className="h-section">Venez, et venez accompagnée</h2>
            <div className="body-copy mt-5">
              <p>Une heure dans un salon fermé, avec une conseillère qui connaît les maisons et qui sait mesurer.</p>
              <p>Vous pouvez venir avec votre mère, vos tantes, vos amies. C’est même mieux : ce sont souvent elles qui offrent.</p>
              <p>Nous composons ensemble, nous mettons de côté, et vous repartez avec votre liste.</p>
            </div>
            <Link to="/rendez-vous?type=trousseau" className="btn-gold mt-8">Réserver un rendez-vous trousseau</Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <li className="card flex items-center gap-4 p-5"><Clock className="h-6 w-6 text-gold" /><span>Une heure, en salon fermé</span></li>
            <li className="card flex items-center gap-4 p-5"><Users className="h-6 w-6 text-gold" /><span>Accompagnée de qui vous voulez</span></li>
            <li className="card flex items-center gap-4 p-5"><Gift className="h-6 w-6 text-gold" /><span>Pièces mises de côté, liste prête à partager</span></li>
          </ul>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Share2 className="mx-auto h-8 w-8 text-gold" />
          <h2 className="h-section mt-4">Votre liste de trousseau</h2>
          <div className="body-copy mx-auto mt-5">
            <p>Composez votre liste, partagez-la à celles qui veulent vous faire plaisir, et laissez-les choisir. Chaque pièce réservée disparaît de la liste : personne n’offre deux fois la même chose.</p>
            <p>Vous pouvez choisir de ne pas voir qui a offert quoi avant le jour venu.</p>
            <p>Pas besoin de créer un compte. Vous recevez un lien, et ce lien est votre liste.</p>
          </div>
          <Link to="/mariee/liste" className="btn-gold mt-8 px-10">Créer ma liste</Link>
        </div>
      </Section>

      {picks.length > 0 && (
        <Section tone="ink2">
          <h2 className="h-section">Quelques pièces pour commencer</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">{picks.map((p) => <li key={p.slug}><ProductCard p={p} /></li>)}</ul>
          <Link to="/boutique?ligne=trousseau" className="btn-line mt-10">Voir toute la ligne Le Trousseau</Link>
        </Section>
      )}

      {birth.length > 0 && (
        <Section>
          <p className="eyebrow mb-4">Et plus tard</p>
          <h2 className="h-section">Le trousseau de naissance</h2>
          <div className="body-copy mt-5 max-w-prose">
            <p>À la naissance, on gâte la jeune maman. Elle reçoit, elle se repose, et son corps change encore : il lui faut de quoi être belle pour les visites, à l’aise la nuit, et soutenue sans être serrée.</p>
            <p>Nuisettes et kimonos pour recevoir, pyjamas, soutiens-gorge sans armatures, culotte de grossesse, et le thiouraye (encens parfumé) qui embaume la chambre : une liste qui s’offre à plusieurs, comme celle de la mariée.</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">{birth.map((p) => <li key={p.slug}><ProductCard p={p} /></li>)}</ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/boutique?ligne=ndeye" className="btn-line">Voir toute la ligne Ndeye (mère)</Link>
            <Link to="/mariee/liste" className="btn-ghost">Créer une liste de naissance</Link>
          </div>
        </Section>
      )}

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="card p-8">
            <h2 className="font-serif text-3xl">Vous vous mariez au pays, et vous n’y êtes pas encore</h2>
            <div className="body-copy mt-4">
              <p>Nous préparons votre trousseau à distance. Une conseillère vous mesure par WhatsApp, vous conseille, et compose avec vous.</p>
              <p>Vous réglez depuis où vous êtes. Nous gardons tout en boutique jusqu’à votre arrivée, ou nous livrons chez votre mère.</p>
              <p>Vos amies peuvent participer à votre liste depuis n’importe quel pays.</p>
            </div>
            <WaButton message={MESSAGES.brideAbroad} source="mariee-pays" className="mt-6">Écrire à une conseillère</WaButton>
          </article>
          <article className="card p-8">
            <h2 className="font-serif text-3xl">Vous cherchez quoi offrir</h2>
            <div className="body-copy mt-4">
              <p>Si elle a une liste, tout est déjà choisi, dans sa taille : il n’y a qu’à prendre.</p>
              <p>Si elle n’en a pas, nos idées cadeaux sont faites pour cela : senteurs, nuisettes, kimonos. Et si vous hésitez sur la taille, la carte cadeau règle la question sans en avoir l’air.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/boutique?ligne=trousseau&occasion=cadeau" className="btn-line">Voir les idées cadeaux</Link>
              <Link to="/carte-cadeau" className="btn-gold">Offrir une carte cadeau</Link>
            </div>
          </article>
        </div>
      </Section>
    </>
  );
}
