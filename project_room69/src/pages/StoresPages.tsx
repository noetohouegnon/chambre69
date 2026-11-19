import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navigation, Phone, MapPin, Clock, Car, Package } from 'lucide-react';
import { PageHero, Section } from '../components/ui/Section';
import { WaButton } from '../components/ui/WaButton';
import { STORES, BRAND, directionsUrl, SITE_URL, type Store } from '../data/site';
import { track } from '../lib/analytics';
import { NotFoundPage } from './NotFoundPage';

function MapFacade({ store }: { store: Store }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/15 bg-ink-3">
      {on ? (
        <iframe title={`Carte — ${store.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(store.mapsQuery)}&output=embed`} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <button onClick={() => setOn(true)} className="flex h-full w-full flex-col items-center justify-center gap-3 text-ivory-2 hover:text-ivory">
          <MapPin className="h-8 w-8 text-gold" />
          <span>Afficher la carte interactive</span>
          <span className="text-xs text-mute">Chargée à la demande, pour ne pas ralentir la page</span>
        </button>
      )}
    </div>
  );
}

function StoreActions({ s }: { s: Store }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a href={directionsUrl(s.mapsQuery)} target="_blank" rel="noopener noreferrer" onClick={() => track('directions_click', { store: s.id })} className="btn-gold"><Navigation className="h-4 w-4" />Itinéraire</a>
      <a href={BRAND.phoneHref} className="btn-line"><Phone className="h-4 w-4" />Appeler</a>
      <WaButton message={`Bonjour Chambre 69, je souhaite passer à la boutique ${s.district}.`} source={`boutique-${s.id}`}>Écrire sur WhatsApp</WaButton>
    </div>
  );
}

export function StoresPage() {
  return (
    <>
      <PageHero eyebrow="Nos boutiques" title="Deux ans, deux adresses" crumbs={[{ label: 'Nos boutiques' }]}>
        <p>Nous avons ouvert à Point E, puis sur la Corniche Ouest. Deux boutiques où l’on entre sans rendez-vous, où l’on se fait mesurer sans gêne, où l’on essaie sans se justifier.</p>
      </PageHero>
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {STORES.map((s) => (
            <article key={s.id} className="card p-6 sm:p-8">
              <p className="eyebrow">Dakar, Sénégal</p>
              <h2 className="mt-3 font-serif text-4xl"><Link to={`/nos-boutiques/${s.id}`} className="hover:text-gold">{s.district}</Link></h2>
              <p className="mt-2 text-ivory-2">{s.context}</p>
              <div className="mt-5">{s.address ? <><p>{s.address}</p>{s.hours && <p className="mt-1 text-sm text-mute">{s.hours.map((h) => `${h.day} : ${h.time}`).join(' · ')}</p>}</> : <p className="text-sm text-mute">Pour l’adresse exacte et les horaires du jour, utilisez « Itinéraire » ou écrivez-nous sur WhatsApp : nous vous guidons jusqu’à la porte.</p>}</div>
              <div className="mt-6"><StoreActions s={s} /></div>
              <Link to={`/nos-boutiques/${s.id}`} className="btn-ghost mt-4">Toutes les informations</Link>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="card p-5"><Package className="h-6 w-6 text-gold" /><p className="mt-3 text-ivory">Retrait des commandes en ligne</p><p className="text-sm text-mute">Pratique pendant un séjour à Dakar : vous essayez sur place.</p></div>
          <div className="card p-5"><Clock className="h-6 w-6 text-gold" /><p className="mt-3 text-ivory">Sans rendez-vous</p><p className="text-sm text-mute">Ou sur rendez-vous pour une prise de mesures en salon fermé.</p></div>
          <div className="card p-5"><MapPin className="h-6 w-6 text-gold" /><p className="mt-3 text-ivory">Échange d’une commande en ligne</p><p className="text-sm text-mute">Dans l’une ou l’autre de nos deux adresses.</p></div>
        </div>
        <div className="mt-10"><Link to="/rendez-vous" className="btn-line">Prendre rendez-vous</Link></div>
      </Section>
    </>
  );
}

export function StorePage() {
  const { id } = useParams();
  const s = STORES.find((x) => x.id === id);
  if (!s) return <NotFoundPage />;
  const ld = {
    '@context': 'https://schema.org', '@type': 'ClothingStore', name: s.name, url: `${SITE_URL}/nos-boutiques/${s.id}`, telephone: `+${BRAND.whatsappNumber}`, priceRange: 'À partir de 33 000 FCFA',
    address: { '@type': 'PostalAddress', streetAddress: s.address || undefined, addressLocality: 'Dakar', addressRegion: s.district, addressCountry: 'SN' },
    image: `${SITE_URL}/brand/boutique-facade-960.webp`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero eyebrow="Boutique Chambre 69" title={`${s.district}, Dakar`} crumbs={[{ label: 'Nos boutiques', to: '/nos-boutiques' }, { label: s.district }]}>
        <p>{s.context}. Venez sans rendez-vous, essayez, posez vos questions, et repartez sans rien acheter si rien ne vous convient.</p>
      </PageHero>
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="flex items-center gap-2 font-serif text-3xl"><MapPin className="h-6 w-6 text-gold" />Adresse et repères</h2>
              <div className="mt-3">{s.address ? <p>{s.address}<br />{s.landmarks}</p> : <p className="text-ivory-2">{s.context}. Le bouton « Itinéraire » vous guide jusqu’à la boutique ; en cas de doute, écrivez-nous sur WhatsApp et une conseillère vous donne les repères du quartier.</p>}</div>
            </div>
            <div>
              <h2 className="flex items-center gap-2 font-serif text-3xl"><Clock className="h-6 w-6 text-gold" />Horaires</h2>
              <div className="mt-3">{s.hours ? <><ul>{s.hours.map((h) => <li key={h.day} className="flex justify-between border-b border-gold/10 py-2"><span>{h.day}</span><span>{h.time}</span></li>)}</ul><p className="mt-3 text-sm text-mute">Pendant le Ramadan et les fêtes, les horaires peuvent changer : appelez-nous ou écrivez-nous avant de passer.</p></> : <p className="text-ivory-2">Les horaires peuvent varier pendant le Ramadan et les fêtes : appelez-nous ou écrivez-nous sur WhatsApp avant de passer, nous vous confirmons l’ouverture du jour.</p>}</div>
            </div>
            {s.parking && (
              <div>
                <h2 className="flex items-center gap-2 font-serif text-3xl"><Car className="h-6 w-6 text-gold" />Stationnement et accès</h2>
                <div className="mt-3"><p>{s.parking}</p></div>
              </div>
            )}
            <div className="card p-5">
              <p className="text-ivory">Retrait en boutique</p>
              <p className="mt-1 text-sm text-ivory-2">Vous commandez en ligne, depuis Dakar ou depuis l’étranger, et vous retirez ici pendant votre passage. Nous gardons vos pièces de côté.</p>
            </div>
            <StoreActions s={s} />
          </div>
          <div className="space-y-6">
            <MapFacade store={s} />
            <figure className="overflow-hidden rounded-2xl bg-ink-3">
              <img src="/brand/boutique-facade-960.webp" width={960} height={1280} loading="lazy" alt="Vitrine Chambre 69 à Dakar" className="aspect-[4/3] w-full object-cover" />
            </figure>
          </div>
        </div>
      </Section>
    </>
  );
}
