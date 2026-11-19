import { Link } from 'react-router-dom';
import { WaButton } from '../components/ui/WaButton';
import { MESSAGES } from '../lib/whatsapp';
import { useUi } from '../context/UiContext';
import { COMMUNITY } from '../data/site';

const MANIFESTO = [
  'Nous croyons que c’est à la taille de s’adapter au corps, jamais l’inverse.',
  'Nous croyons qu’à vingt ans comme à soixante ans, une femme a le droit d’être belle en dessous.',
  'Nous croyons que la beauté ne commence pas après l’accouchement et ne s’arrête pas à la ménopause.',
  'Nous croyons qu’un corps qui a porté des enfants, traversé une maladie, changé de forme, reste un corps désirable.',
  'Nous croyons qu’une petite poitrine n’est pas un manque et qu’une forte poitrine n’est pas un problème.',
  'Nous croyons qu’une femme qui a perdu un sein n’a rien perdu de ce qui fait d’elle une femme.',
  'Nous croyons que sañse (se faire belle) pour soi vaut exactement autant que sañse pour les autres.',
  'Nous croyons que la sutura n’est pas de la honte : c’est la dignité de ce qui vous appartient.',
  'Nous croyons qu’une femme d’ici n’a pas à commander à l’étranger pour trouver du beau à sa taille.',
  'Nous croyons qu’on peut vendre de l’intime avec élégance, et sans jamais faire baisser les yeux à personne.',
];

function Block({ title, children, tone }: { title?: string; children: React.ReactNode; tone?: 'ink2' }) {
  return (
    <section className={`border-b border-gold/10 py-16 sm:py-20 ${tone === 'ink2' ? 'bg-ink-2' : ''}`}>
      <div className="container-x max-w-3xl">
        {title && <h2 className="h-section mb-6">{title}</h2>}
        <div className="body-copy text-[17px] sm:text-lg">{children}</div>
      </div>
    </section>
  );
}

