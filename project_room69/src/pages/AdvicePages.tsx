import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Ruler, BookOpen } from 'lucide-react';
import { PageHero, Section, Breadcrumbs } from '../components/ui/Section';
import { ARTICLES, GLOSSARY } from '../data/articles';
import { useUi } from '../context/UiContext';
import { NotFoundPage } from './NotFoundPage';
import { SITE_URL } from '../data/site';

export function AdvicePage() {
  const { openSizeGuide } = useUi();
  return (
    <>
      <PageHero eyebrow="Conseils" title="L’École du bon maintien" crumbs={[{ label: 'Conseils' }]}>
        <p>Tout ce qu’on ne vous a jamais expliqué sur votre soutien-gorge.</p>
      </PageHero>
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="card flex flex-col p-8 lg:col-span-1">
            <Ruler className="h-8 w-8 text-gold" />
            <h2 className="mt-5 font-serif text-3xl">Le guide des tailles</h2>
            <p className="mt-3 flex-1 text-ivory-2">Deux mesures, deux minutes. Sans créer de compte, avec des messages adaptés à votre résultat.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-gold" onClick={() => openSizeGuide('conseils')}>Trouver ma taille</button>
              <Link to="/guide-des-tailles" className="btn-ghost">Ouvrir la page</Link>
            </div>
          </article>
          {ARTICLES.map((a, i) => (
            <article key={a.slug} className="card flex flex-col p-8">
              <p className="eyebrow">Article {i + 1}</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight"><Link to={`/conseils/${a.slug}`} className="hover:text-gold">{a.title}</Link></h2>
              <p className="mt-3 flex-1 text-ivory-2">{a.lead}</p>
              <Link to={`/conseils/${a.slug}`} className="btn-ghost mt-6">Lire l’article<ArrowRight className="h-4 w-4" /></Link>
            </article>
          ))}
          <article className="card flex flex-col p-8">
            <BookOpen className="h-8 w-8 text-gold" />
            <h2 className="mt-5 font-serif text-3xl">Glossaire des coupes et des matières</h2>
            <p className="mt-3 flex-1 text-ivory-2">Tour de dos, bonnet emboîtant, balconnet, élasthanne, bétio : les mots de la lingerie, expliqués simplement.</p>
            <Link to="/conseils/glossaire" className="btn-ghost mt-6">Consulter le glossaire<ArrowRight className="h-4 w-4" /></Link>
          </article>
        </div>
      </Section>
    </>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return <NotFoundPage />;
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.metaDescription, inLanguage: 'fr', publisher: { '@type': 'Organization', name: 'Chambre 69' }, mainEntityOfPage: `${SITE_URL}/conseils/${a.slug}` };
  return (
    <article className="container-x max-w-3xl pb-20 pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Breadcrumbs items={[{ label: 'Conseils', to: '/conseils' }, { label: a.title }]} />
      <p className="eyebrow mt-8">L’École du bon maintien</p>
      <h1 className="h-display mt-4 text-balance">{a.title}</h1>
      <p className="lead mt-6">{a.lead}</p>
      <div className="hairline my-10" />
      {a.sections.map((s) => (
        <section key={s.h} className="mb-10">
          <h2 className="font-serif text-3xl">{s.h}</h2>
          <div className="body-copy mt-3">{s.p.map((p) => <p key={p}>{p}</p>)}</div>
        </section>
      ))}
      {a.outro && (
        <section className="card p-6">
          <h2 className="font-serif text-3xl">{a.outro.h}</h2>
          <div className="body-copy mt-3">{a.outro.p.map((p) => <p key={p}>{p}</p>)}</div>
        </section>
      )}
      <Link to={a.cta.to} className="btn-gold mt-10">{a.cta.label}</Link>
      <nav className="mt-16 border-t border-gold/10 pt-8" aria-label="Autres articles">
        <p className="mb-4 text-sm text-mute">À lire aussi</p>
        <ul className="space-y-2">{ARTICLES.filter((x) => x.slug !== a.slug).map((x) => <li key={x.slug}><Link to={`/conseils/${x.slug}`} className="font-serif text-2xl hover:text-gold">{x.title}</Link></li>)}</ul>
      </nav>
    </article>
  );
}

export function GlossaryPage() {
  return (
    <>
      <PageHero eyebrow="L’École du bon maintien" title="Glossaire des coupes et des matières" crumbs={[{ label: 'Conseils', to: '/conseils' }, { label: 'Glossaire' }]} />
      <Section>
        <dl className="mx-auto max-w-3xl divide-y divide-gold/10 border-y border-gold/10">
          {GLOSSARY.map((g) => (
            <div key={g.term} id={g.term.toLowerCase().replace(/\s+/g, '-')} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
              <dt className="font-serif text-2xl text-gold">{g.term}</dt>
              <dd className="text-ivory-2">{g.def}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
