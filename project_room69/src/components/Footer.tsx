import { Link } from 'react-router-dom';
import { Instagram, Facebook, Phone, Mail } from 'lucide-react';
import { BRAND, COMMUNITY, ZONES } from '../data/site';
import { Newsletter } from './Newsletter';
import { TikTokIcon, SnapchatIcon, WhatsAppIcon } from './ui/icons';
import { waLink, MESSAGES } from '../lib/whatsapp';
import { useUi } from '../context/UiContext';

const ICONS: Record<string, JSX.Element> = {
  tiktok: <TikTokIcon />, instagram: <Instagram className="h-5 w-5" />, facebook: <Facebook className="h-5 w-5" />, snapchat: <SnapchatIcon />,
};

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-sans text-[13px] font-medium uppercase tracking-label text-or">{title}</h2>
      <ul className="space-y-1 text-[15px] text-creme/85">{children}</ul>
    </div>
  );
}
const L = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li><Link to={to} className="inline-flex min-h-[36px] items-center hover:text-or">{children}</Link></li>
);

export function Footer() {
  const { openSizeGuide } = useUi();
  return (
    <footer className="border-t border-gold/15 bg-ink-2">
      <div className="container-x grid gap-10 border-b border-gold/10 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-3">L’École du bon maintien</p>
          <h2 className="font-serif text-3xl sm:text-4xl">Recevez notre guide des tailles et nos nouveautés</h2>
          <p className="mt-4 max-w-prose text-ivory-2">Deux messages par mois, pas davantage. Vous pouvez vous désinscrire en un clic, et nous ne partageons jamais vos coordonnées.</p>
        </div>
        <Newsletter id="nl-footer" />
      </div>

      <div className="bg-bordeaux text-creme">
      <div className="container-x grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <Col title="La boutique">
          <L to="/boutique">La boutique en ligne</L>
          <L to="/boutique?tri=nouveautes">Nouveautés</L>
          <L to="/toutes-les-tailles">Du bonnet A au bonnet O</L>
          <L to="/maisons">Nos maisons</L>
          <L to="/heritage">Héritage et bétio</L>
          <L to="/mariee">Mariée et trousseau</L>
          <L to="/carte-cadeau">Carte cadeau</L>
        </Col>
        <Col title="Informations pratiques">
          <li><button onClick={() => openSizeGuide('pied-de-page')} className="inline-flex min-h-[36px] items-center hover:text-or">Guide des tailles</button></li>
          <L to="/conseils">Conseils</L>
          <L to="/rendez-vous">Prendre rendez-vous</L>
          <L to="/faq">Questions fréquentes</L>
          <L to="/nos-boutiques">Nos boutiques, Dakar</L>
          <L to="/presse">Espace presse</L>
        </Col>
        <Col title="Livraison et pays desservis">
          <L to="/livraison-retours">Livraison, échanges et retours</L>
          <L to="/commander-depuis-l-etranger">Commander depuis l’étranger</L>
          <L to="/livraison-afrique-de-l-ouest">Afrique de l’Ouest</L>
          <li className="pt-2 text-sm leading-relaxed text-creme/70">{ZONES.map((z) => z.label).join(' · ')}</li>
          <li className="pt-1 text-sm text-creme/70">Colis neutre, sans mention du contenu.</li>
        </Col>
        <Col title="Contact">
          <li><a href={waLink(MESSAGES.general)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[36px] items-center gap-2 hover:text-or"><WhatsAppIcon className="h-4 w-4" />{BRAND.whatsappDisplay}</a></li>
          <li className="text-sm text-creme/70">Joignable depuis l’étranger, comme un numéro ordinaire.</li>
          <li><a href={BRAND.phoneHref} className="inline-flex min-h-[36px] items-center gap-2 hover:text-or"><Phone className="h-4 w-4" />Appeler</a></li>
          <li><a href={`mailto:${BRAND.email}`} className="inline-flex min-h-[36px] items-center gap-2 hover:text-or"><Mail className="h-4 w-4" />{BRAND.email}</a></li>
          <L to="/contact">Formulaire de contact</L>
        </Col>
        <Col title="Informations légales">
          <L to="/cgv">Conditions générales de vente</L>
          <L to="/confidentialite">Confidentialité</L>
          <L to="/cookies">Cookies</L>
        </Col>
      </div>

      <div className="container-x flex flex-col items-center gap-6 border-t border-creme/15 pt-10 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <img src="/brand/logo-mark.png" alt="Chambre 69" width={199} height={186} loading="lazy" className="mx-auto h-24 w-auto lg:mx-0" />
          <p className="mt-3 font-serif text-xl text-creme">{BRAND.baseline}</p>
        </div>
        <div>
          <p className="mb-3 text-sm text-creme/70">{COMMUNITY.handle} sur</p>
          <ul className="flex justify-center gap-2">
            {COMMUNITY.networks.map((n) => (
              <li key={n.id}>
                <a href={n.url} target="_blank" rel="noopener noreferrer" aria-label={`${n.label} ${COMMUNITY.handle}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-creme/30 text-creme hover:border-or hover:text-or">{ICONS[n.id]}</a>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-creme/70">© {new Date().getFullYear()} Chambre 69 — Dakar, Sénégal</p>
      </div>
      <div className="pb-28 lg:pb-10" />
      </div>
    </footer>
  );
}
