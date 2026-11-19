import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { useUi } from '../context/UiContext';
import { useCart } from '../context/CartContext';
import { SizeGuideTool } from './SizeGuideTool';
import { WhatsAppIcon } from './ui/icons';
import { waLink } from '../lib/whatsapp';
import { track, getConsent, setConsent } from '../lib/analytics';

/** Bouton WhatsApp flottant, présent sur toutes les pages (4.3). */
export function FloatingWhatsApp() {
  const { waMessage } = useUi();
  const { pathname } = useLocation();
  if (pathname.replace(/\/+$/, '') === '/panier') return null; // le panier a son propre bouton, en clair
  return (
    <a
      href={waLink(waMessage)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click', { source: 'flottant' })}
      className="fixed bottom-4 right-4 z-30 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-wa pl-4 pr-5 text-[15px] font-medium text-[#06260F] shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:bg-[#3be07a] sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span>Parler à une conseillère</span>
    </a>
  );
}

/** Guide des tailles en surcouche, sans quitter la page (4.4). */
export function SizeGuideModal() {
  const { sizeGuideOpen, closeSizeGuide } = useUi();
  useEffect(() => {
    if (!sizeGuideOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSizeGuide();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [sizeGuideOpen, closeSizeGuide]);
  if (!sizeGuideOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Guide des tailles">
      <div className="absolute inset-0 bg-black/75" onClick={closeSizeGuide} />
      <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-gold/20 bg-ink-2 px-5 pb-10 pt-14 sm:max-w-2xl sm:rounded-3xl sm:px-10">
        <button onClick={closeSizeGuide} className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-ivory hover:bg-ink-3" aria-label="Fermer le guide des tailles"><X className="h-6 w-6" /></button>
        <p className="eyebrow mb-6">Guide des tailles</p>
        <SizeGuideTool compact onNavigate={closeSizeGuide} />
      </div>
    </div>
  );
}

/** Confirmation discrète d'ajout au panier. */
export function AddedToast() {
  const { lastAdded, dismissAdded } = useCart();
  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(dismissAdded, 5000);
    return () => clearTimeout(t);
  }, [lastAdded, dismissAdded]);
  if (!lastAdded) return null;
  return (
    <div role="status" className="fixed inset-x-4 top-24 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-gold/30 bg-ink-3 p-3 shadow-2xl">
      <img src={lastAdded.product.images[0].srcSmall} alt="" width={48} height={64} className="h-16 w-12 rounded object-cover" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="flex items-center gap-1.5 text-gold"><Check className="h-4 w-4" />Ajouté au panier</p>
        <p className="truncate text-ivory">{lastAdded.product.name}</p>
        {lastAdded.size && <p className="text-mute">Taille {lastAdded.size}</p>}
      </div>
      <Link to="/panier" onClick={dismissAdded} className="btn-gold min-h-[40px] px-4 text-sm">Panier</Link>
      <button onClick={dismissAdded} aria-label="Fermer" className="inline-flex h-10 w-8 items-center justify-center text-mute"><X className="h-4 w-4" /></button>
    </div>
  );
}

/** Bandeau de consentement sobre et non bloquant ; refuser est aussi simple qu'accepter (8.3). */
export function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(getConsent() === null);
    const h = () => setShow(true);
    window.addEventListener('c69-consent-open', h);
    return () => window.removeEventListener('c69-consent-open', h);
  }, []);
  if (!show) return null;
  const choose = (v: 'granted' | 'denied') => { setConsent(v); setShow(false); };
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-ink-3/95 px-4 py-4 backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-2xl sm:border">
      <p className="text-sm leading-relaxed text-ivory-2">
        Nous utilisons des mesures d’audience pour améliorer le site, uniquement avec votre accord. <Link to="/cookies" className="text-gold underline-offset-2 hover:underline">En savoir plus</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => choose('denied')} className="btn-line min-h-[44px] flex-1 px-4 text-sm">Refuser</button>
        <button onClick={() => choose('granted')} className="btn-line min-h-[44px] flex-1 px-4 text-sm">Accepter</button>
      </div>
    </div>
  );
}
