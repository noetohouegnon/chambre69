/**
 * Calcul de taille européen (tour de dos arrondi à 5 cm, bonnet selon l'écart
 * poitrine − dos, environ 2 cm par lettre à partir de 12-13 cm pour le A).
 * Point de départ seulement : le tableau de correspondance de Chambre 69 primera.
 */
export const CUPS = 'ABCDEFGHIJKLMNO'.split('');

export type SizeResult =
  | { ok: true; band: number; cup: string; label: string; message: string; bigGap: boolean }
  | { ok: false; message: string };

const MSG = {
  ab: 'Une remarque : les modèles rembourrés vous seront systématiquement proposés ailleurs. Chez nous, ils sont une option parmi d’autres, jamais la seule.',
  cd: 'Vous trouverez votre taille sans difficulté dans l’ensemble de nos lignes.',
  eh: 'Cette taille existe réellement en stock chez nous, en dentelle comme en coton. Vous n’aurez rien à commander sur mesure.',
  io: 'Nous montons jusqu’au bonnet O. Pour cette amplitude, nous vous conseillons une prise de mesures en boutique ou un échange sur WhatsApp : l’ajustement se joue à peu de chose.',
  gap: 'Votre morphologie demande un ajustement précis. Nous vous conseillons vivement une prise de mesures en boutique : c’est gratuit et cela prend vingt minutes.',
  bad: 'Ce résultat semble inhabituel. Reprenez la mesure, ou écrivez-nous : une conseillère vous guidera pas à pas.',
};

export function computeSize(underbust: number, bust: number): SizeResult {
  if (!underbust || !bust || underbust < 55 || underbust > 150 || bust < 60 || bust > 200) return { ok: false, message: MSG.bad };
  const diff = bust - underbust;
  if (diff < 9 || diff > 50) return { ok: false, message: MSG.bad };
  const band = Math.min(130, Math.max(60, Math.round(underbust / 5) * 5));
  const idx = Math.min(CUPS.length - 1, Math.max(0, Math.floor((diff - 11) / 2)));
  const cup = CUPS[idx];
  const bigGap = diff >= 34 || (band <= 70 && idx >= CUPS.indexOf('H'));
  let message = idx <= 1 ? MSG.ab : idx <= 3 ? MSG.cd : idx <= 7 ? MSG.eh : MSG.io;
  if (bigGap) message = `${message} ${MSG.gap}`;
  return { ok: true, band, cup, label: `${band}${cup}`, message, bigGap };
}
