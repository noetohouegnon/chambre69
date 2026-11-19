import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, Section, Pending } from '../components/ui/Section';
import { PENDING } from '../data/site';

const SITUATIONS = [
  { id: 'forte-poitrine', label: 'Forte poitrine', title: 'Vous avez cherché longtemps', text: ['Bonnet F, H, K, O. On vous a proposé des modèles solides, larges, couleur chair, en vous expliquant que c’était ce qui se faisait. On ne vous a jamais proposé de la dentelle.', 'Un grand bonnet n’est pas un problème d’ingénierie à résoudre. C’est une taille, comme les autres, qui a droit aux mêmes matières et aux mêmes couleurs. Elomi et Empreinte l’ont compris avant tout le monde : c’est pour cela que nous les avons choisies.'], link: { label: 'Voir les pièces à partir du bonnet E', to: '/boutique?bonnet=E,F,G,H,I,J,K,L,M,N,O&categorie=soutiens-gorge' } },
  { id: 'petite-poitrine', label: 'Petite poitrine', title: 'Vous n’avez rien à rembourrer', text: ['On a longtemps vendu aux femmes à petite poitrine des produits conçus pour corriger quelque chose. Nous partons du principe inverse : il n’y a rien à corriger.', 'Nos pièces en bonnet A et B sont pensées pour épouser, pas pour remplir.'], link: { label: 'Voir les pièces bonnet A et B', to: '/boutique?bonnet=A,B' } },
  { id: 'grossesse', label: 'Grossesse et allaitement', title: 'Votre corps change vite. Votre lingerie doit suivre.', text: ['Pendant la grossesse et l’allaitement, une femme change parfois trois fois de taille. Ce n’est pas une raison pour renoncer à quelque chose de joli pendant deux ans.', 'Nos pièces de la ligne Ndeye (mère) offrent l’ouverture et le maintien nécessaires, sans ressembler à du matériel médical.'], link: { label: 'Voir la ligne Ndeye', to: '/boutique?ligne=ndeye' } },
  { id: 'apres-accouchement', label: 'Après l’accouchement', title: 'Après, ce n’est pas la même chose. Et c’est normal.', text: ['La poitrine change, le dos aussi, et le soutien-gorge d’avant ne va plus. Beaucoup de femmes continuent à le porter des mois, en attendant de « redevenir comme avant ».', 'Nous ne vous demanderons jamais de redevenir comme avant. Nous vous mesurons telle que vous êtes aujourd’hui.'], link: { label: 'Prendre rendez-vous pour une prise de mesures', to: '/rendez-vous?type=mesures' } },
  { id: 'mastectomie', label: 'Après une mastectomie', title: 'Vous avez traversé quelque chose', text: ['Trouver de la lingerie adaptée après une mastectomie relève souvent du parcours du combattant, et ce qu’on trouve ressemble rarement à de la lingerie. À Dakar comme dans toute la sous-région, l’offre est presque inexistante.', 'Nous proposons des brassières post-opératoires et des prothèses mammaires, et nos conseillères sont formées à cet accompagnement.'], link: { label: 'Avec ou sans. Femme entièrement.', to: '/apres-mastectomie' } },
  { id: 'menopause', label: 'À la ménopause et après', title: 'Il n’y a pas d’âge où l’on arrête', text: ['Passé un certain âge, on cesse de proposer de la belle lingerie aux femmes, comme si le désir d’être belle s’éteignait avec quelque chose d’autre.', 'La peau devient plus sensible, la poitrine évolue, le confort compte davantage. Ce sont des paramètres techniques, pas une raison de porter du beige.'], link: { label: 'Voir la ligne Drianké (femme assumée)', to: '/boutique?ligne=drianke' } },
  { id: 'sport', label: 'Le sport et le mouvement', title: 'Courir avec un grand bonnet', text: ['La plupart des brassières de sport s’arrêtent au bonnet D. Au-delà, on vous conseille d’en superposer deux, ce qui n’est ni confortable, ni efficace, ni digne.'], pending: `Nous proposons un maintien réel jusqu’au bonnet ${PENDING.sportMaxCup}.`, link: { label: 'Voir les pièces de maintien', to: '/boutique?occasion=sport' } },
];

export function InclusivityPage() {
  return (
    <>
      <PageHero eyebrow="Toutes les tailles" title="Du bonnet A au bonnet O. Vraiment." crumbs={[{ label: 'Toutes les tailles' }]}>
        <p>Beaucoup de marques disent qu’elles habillent toutes les femmes. Peu s’engagent sur des chiffres. Voici les nôtres.</p>
      </PageHero>

      <Section>
        <h2 className="h-section">Notre amplitude réelle</h2>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card p-6"><dt className="text-sm text-mute">Bonnets</dt><dd className="mt-1 font-serif text-4xl">du A au O</dd></div>
          <div className="card p-6"><dt className="text-sm text-mute">Tours de dos</dt><dd className="mt-2"><Pending>du {PENDING.bandRange}, après vérification en stock.</Pending></dd></div>
          <div className="card p-6"><dt className="text-sm text-mute">Culottes et pièces non structurées</dt><dd className="mt-1 font-serif text-4xl">du S au 3XL</dd><dd className="mt-1 text-xs text-mute">Amplitude à confirmer par le stock réel.</dd></div>
        </dl>
        <div className="body-copy mt-8">
          <p>Ces tailles ne sont pas commandables sur demande : elles sont en stock dans nos boutiques.</p>
          <p>C’est, à notre connaissance, l’amplitude la plus large disponible en Afrique de l’Ouest.</p>
        </div>
        <nav aria-label="Situations" className="mt-10 flex flex-wrap gap-2">
          {SITUATIONS.map((s) => <a key={s.id} href={`#${s.id}`} className="chip border-gold/30 text-ivory-2 hover:border-gold hover:text-ivory">{s.label}</a>)}
        </nav>
      </Section>

      <div className="border-t border-gold/10">
        {SITUATIONS.map((s, i) => (
          <section key={s.id} id={s.id} className={`scroll-mt-32 border-b border-gold/10 py-14 sm:py-16 ${i % 2 ? 'bg-ink-2' : ''}`}>
            <div className="container-x grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-16">
              <p className="eyebrow pt-2">Situation {i + 1} — {s.label}</p>
              <div>
                <h2 className="h-section">{s.title}</h2>
                <div className="body-copy mt-5">{s.text.map((t) => <p key={t}>{t}</p>)}</div>
                {s.pending && <div className="mt-4 max-w-prose"><Pending>{s.pending}</Pending></div>}
                <Link to={s.link.to} className="btn-ghost mt-6">{s.link.label}<ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </section>
        ))}
      </div>

      <Section>
        <h2 className="h-section">Les mots que nous n’employons pas</h2>
        <p className="body-copy mt-4">Ni « grande taille », ni « taille normale », ni « camoufler », ni « malgré vos rondeurs ». Une taille porte un nom : le sien. La faire disparaître, ou la mettre à part, revient à faire disparaître les femmes qui la portent.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/guide-des-tailles" className="btn-gold">Trouver ma taille</Link>
          <Link to="/boutique" className="btn-line">Découvrir la collection</Link>
        </div>
      </Section>
    </>
  );
}
