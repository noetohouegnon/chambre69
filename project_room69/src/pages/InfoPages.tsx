import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Download } from 'lucide-react';
import { PageHero, Section } from '../components/ui/Section';
import { WaButton } from '../components/ui/WaButton';
import { Newsletter } from '../components/Newsletter';
import { MESSAGES } from '../lib/whatsapp';
import { BRAND, ZONES, SITE_URL, exchangeDelayText } from '../data/site';
import { setConsent, getConsent, needsConsent } from '../lib/analytics';

/* ---------- Carte cadeau (5.5) ---------- */
export function GiftCardPage() {
  const [amount, setAmount] = useState('50000');
  const [custom, setCustom] = useState('');
  const value = amount === 'libre' ? custom : amount;
  const fmt = (v: string) => Number(v).toLocaleString('fr-FR').replace(/\u202f|\s/g, '\u00a0');
  return (
    <>
      <PageHero eyebrow="Carte cadeau" title="Offrir une carte cadeau" crumbs={[{ label: 'Carte cadeau' }]}>
        <p>Si vous hésitez sur la taille, la carte cadeau règle la question sans en avoir l’air. Elle s’utilise en boutique comme en ligne, et s’offre depuis Dakar comme depuis l’étranger.</p>
      </PageHero>
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[1.6] overflow-hidden rounded-3xl border border-or/60 bg-bordeaux p-8 shadow-2xl">
            <img src="/brand/logo-wide.png" alt="" width={482} height={105} className="h-10 w-auto" />
            <p className="absolute bottom-8 left-8 font-serif text-4xl text-creme">{value ? `${fmt(value)} FCFA` : 'Montant libre'}</p>
            <p className="absolute bottom-8 right-8 text-sm text-or">Au-delà de la lingerie</p>
          </div>
          <div>
            <fieldset>
              <legend className="mb-3 text-[15px] font-medium">Montant</legend>
              <div className="flex flex-wrap gap-2">
                {['33000', '50000', '100000', '150000', 'libre'].map((a) => (
                  <button key={a} type="button" aria-pressed={amount === a} onClick={() => setAmount(a)} className={`chip ${amount === a ? 'border-gold bg-gold text-ink' : 'border-ivory/20 text-ivory-2 hover:border-gold'}`}>{a === 'libre' ? 'Montant libre' : `${fmt(a)} FCFA`}</button>
                ))}
              </div>
              {amount === 'libre' && (
                <div className="mt-4 max-w-xs">
                  <label htmlFor="gc-amount" className="label">Montant en FCFA</label>
                  <input id="gc-amount" inputMode="numeric" className="field" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ''))} />
                </div>
              )}
            </fieldset>
            <ul className="mt-6 space-y-2 text-ivory-2">
              <li className="flex gap-2"><Gift className="h-5 w-5 text-gold" />Remise dans une enveloppe neutre, ou envoyée par WhatsApp</li>
              <li className="flex gap-2"><Gift className="h-5 w-5 text-gold" />Message personnel possible</li>
            </ul>
            <WaButton message={`${MESSAGES.giftCard} Montant : ${value ? `${fmt(value)} FCFA` : 'à définir'}.`} source="carte-cadeau" className="mt-8">Offrir une carte cadeau</WaButton>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ---------- FAQ (2.11) ---------- */