export function StoryPage() {
  const { openSizeGuide } = useUi();
  const total = COMMUNITY.networks.reduce((n, x) => n + x.count, 0);
  return (
    <>
      <header className="border-b border-gold/10 py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <p className="eyebrow mb-5">Notre histoire</p>
          <h1 className="h-display">Pourquoi Chambre 69 existe</h1>
        </div>
      </header>

      <Block>
        <p className="font-serif text-3xl text-ivory">Vous connaissez cette scène.</p>
        <p>Vous entrez dans une boutique. Vous demandez votre taille. On vous répond que ça ne se fait pas ici. Ou bien on vous sort quelque chose de beige, de solide, de raisonnable, avec ce ton un peu gêné qu’on prend pour dire : à votre âge, avec votre poitrine, après vos enfants, ce sera déjà bien.</p>
        <p>Alors vous prenez. Vous rentrez. Vous le portez tous les jours parce qu’il faut bien porter quelque chose. Et vous finissez par croire que c’est vous qui êtes difficile à habiller.</p>
        <p className="text-ivory">Ce n’est pas vous. C’est l’offre qui était mauvaise.</p>
      </Block>

      <Block tone="ink2">
        <p className="font-serif text-3xl text-ivory">J’ai passé dix-sept ans à acheter ma lingerie ailleurs.</p>
        <p>Pendant dix-sept ans en France, puis une année aux États-Unis, j’ai eu accès à des maisons qui savaient mesurer une femme, qui montaient très haut dans les bonnets sans sourciller, et qui trouvaient normal qu’une cliente reparte avec quelque chose de beau.</p>
        <p>En rentrant à Dakar, j’ai cherché la même chose. Je ne l’ai pas trouvée. Ni pour moi, ni pour mes sœurs, ni pour mes amies, ni pour ma mère.</p>
        <p>Il y avait des femmes magnifiques, qui sañse (se font belles) comme personne au monde, qui dépensent sans compter pour une tenue de cérémonie, et qui, en dessous, portaient ce qu’elles avaient pu trouver.</p>
        <p>C’était une injustice ordinaire. J’ai décidé d’y mettre fin.</p>
        <p className="mt-8 font-serif text-2xl text-gold">Nafi Ba Doré, fondatrice.</p>
      </Block>

      <Block title="Pourquoi Chambre 69">
        <p>Le 69 n’est pas une provocation. C’est un chiffre qui se lit dans les deux sens, dans lequel deux formes se répondent et s’équilibrent. Aucune ne domine l’autre.</p>
        <p>Et « chambre », parce que c’est le seul endroit au monde où une femme n’est plus la fille de, l’épouse de, la mère de, la collègue de. La porte est fermée. Il n’y a plus de regard à satisfaire, plus de rôle à tenir.</p>
        <p>Une chambre, c’est de la sutura (la dignité de ce qui reste privé). Ce qui s’y passe, ce qui s’y porte, ce qui s’y dit n’appartient qu’à celle qui y entre.</p>
        <p className="text-ivory">Nous n’avons pas ouvert une boutique pour que les femmes se montrent. Nous l’avons ouverte pour qu’elles aient enfin quelque chose de beau à garder pour elles.</p>
      </Block>

      <section className="border-b border-gold/10 bg-ink-2 py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="h-section mb-10">Ce que nous croyons</h2>
          <ul className="space-y-8">
            {MANIFESTO.map((m) => (
              <li key={m} className="border-l border-gold/50 pl-6 font-serif text-2xl leading-snug text-ivory sm:text-[1.9rem]">{m}</li>
            ))}
          </ul>
        </div>
      </section>

      <Block title="Nous n’avons rien inventé">
        <p>Bien avant nous, les femmes d’ici savaient déjà tout de l’intime. Le bétio (pagne intime traditionnel), le bin-bin (perles de taille), le thiouraye (encens parfumé), les gestes transmis de mère en fille et de tante en nièce : il existait en Afrique de l’Ouest une science de l’intime d’une finesse rare, à une époque où l’Europe n’en parlait qu’à voix basse.</p>
        <p>Cet héritage n’a jamais eu droit à de beaux matériaux, à de belles finitions, à de belles boutiques. Il est resté au fond des armoires, transmis mais jamais valorisé.</p>
        <p>C’est ce que nous réparons : reprendre ce qui nous appartient déjà, et lui donner le niveau d’exigence qu’il aurait toujours dû avoir.</p>
        <p><Link to="/heritage" className="btn-ghost">Découvrir notre collection traditionnelle</Link></p>
      </Block>

      <Block title="Au-delà de la lingerie" tone="ink2">
        <p>Nous ne nous contentons pas de vendre. Nous mesurons, nous expliquons, nous corrigeons des années de mauvaises habitudes.</p>
        <p>Nos conseillères sont formées à une seule chose : trouver ce qui vous va. Pas à vous vendre ce qui reste en stock. Vous pouvez repartir sans rien : cela arrive tous les jours.</p>
        <p className="text-ivory">C’est ce qui fait la différence entre une boutique et une maison.</p>
      </Block>

      <Block title="Deux ans, deux adresses">
        <p>Nous avons ouvert à Point E, puis sur la Corniche Ouest. Deux boutiques où l’on entre sans rendez-vous, où l’on se fait mesurer sans gêne, où l’on essaie sans se justifier.</p>
        <p>Nous sélectionnons les plus belles maisons anglaises et françaises, que nous importons directement de France, d’Espagne et d’Angleterre.</p>
        <p><Link to="/nos-boutiques" className="btn-ghost">Voir nos boutiques</Link></p>
      </Block>

      <Block title="Nous sommes déjà nombreuses" tone="ink2">
        <p>Plus de {total >= 70000 ? 'soixante-dix mille' : total.toLocaleString('fr-FR')} femmes nous suivent aujourd’hui. Elles nous écrivent, nous posent des questions qu’elles n’osent poser à personne d’autre, s’envoient nos pièces entre amies, et nous racontent ce que ça change de porter enfin la bonne taille.</p>
        <p>Ce n’est pas une audience. C’est un mbotaay (un groupe de femmes qui se soutiennent).</p>
        <p className="text-ivory">Vous y êtes déjà la bienvenue.</p>
      </Block>

      <section className="py-20 sm:py-28">
        <div className="container-x max-w-3xl">
          <h2 className="h-section mb-8">Vous êtes chez vous</h2>
          <div className="body-copy space-y-4 text-[17px] sm:text-lg">
            <p>Que vous ayez vingt-deux ans ou soixante-deux ans. Que vous portiez du bonnet A ou du bonnet O. Que vous ayez un sein, deux seins, ou que cela ne regarde que vous.</p>
            <p>Que vous soyez mariée, célibataire, veuve, ou que cela ne regarde que vous non plus.</p>
            <p>Que vous veniez pour un mariage, pour votre mari, pour un anniversaire, pour vous remettre debout après une épreuve, ou simplement parce que vous en avez envie et que cela suffit comme raison.</p>
            <p>Que vous viviez à Dakar, à Thiès, à Saint-Louis, à Abidjan, à Bamako, à Conakry, à Paris, à Milan ou à New York.</p>
          </div>
          <p className="mt-10 font-serif text-4xl text-ivory">Cette chambre est la vôtre.</p>
          <p className="mt-3 font-serif text-2xl text-gold">Kaay (venez). Nous vous attendons.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/boutique" className="btn-gold">Découvrir la collection</Link>
            <button className="btn-line" onClick={() => openSizeGuide('histoire')}>Trouver ma taille</button>
            <WaButton message={MESSAGES.general} source="histoire" variant="line">Parler à une conseillère</WaButton>
          </div>
        </div>
      </section>
    </>
  );
}
