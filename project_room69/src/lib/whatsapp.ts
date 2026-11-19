import { BRAND } from '../data/site';
import { track } from './analytics';

export const waLink = (text?: string) =>
  `https://wa.me/${BRAND.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/** Partage d'un lien par WhatsApp, vers le contact choisi par la visiteuse. */
export const waShare = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

export const MESSAGES = {
  general: 'Bonjour Chambre 69, je souhaite parler à une conseillère.',
  product: (name: string, ref: string, size?: string) =>
    `Bonjour Chambre 69, je suis intéressée par le modèle ${name} — référence ${ref}${size ? ` — taille ${size}` : ''}. Pouvez-vous me conseiller ?`,
  sizeCheck: (size?: string) =>
    size ? `Bonjour Chambre 69, le guide des tailles m'indique ${size}. Pouvez-vous vérifier avec moi avant que je commande ?` : 'Bonjour Chambre 69, je ne connais pas ma taille. Pouvez-vous m\'aider à prendre mes mesures ?',
  mastectomy: 'Bonjour Chambre 69, je souhaite des informations sur vos brassières post-opératoires et vos prothèses mammaires.',
  abroad: (country?: string) => `Bonjour Chambre 69, je vis ${country ? `en/au ${country}` : 'à l\'étranger'} et je souhaite commander. Quels sont les délais et les frais vers mon pays ?`,
  bride: 'Bonjour Chambre 69, je prépare mon trousseau de mariée et je souhaite être accompagnée.',
  brideAbroad: 'Bonjour Chambre 69, je me marie au pays mais je vis à l\'étranger. Pouvez-vous préparer mon trousseau à distance ?',
  heritage: 'Bonjour Chambre 69, je souhaite en savoir plus sur votre collection traditionnelle.',
  giftCard: 'Bonjour Chambre 69, je souhaite offrir une carte cadeau.',
  emptyResult: (q: string) => `Bonjour Chambre 69, je cherche ${q} et je ne l'ai pas trouvé sur le site. L'avez-vous ?`,
  backInStock: (name: string, ref: string, size: string) =>
    `Bonjour Chambre 69, pouvez-vous me prévenir du retour en stock du modèle ${name} (référence ${ref}) en taille ${size} ?`,
};

export function openWhatsApp(text: string, source: string) {
  track('whatsapp_click', { source });
  if (typeof window !== 'undefined') window.open(waLink(text), '_blank', 'noopener');
}