const FAQ: { cat: string; q: string; a: React.ReactNode; text: string }[] = [
  { cat: 'Tailles', q: 'Jusqu’à quelle taille montez-vous ?', text: 'Du bonnet A au bonnet O, et du S au 3XL pour les culottes et pièces souples.', a: <>Du bonnet A au bonnet O, et du S au 3XL pour les culottes et les pièces souples. <Link to="/toutes-les-tailles" className="text-gold hover:underline">Notre amplitude réelle</Link></> },
  { cat: 'Tailles', q: 'Je ne connais pas ma taille. Comment faire ?', text: 'Notre guide des tailles vous donne un point de départ en deux minutes, puis une conseillère vérifie avec vous sur WhatsApp. Vous pouvez aussi venir vous faire mesurer gratuitement en boutique.', a: <>Notre <Link to="/guide-des-tailles" className="text-gold hover:underline">guide des tailles</Link> vous donne un point de départ en deux minutes, puis une conseillère vérifie avec vous sur WhatsApp. Vous pouvez aussi venir vous faire mesurer gratuitement en boutique : vingt minutes, en salon fermé.</> },
  { cat: 'Livraison', q: 'Livrez-vous hors de Dakar ?', text: 'Oui : dans les régions du Sénégal, en Afrique de l’Ouest et à l’international. Les frais et le délai se règlent avec votre conseillère, sur WhatsApp ou par téléphone.', a: <>Oui : dans les régions du Sénégal, en Afrique de l’Ouest et à l’international. Les frais et le délai se règlent avec votre conseillère, sur WhatsApp ou par téléphone, avant toute validation. <Link to="/livraison-retours" className="text-gold hover:underline">Livraison et retours</Link></> },
  { cat: 'Livraison', q: 'Puis-je commander depuis la France et faire livrer ma mère à Dakar ?', text: 'Oui. Cochez « Commande à offrir » dans votre panier : l’adresse de livraison est différente de la vôtre, le prix n’apparaît pas sur le colis, et nous vous prévenons quand elle l’a reçu.', a: <>Oui. Cochez « Commande à offrir » dans votre panier : l’adresse de livraison est différente de la vôtre, le prix n’apparaît pas sur le colis, et nous vous prévenons quand elle l’a reçu. <Link to="/commander-depuis-l-etranger" className="text-gold hover:underline">Commander depuis l’étranger</Link></> },
  { cat: 'Discrétion', q: 'Le colis est-il discret ?', text: 'Oui. Il est expédié dans un emballage neutre, sans mention du contenu ni du nom de la boutique à l’extérieur.', a: 'Oui. Il est expédié dans un emballage neutre, sans mention du contenu ni du nom de la boutique à l’extérieur. Vous pouvez aussi demander à n’être contactée que par WhatsApp.' },
  { cat: 'Paiement', q: 'Comment se passe le règlement ?', text: 'Votre commande est envoyée à une conseillère sur WhatsApp. Elle confirme la disponibilité, les frais et le délai, puis convient avec vous du règlement. Rien n’est expédié avant votre accord.', a: 'Votre commande est envoyée à une conseillère sur WhatsApp. Elle confirme la disponibilité de chaque taille, les frais et le délai, puis convient avec vous du règlement. Rien n’est expédié avant votre accord, et le libellé reste discret.' },
  { cat: 'Retours', q: 'Puis-je échanger une pièce ?', text: 'Oui, en boutique, dans le délai indiqué dans notre politique. Pour des raisons d’hygiène, certaines pièces portées à même la peau ne peuvent être ni reprises ni échangées.', a: <>Oui, dans l’une de nos deux boutiques, {exchangeDelayText()}. Pour des raisons d’hygiène, les culottes, strings et pièces portées à même la peau ne peuvent être reprises que non portées, avec leur protection d’origine. C’est une règle de respect pour chaque cliente. <Link to="/livraison-retours" className="text-gold hover:underline">Notre politique</Link></> },
  { cat: 'Disponibilité', q: 'Les tailles affichées sont-elles en stock ?', text: 'Une conseillère confirme la disponibilité exacte de votre taille avant toute expédition. Une taille indisponible reste visible, avec une alerte de retour en stock.', a: 'Une conseillère confirme la disponibilité exacte de votre taille avant toute expédition. Une taille indisponible reste visible, et vous pouvez demander à être prévenue de son retour.' },
  { cat: 'Rendez-vous', q: 'Faut-il prendre rendez-vous ?', text: 'Non, nos boutiques vous accueillent sans rendez-vous. Pour une prise de mesures, un trousseau ou un accompagnement après mastectomie, un rendez-vous vous garantit un salon fermé et le temps qu’il faut.', a: <>Non, nos boutiques vous accueillent sans rendez-vous. Pour une prise de mesures, un trousseau ou un accompagnement après mastectomie, un rendez-vous vous garantit un salon fermé et le temps qu’il faut. <Link to="/rendez-vous" className="text-gold hover:underline">Prendre rendez-vous</Link></> },
  { cat: 'Authenticité', q: 'Vos pièces sont-elles authentiques ?', text: 'Oui. Nous importons directement de France, d’Espagne et d’Angleterre. Ce sont des pièces authentiques, pas des copies.', a: 'Oui. Nous importons directement de France, d’Espagne et d’Angleterre. Ce sont des pièces authentiques, pas des copies.' },
];

