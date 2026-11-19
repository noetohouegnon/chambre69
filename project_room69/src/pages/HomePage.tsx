import { Link } from 'react-router-dom';
import { Package, MessageCircle, Plane, Ruler, ArrowRight, MapPin, Phone, Navigation, Quote } from 'lucide-react';
import { BY_SLUG, PRODUCTS, BRANDS_DISTRIBUTED, type Product } from '../data/catalog';
import { BRAND, COMMUNITY, STORES, TESTIMONIALS, directionsUrl } from '../data/site';
import { ProductCard } from '../components/ProductCard';
import { Img } from '../components/ui/Img';
import { WaButton } from '../components/ui/WaButton';
import { Section, SectionHead } from '../components/ui/Section';
import { useUi } from '../context/UiContext';
import { MESSAGES, waLink } from '../lib/whatsapp';
import { track } from '../lib/analytics';

const pick = (slugs: string[]) => slugs.map((s) => BY_SLUG.get(s)).filter(Boolean) as Product[];

const HERO = pick(['soutien-gorge-agathe-empreinte', 'nuisette-traditionnelle-modele-03', 'soutien-gorge-morgan-elomi']);
const HERITAGE = pick(['nuisette-traditionnelle-modele-01', 'chaines-de-taille-modele-01', 'senteur-et-encens-modele-05', 'nuisette-traditionnelle-modele-02']);
const BRIDE = pick(['ensemble-kimono-blanc-de-lait', 'ensemble-kimono-et-robe-de-soie', 'porte-jarretelles-zsa-dita-von-teese']);

const ENTRY_TILES = [
  { label: 'Soutiens-gorge', to: '/boutique?categorie=soutiens-gorge', slug: 'soutien-gorge-zarla-elomi' },
  { label: 'Culottes', to: '/boutique?categorie=culottes', slug: 'culotte-leia-empreinte' },
  { label: 'Héritage', to: '/heritage', slug: 'nuisette-traditionnelle-modele-04' },
  { label: 'Nuisettes et kimonos', to: '/boutique?categorie=nuit', slug: 'ensemble-kimono-modele-03' },
];

const fmt = (n: number) => n.toLocaleString('fr-FR').replace(/\u202f|\s/g, '\u00a0');

