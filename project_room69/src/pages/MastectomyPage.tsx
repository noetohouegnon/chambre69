import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { PageHero, Section } from '../components/ui/Section';
import { WaButton } from '../components/ui/WaButton';
import { MESSAGES } from '../lib/whatsapp';

/** URL de la vignette et du film, à renseigner dès réception du fichier définitif. */
const FILM: { url: string | null; poster: string | null } = { url: null, poster: null };

export function MastectomyPage() {
  return (
    <>
      <PageHero eyebrow="Après-mastectomie" title="Avec ou sans. Femme entièrement." crumbs={[{ label: 'Après-mastectomie' }]}>
        <p>Après une mastectomie, trouver de la lingerie adaptée relève souvent du parcours du combattant. Et ce qu’on finit par trouver ressemble rarement à de la lingerie.</p>
        <p>Nous avons décidé que cela ne devait plus être le cas ici.</p>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <article>
            <h2 className="h-section">Ce que nous proposons</h2>
            <div className="body-copy mt-5">
              <p>Des brassières post-opératoires, à porter dans les semaines qui suivent une intervention : sans armature, à ouverture frontale, pensées pour ne pas appuyer là où il ne faut pas.</p>
              <p>Des prothèses mammaires, en plusieurs formes et plusieurs volumes, ainsi que les soutiens-gorge à poche qui les accueillent.</p>
              <p>Et des pièces qui ressemblent à de la lingerie, parce qu’il n’y a aucune raison que ce soit autrement.</p>
              <p>À notre connaissance, cette offre n’existe quasiment nulle part ailleurs en Afrique de l’Ouest.</p>
            </div>
          </article>
          <article className="card p-8">
            <h2 className="h-section">Un rendez-vous à part</h2>
            <div className="body-copy mt-5">
              <p>Nous recevons sur rendez-vous, dans un salon fermé, avec tout le temps qu’il faut.</p>
              <p>La conseillère qui vous reçoit est formée à cet accompagnement. Elle ne vous posera aucune question à laquelle vous n’ayez envie de répondre, et ne commentera pas votre corps.</p>
              <p>Vous pouvez venir accompagnée. Vous pouvez aussi venir seulement pour voir, sans rien essayer.</p>
            </div>
            <Link to="/rendez-vous?type=prive" className="btn-gold mt-8">Prendre un rendez-vous privé</Link>
          </article>
        </div>
      </Section>

      <Section tone="ink2">
        <div className="grid gap-6 lg:grid-cols-2">
          <article>
            <h2 className="font-serif text-3xl">Vous préférez écrire d’abord ?</h2>
            <p className="body-copy mt-4">C’est souvent plus simple. Écrivez-nous sur WhatsApp : vous poserez vos questions sans avoir à vous déplacer, et nous vous dirons ce que nous avons avant que vous ne veniez.</p>
            <WaButton message={MESSAGES.mastectomy} source="mastectomie-ecrire" className="mt-6">Écrire sur WhatsApp</WaButton>
          </article>
          <article>
            <h2 className="font-serif text-3xl">Vous n’êtes pas au Sénégal</h2>
            <div className="body-copy mt-4">
              <p>Nous recevons régulièrement des demandes depuis d’autres pays de la région, où ces produits sont introuvables.</p>
              <p>Écrivez-nous : nous vous dirons ce dont nous avons besoin comme informations, ce que nous pouvons expédier, et dans quels délais.</p>
            </div>
            <WaButton message={`${MESSAGES.mastectomy} Je vis hors du Sénégal.`} source="mastectomie-etranger" variant="line" className="mt-6">Écrire sur WhatsApp</WaButton>
          </article>
        </div>
      </Section>

      {FILM.url && (
      <Section>
        <h2 className="h-section">Avec ou sans. Femme entièrement.</h2>
        <p className="mt-3 text-ivory-2">Le film que nous avons réalisé en octobre, pour que cela se sache.</p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-gold/20">
            <a href={FILM.url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-video bg-ink-3">
              {FILM.poster && <img src={FILM.poster} alt="Vignette du film Avec ou sans — Femme entièrement" loading="lazy" className="h-full w-full object-cover" />}
              <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-ink"><Play className="h-8 w-8" /></span></span>
            </a>
        </div>
      </Section>
      )}

      <section className="border-t border-gold/10 bg-ink-2 py-16 text-center">
        <div className="container-x">
          <p className="mx-auto max-w-3xl font-serif text-3xl leading-snug text-ivory sm:text-4xl">Toutes les tailles, toutes les morphologies, et chaque étape de votre vie. Celle-ci comprise.</p>
        </div>
      </section>
    </>
  );
}