export function FaqPage() {
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.text } })) };
  const cats = [...new Set(FAQ.map((f) => f.cat))];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero eyebrow="Questions fréquentes" title="Vos questions, nos réponses" crumbs={[{ label: 'Questions fréquentes' }]} />
      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {cats.map((c) => (
            <section key={c}>
              <h2 className="mb-4 font-serif text-3xl text-gold">{c}</h2>
              <div className="divide-y divide-gold/10 border-y border-gold/10">
                {FAQ.filter((f) => f.cat === c).map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-[17px] text-ivory">{f.q}<span className="text-gold transition-transform group-open:rotate-45" aria-hidden>+</span></summary>
                    <p className="mt-2 text-ivory-2">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <div className="card p-6 text-center">
            <p className="text-ivory">Votre question n’est pas là ?</p>
            <WaButton message={MESSAGES.general} source="faq" className="mt-4">Parler à une conseillère</WaButton>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ---------- Livraison et retours ---------- */
export function DeliveryPage() {
  return (
    <>
      <PageHero eyebrow="Informations pratiques" title="Livraison, échanges et retours" crumbs={[{ label: 'Livraison et retours' }]}>
        <p>Nous livrons au Sénégal, en Afrique de l’Ouest et à l’international, dans un colis neutre. Chaque commande est confirmée par une conseillère avant expédition.</p>
      </PageHero>
      <Section>
        <div className="mx-auto max-w-4xl space-y-14">
          <section>
            <h2 className="h-section">Zones de livraison</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {ZONES.map((z) => (
                <li key={z.id} className="card p-6">
                  <h3 className="font-serif text-2xl">{z.label}</h3>
                  <p className="mt-2 text-sm text-ivory-2">{z.countries.join(', ')}</p>
                  
                  <ul className="mt-3 space-y-1 text-sm text-ivory-2">{z.notes.map((n) => <li key={n}>· {n}</li>)}</ul>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-mute">Les frais et le délai de livraison se règlent directement avec votre conseillère, sur WhatsApp ou par téléphone, avant toute validation. Rien n’est expédié sans votre accord.</p>
          </section>
          <section className="body-copy">
            <h2 className="h-section">Discrétion</h2>
            <p className="mt-4">Votre commande est expédiée dans un emballage neutre, sans mention du contenu ni du nom de la boutique à l’extérieur. Personne ne sait ce qu’il y a dans le colis.</p>
            <p>Vous pouvez demander à n’être contactée que par WhatsApp, sans appel. Le libellé de règlement reste discret.</p>
          </section>
          <section className="body-copy">
            <h2 className="h-section">Retrait en boutique</h2>
            <p className="mt-4">Vous pouvez retirer votre commande à Point E ou sur la Corniche Ouest, à Dakar. Pour les clientes de passage, nous gardons vos pièces de côté jusqu’à la date que vous nous indiquez.</p>
          </section>
          <section className="body-copy">
            <h2 className="h-section">Échanges et retours</h2>
            <p className="mt-4">Une pièce commandée en ligne peut être essayée et échangée dans l’une de nos deux boutiques, {exchangeDelayText()}.</p>
            <p>Pour des raisons d’hygiène, les culottes, strings et pièces portées à même la peau ne peuvent être échangés que non portés, avec leur protection d’origine. Nous l’appliquons pour chacune de nos clientes : c’est ce qui vous garantit de recevoir une pièce que personne n’a portée.</p>
            <p>Hors du Sénégal, écrivez-nous : nous trouvons une solution au cas par cas, et nous vous disons honnêtement ce qui est possible avant que vous ne commandiez.</p>
          </section>
          <section className="body-copy">
            <h2 className="h-section">Droits et taxes</h2>
            <p className="mt-4">Selon votre pays, des droits de douane peuvent s’appliquer à la réception. Nous vous l’indiquons avant la commande, jamais après.</p>
          </section>
          <WaButton message={MESSAGES.abroad()} source="livraison">Parler livraison avec une conseillère</WaButton>
        </div>
      </Section>
    </>
  );
}

/* ---------- Inscription ---------- */
export function NewsletterPage() {
  return (
    <>
      <PageHero eyebrow="L’École du bon maintien" title="Recevez notre guide des tailles et nos nouveautés" crumbs={[{ label: 'Inscription' }]}>
        <p>Deux messages par mois, pas davantage. Vous pouvez vous désinscrire en un clic, et nous ne partageons jamais vos coordonnées.</p>
      </PageHero>
      <Section><div className="mx-auto max-w-2xl"><Newsletter id="nl-page" /></div></Section>
    </>
  );
}

/* ---------- Presse ---------- */
export function PressPage() {
  return (
    <>
      <PageHero eyebrow="Presse" title="Espace presse" crumbs={[{ label: 'Espace presse' }]}>
        <p>Chambre 69 est une maison de lingerie experte et conseillère, installée à Dakar depuis deux ans, avec deux boutiques. Du bonnet A au bonnet O.</p>
      </PageHero>
      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          <a href="/brand/logo-mark.png" download className="card flex items-center justify-between gap-4 p-6 hover:border-gold/40"><span><span className="block text-ivory">Logo Chambre 69</span><span className="text-sm text-mute">PNG, fond transparent — autres formats sur demande</span></span><Download className="h-5 w-5 text-gold" /></a>
          <a href="/brand/boutique-facade-960.webp" download className="card flex items-center justify-between gap-4 p-6 hover:border-gold/40"><span><span className="block text-ivory">Vitrine de la boutique</span><span className="text-sm text-mute">WebP — visuels haute définition sur demande</span></span><Download className="h-5 w-5 text-gold" /></a>
        </div>
        <div className="mt-8 card p-6"><p className="text-ivory">Contact presse</p><p className="mt-2 text-ivory-2"><a href={`mailto:${BRAND.email}?subject=Presse`} className="text-gold hover:underline">{BRAND.email}</a> · {BRAND.whatsappDisplay}</p></div>
      </Section>
    </>
  );
}

/* ---------- Pages légales (2.11, 10.2) ---------- */
function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero title={title} crumbs={[{ label: title }]} />
      <Section><div className="body-copy mx-auto space-y-6 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-ivory">{children}</div></Section>
    </>
  );
}

export function TermsPage() {
  return (
    <Legal title="Conditions générales de vente">
      <h2>1. Objet</h2><p>Les présentes conditions régissent les ventes conclues entre Chambre 69 et toute cliente passant commande sur le site {SITE_URL}, en boutique ou par WhatsApp.</p>
      <h2>2. Commande</h2><p>La commande est transmise à une conseillère, qui confirme la disponibilité de chaque taille, les frais de livraison et le délai. La vente est conclue à l’acceptation de cette confirmation par la cliente.</p>
      <h2>3. Prix</h2><p>Les prix sont exprimés en francs CFA (FCFA). Une conversion en euros ou en dollars peut être indiquée à titre purement indicatif. Les frais de livraison sont communiqués avant la confirmation de la commande.</p>
      <h2>4. Règlement</h2><p>Les modalités de règlement sont convenues avec la conseillère lors de la confirmation de la commande. Aucune donnée bancaire n’est conservée par Chambre 69.</p>
      <h2>5. Livraison</h2><p>Chambre 69 livre au Sénégal, dans les pays d’Afrique de l’Ouest desservis et à l’international. Pour les livraisons hors Sénégal, d’éventuels droits et taxes peuvent être dus par la destinataire ; ils sont annoncés avant la commande.</p>
      <h2>6. Échanges et retours</h2><p>Les échanges s’effectuent en boutique, {exchangeDelayText()}. Pour des raisons d’hygiène, les pièces portées à même la peau ne sont échangées que non portées, dans leur protection d’origine.</p>
      <h2>7. Données personnelles</h2><p>Voir notre <Link to="/confidentialite" className="text-gold hover:underline">politique de confidentialité</Link>.</p>
      <h2>8. Droit applicable</h2><p>Les présentes conditions sont soumises au droit sénégalais.</p>
    </Legal>
  );
}

export function PrivacyPage() {
  return (
    <Legal title="Politique de confidentialité">
      <h2>Ce que nous collectons</h2><p>Les informations que vous nous transmettez volontairement : prénom, coordonnées, pays, adresse de livraison, taille, et le contenu de vos messages.</p>
      <h2>Pourquoi</h2><p>Pour traiter vos commandes et rendez-vous, vous conseiller, et — seulement si vous l’avez accepté — vous envoyer nos actualités, segmentées par pays.</p>
      <h2>Combien de temps</h2><p>Trois ans après notre dernier échange pour les données de contact, et la durée légale pour les données de facturation.</p>
      <h2>Vos droits</h2><p>Vous pouvez accéder à vos données, les rectifier, les supprimer ou vous opposer à leur utilisation en écrivant à {BRAND.email}. Ces droits s’appliquent conformément à la loi sénégalaise sur la protection des données personnelles et, pour les clientes résidant en Europe, au règlement européen (RGPD).</p>
      <h2>Partage</h2><p>Vos données ne sont jamais vendues ni partagées à des fins commerciales. Elles ne sont transmises qu’aux prestataires nécessaires (livraison, messagerie) dans la limite de leur mission.</p>
    </Legal>
  );
}

export function CookiesPage() {
  const [c, setC] = useState(getConsent());
  return (
    <Legal title="Politique de cookies">
      <p>Nous mesurons la fréquentation du site de façon anonyme, sans cookie et sans aucune donnée personnelle : nous savons combien de pages sont vues, pas qui les voit.</p>
      <p>Le site enregistre dans votre navigateur, sans traceur tiers, votre panier, votre liste de trousseau et votre choix de consentement, pour que vous les retrouviez.</p>
      {needsConsent ? (
        <p>Des outils de mesure et de publicité (Google Analytics, Meta) ne sont chargés qu’avec votre accord. Sans accord, aucun de ces scripts n’est chargé.</p>
      ) : (
        <p>Aucun traceur publicitaire n’est utilisé sur ce site.</p>
      )}
      {needsConsent && <h2>Votre choix</h2>}
      {needsConsent && <><p>Choix actuel : <strong className="text-ivory">{c === 'granted' ? 'mesure d’audience acceptée' : c === 'denied' ? 'mesure d’audience refusée' : 'aucun choix enregistré'}</strong>.</p>
      <div className="flex flex-wrap gap-3">
        <button className="btn-line" onClick={() => { setConsent('denied'); setC('denied'); }}>Refuser</button>
        <button className="btn-line" onClick={() => { setConsent('granted'); setC('granted'); }}>Accepter</button>
      </div></>}
    </Legal>
  );
}