export function HomePage() {
  const { openSizeGuide } = useUi();
  const newIn = PRODUCTS.filter((p) => p.isNew && p.brandKind === 'maison').slice(0, 8);
  const total = COMMUNITY.networks.reduce((n, x) => n + x.count, 0);

  return (
    <>
      {/* 2.1 — Bloc 1 : premier écran */}
      <section className="relative overflow-hidden border-b border-gold/10">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,169,110,0.16),transparent_55%)]" />
        <div className="container-x relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
          <div>
            <p className="eyebrow mb-5">Chambre 69 — Au-delà de la lingerie</p>
            <h1 className="h-display text-balance">
              Toutes les tailles. <span className="text-gold">Toutes les morphologies.</span> Chaque étape de votre vie.
            </h1>
            <p className="lead mt-6 max-w-xl">
              Du bonnet A au bonnet O. Empreinte, Elomi, Louisa Bracq et les plus belles maisons européennes, choisies, mesurées et conseillées à Dakar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/boutique" className="btn-gold px-8">Découvrir la collection</Link>
              <button className="btn-line px-8" onClick={() => openSizeGuide('accueil-hero')}><Ruler className="h-5 w-5" />Trouver ma taille</button>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm text-mute">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span>Boutiques Point E et Corniche Ouest, Dakar. Livraison au Sénégal, en Afrique de l’Ouest et à l’international.</span>
            </p>
          </div>

          <div className="grid grid-cols-[1.25fr_1fr] gap-3 sm:gap-4">
            {HERO[0] && (
              <Link to={`/boutique/${HERO[0].slug}`} className="row-span-2 overflow-hidden rounded-2xl bg-ink-3">
                <Img image={HERO[0].images[0]} alt={`${HERO[0].name}, ${HERO[0].brand}`} priority sizes="(min-width:1024px) 28vw, 55vw" className="h-full w-full" />
              </Link>
            )}
            {HERO.slice(1).map((p) => (
              <Link key={p.slug} to={`/boutique/${p.slug}`} className="aspect-[4/5] overflow-hidden rounded-2xl bg-ink-3">
                <Img image={p.images[0]} alt={`${p.name}, ${p.brand}`} sizes="(min-width:1024px) 20vw, 40vw" className="h-full w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2.1 — Bloc 2 : bande de réassurance */}
      <section aria-label="Nos engagements" className="border-b border-gold/10 bg-ink-2">
        <ul className="container-x grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <span className="font-serif text-xl leading-none text-gold">A–O</span>, t: 'Du bonnet A au bonnet O', d: 'Toutes les morphologies, réellement en stock.' },
            { icon: <Package className="h-6 w-6 text-gold" />, t: 'Emballage neutre', d: 'Personne ne sait ce qu’il y a dans le colis. Personne.' },
            { icon: <MessageCircle className="h-6 w-6 text-gold" />, t: 'Conseil sans jugement', d: 'Une conseillère répond sur WhatsApp, y compris depuis l’étranger.' },
            { icon: <Plane className="h-6 w-6 text-gold" />, t: 'Importé directement d’Europe', d: 'France, Espagne, Angleterre. Des pièces authentiques, pas des copies.' },
          ].map((x) => (
            <li key={x.t} className="flex items-start gap-4 py-6 sm:px-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30">{x.icon}</span>
              <span><strong className="block font-medium text-ivory">{x.t}</strong><span className="text-[15px] text-ivory-2">{x.d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2.1 — Bloc 3 : appel au guide des tailles + École du bon maintien */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-4">L’École du bon maintien</p>
            <h2 className="h-section text-balance">Vous ne connaissez pas votre taille ? Vous n’êtes pas la seule.</h2>
            <div className="body-copy mt-6">
              <p>La plupart des femmes portent un soutien-gorge qui ne leur va pas. Bande qui remonte, bretelles qui marquent, armature qui blesse : ce n’est pas votre corps qui a un problème.</p>
              <p className="text-ivory">Deux mesures, deux minutes, et vous saurez.</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="btn-gold px-8" onClick={() => openSizeGuide('accueil-guide')}><Ruler className="h-5 w-5" />Trouver ma taille</button>
              <Link to="/conseils" className="btn-line">Tous nos conseils</Link>
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <p className="eyebrow mb-5">Nos bonnets</p>
            <ul className="grid grid-cols-5 gap-2 sm:gap-3" aria-label="Bonnets disponibles du A au O">
              {BRAND.cups.map((c) => (
                <li key={c}>
                  <Link to={`/boutique?bonnet=${c}`} onClick={() => track('cup_filter', { cup: c, source: 'accueil' })} className="flex aspect-square items-center justify-center rounded-xl border border-gold/25 font-serif text-2xl text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:text-3xl" aria-label={`Voir les pièces en bonnet ${c}`}>{c}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-mute">Un grand bonnet n’est pas un problème d’ingénierie à résoudre. C’est une taille, comme les autres. <Link to="/toutes-les-tailles" className="text-gold hover:underline">Notre amplitude réelle</Link></p>
          </div>
        </div>
      </Section>

      {/* 2.1 — Bloc 4 : transition vers le catalogue */}
      <Section tone="ink2">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead title="Nos pièces">
            Soutiens-gorge, ensembles, nuisettes, culottes, bétio (pagne intime traditionnel), linge de maison. Chaque pièce est disponible dans une amplitude réelle de tailles, pas seulement sur le papier. À partir de 33&nbsp;000&nbsp;FCFA.
          </SectionHead>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ENTRY_TILES.map((t) => {
            const p = BY_SLUG.get(t.slug);
            return (
              <li key={t.label}>
                <Link to={t.to} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-ink-3">
                  {p && <Img image={p.images[0]} alt="" sizes="(min-width:1024px) 22vw, 45vw" className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-4 pt-16">
                    <span className="flex items-center justify-between font-serif text-xl text-ivory sm:text-2xl">{t.label}<ArrowRight className="h-5 w-5 text-gold" aria-hidden /></span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {newIn.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h3 className="font-serif text-3xl">Nouveautés</h3>
              <Link to="/boutique?tri=nouveautes" className="btn-ghost">Tout voir<ArrowRight className="h-4 w-4" /></Link>
            </div>
            <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 hide-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {newIn.map((p) => <li key={p.slug} className="w-[62%] shrink-0 snap-start sm:w-auto"><ProductCard p={p} /></li>)}
            </ul>
          </div>
        )}
        <div className="mt-12 text-center"><Link to="/boutique" className="btn-gold px-8">Découvrir la collection</Link></div>
      </Section>

      {/* Accueil, section 5 — Héritage */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="order-2 grid grid-cols-2 gap-3 lg:order-1">
            {HERITAGE.map((p, i) => (
              <Link key={p.slug} to={`/boutique/${p.slug}`} className={`overflow-hidden rounded-2xl bg-ink-3 ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                <Img image={p.images[0]} alt={p.name} sizes="(min-width:1024px) 22vw, 45vw" className="h-full w-full" />
              </Link>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow mb-4">Héritage</p>
            <h2 className="h-section text-balance">Notre héritage, enfin au niveau qu’il mérite</h2>
            <p className="body-copy mt-6">Longtemps, le bétio (pagne intime traditionnel) est resté une affaire de chambre et de transmission orale. Nous avons décidé de lui donner ce qu’on ne lui avait jamais donné : de la soie, des finitions de maison, et une vitrine.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/heritage" className="btn-gold">Découvrir la collection</Link>
              <Link to="/mariee" className="btn-line">Composer mon trousseau</Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Accueil, section 6 — Amplitude (2.4) */}
      <section className="relative overflow-hidden border-y border-gold/10 bg-ink-2 py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 select-none font-serif text-[22rem] leading-none text-gold/[0.05] lg:block">A–O</div>
        <div className="container-x relative">
          <p className="eyebrow mb-4">Toutes les tailles</p>
          <h2 className="h-section max-w-3xl text-balance">Du bonnet A au bonnet O. Vraiment.</h2>
          <p className="lead mt-5 max-w-prose">Beaucoup de marques disent qu’elles habillent toutes les femmes. Peu s’engagent sur des chiffres. Voici les nôtres.</p>
          <dl className="mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            <div className="card p-5"><dt className="text-sm text-mute">Bonnets</dt><dd className="mt-1 font-serif text-3xl text-ivory">du A au O</dd></div>
            <div className="card p-5"><dt className="text-sm text-mute">Culottes et pièces souples</dt><dd className="mt-1 font-serif text-3xl text-ivory">du S au 3XL</dd></div>
            <div className="card p-5"><dt className="text-sm text-mute">À notre connaissance</dt><dd className="mt-1 text-[15px] leading-snug text-ivory">l’amplitude la plus large disponible en Afrique de l’Ouest</dd></div>
          </dl>
          <ul className="mt-10 flex flex-wrap gap-2">
            {[
              ['Forte poitrine', '/toutes-les-tailles#forte-poitrine'], ['Petite poitrine', '/toutes-les-tailles#petite-poitrine'], ['Grossesse et allaitement', '/toutes-les-tailles#grossesse'],
              ['Après l’accouchement', '/toutes-les-tailles#apres-accouchement'], ['Après une mastectomie', '/apres-mastectomie'], ['Ménopause et après', '/toutes-les-tailles#menopause'], ['Sport', '/toutes-les-tailles#sport'],
            ].map(([l, to]) => <li key={l}><Link to={to} className="chip border-gold/30 text-ivory-2 hover:border-gold hover:text-ivory">{l}</Link></li>)}
          </ul>
        </div>
      </section>

      {/* Accueil, section 7 — Mariée */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-4">Mariée</p>
            <h2 className="h-section text-balance">Le trousseau de la mariée</h2>
            <div className="body-copy mt-6">
              <p>Chez nous, le trousseau ne se prépare pas seule. Une mère, des tantes, des amies, un mbotaay (groupe de femmes qui se soutiennent) : tout le monde y participe.</p>
              <p>Nous avons conçu cette section pour cela. Les plus belles maisons européennes d’un côté, notre héritage de l’autre, et de quoi organiser l’ensemble sans y passer ses nuits.</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/mariee" className="btn-gold">Composer mon trousseau</Link>
              <Link to="/mariee/liste" className="btn-line">Créer ma liste</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BRIDE.map((p) => (
              <Link key={p.slug} to={`/boutique/${p.slug}`} className="aspect-[3/5] overflow-hidden rounded-2xl bg-ink-3">
                <Img image={p.images[0]} alt={p.name} sizes="(min-width:1024px) 15vw, 30vw" className="h-full w-full" />
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Maisons distribuées : caution immédiate (2.6) */}
      <section aria-label="Nos maisons" className="border-y border-gold/10 bg-ink-2 py-10">
        <div className="container-x">
          <p className="mb-5 text-center text-sm text-mute">Les maisons que nous avons choisies, importées directement de France, d’Espagne et d’Angleterre</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {BRANDS_DISTRIBUTED.map((b) => (
              <li key={b}><Link to={`/boutique?maison=${encodeURIComponent(b)}`} className="font-serif text-2xl text-ivory-2 transition-colors hover:text-gold sm:text-[1.7rem]">{b}</Link></li>
            ))}
          </ul>
          <p className="mt-6 text-center"><Link to="/maisons" className="btn-ghost">Pourquoi ces maisons<ArrowRight className="h-4 w-4" /></Link></p>
        </div>
      </section>

      {/* Accueil, section 8 — Témoignages (2.9) : aucun témoignage inventé. Section affichée dès qu'un témoignage réel est saisi dans site.ts. */}
      {TESTIMONIALS.length > 0 ? (
        <Section>
          <SectionHead eyebrow="Témoignages" title="Elles sont passées avant vous" center>
            Toutes les femmes citées ici sont des clientes réelles, qui ont accepté que nous publiions leurs mots. Nous n’en avons modifié aucun.
          </SectionHead>
          <ul className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <li key={t.quote} className="flex flex-col rounded-2xl border border-gold/20 p-6">
                <Quote className="h-6 w-6 text-gold/60" aria-hidden />
                <p className="mt-4 flex-1 text-[15px] italic text-ivory-2">« {t.quote} »</p>
                <p className="mt-4 text-sm text-mute">{t.author}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-ivory-2">Vous êtes cliente ? <a className="text-gold hover:underline" href={waLink('Bonjour Chambre 69, je souhaite laisser un témoignage.')} target="_blank" rel="noopener noreferrer">Deux phrases de vous, pour celles qui hésitent encore.</a></p>
        </Section>
      ) : (
        <Section>
          <div className="mx-auto max-w-2xl text-center">
            <Quote className="mx-auto h-7 w-7 text-gold/60" aria-hidden />
            <h2 className="h-section mt-4">Vous êtes déjà passée chez nous ?</h2>
            <p className="body-copy mt-4">Deux phrases de vous peuvent aider celles qui hésitent encore. Nous ne publions un témoignage qu’avec votre accord écrit, et sans en changer un mot.</p>
            <a className="btn-line mt-6" href={waLink('Bonjour Chambre 69, je souhaite laisser un témoignage.')} target="_blank" rel="noopener noreferrer">Laisser un témoignage</a>
          </div>
        </Section>
      )}

      {/* Accueil, section 9 — Preuve d'existence physique */}
      <Section tone="ink2">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <figure className="overflow-hidden rounded-2xl bg-ink-3">
            <img src="/brand/boutique-facade-480.webp" srcSet="/brand/boutique-facade-480.webp 480w, /brand/boutique-facade-960.webp 960w" sizes="(min-width:1024px) 40vw, 100vw" width={960} height={1280} loading="lazy" alt="Façade d’une boutique Chambre 69 à Dakar, vitrine de lingerie et enseigne dorée" className="aspect-[4/5] w-full object-cover" />
          </figure>
          <div>
            <p className="eyebrow mb-4">Nos boutiques</p>
            <h2 className="h-section text-balance">Deux ans, deux boutiques. Nous existons pour de vrai.</h2>
            <p className="body-copy mt-6">Vous pouvez venir sans rendez-vous, essayer, poser vos questions, et repartir sans rien acheter.</p>
            <ul className="mt-8 space-y-4">
              {STORES.map((s) => (
                <li key={s.id} className="card p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link to={`/nos-boutiques/${s.id}`} className="font-serif text-2xl text-ivory hover:text-gold">{s.district}</Link>
                    <span className="text-sm text-mute">Dakar, Sénégal</span>
                  </div>
                  <p className="mt-1 text-sm text-mute">{s.address || s.context}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={directionsUrl(s.mapsQuery)} target="_blank" rel="noopener noreferrer" onClick={() => track('directions_click', { store: s.id })} className="btn-line min-h-[44px] px-4 text-sm"><Navigation className="h-4 w-4" />Itinéraire</a>
                    <a href={BRAND.phoneHref} className="btn-line min-h-[44px] px-4 text-sm"><Phone className="h-4 w-4" />Appeler</a>
                    <WaButton message={`Bonjour Chambre 69, je souhaite passer à la boutique ${s.district}.`} source={`accueil-boutique-${s.id}`} className="min-h-[44px] px-4 text-sm">Écrire sur WhatsApp</WaButton>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Accueil, section 10 — Communauté */}
      <Section>
        <div className="text-center">
          <p className="eyebrow mb-4">{COMMUNITY.handle}</p>
          <h2 className="h-section">Notre mbotaay (groupe de femmes qui se soutiennent)</h2>
          <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {COMMUNITY.networks.map((n) => (
              <li key={n.id} className="card p-5">
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="block">
                  <span className="block font-serif text-4xl text-gold">{fmt(n.count)}</span>
                  <span className="text-sm text-ivory-2">sur {n.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="lead mx-auto mt-8 max-w-2xl">Plus de {total >= 70000 ? 'soixante-dix mille' : fmt(total)} femmes qui parlent enfin de tout cela sans baisser la voix.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a className="btn-gold" href={COMMUNITY.networks[0].url} target="_blank" rel="noopener noreferrer">Nous suivre sur TikTok</a>
            <a className="btn-line" href={COMMUNITY.networks[1].url} target="_blank" rel="noopener noreferrer">Nous suivre sur Instagram</a>
          </div>
          <p className="mt-6 text-xs text-mute">Chiffres arrêtés en {COMMUNITY.updatedAt}.</p>
        </div>
      </Section>

      {/* Dernier appel : conseil */}
      <section className="border-t border-gold/10 bg-ink-2 py-14">
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">Une question sur une taille, une pièce, une livraison ?</h2>
          <p className="max-w-xl text-ivory-2">Une conseillère vous répond sur WhatsApp, y compris depuis l’étranger. Le numéro fonctionne comme un numéro ordinaire.</p>
          <WaButton message={MESSAGES.general} source="accueil-bas">Parler à une conseillère</WaButton>
        </div>
      </section>
    </>
  );
}
