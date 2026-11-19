import { useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ListProvider } from './context/ListContext';
import { UiProvider } from './context/UiContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp, SizeGuideModal, AddedToast, ConsentBanner } from './components/Overlays';
import { metaFor } from './lib/meta';
import { track } from './lib/analytics';
import { SITE_URL } from './data/site';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { InclusivityPage } from './pages/InclusivityPage';
import { HeritagePage } from './pages/HeritagePage';
import { BridePage } from './pages/BridePage';
import { TrousseauListPage } from './pages/TrousseauListPage';
import { MastectomyPage } from './pages/MastectomyPage';
import { AdvicePage, ArticlePage, GlossaryPage } from './pages/AdvicePages';
import { StoresPage, StorePage } from './pages/StoresPages';
import { StoryPage } from './pages/StoryPage';
import { BrandsPage } from './pages/BrandsPage';
import { AbroadPage, WestAfricaPage } from './pages/AbroadPages';
import { AppointmentPage } from './pages/AppointmentPage';
import { ContactPage } from './pages/ContactPage';
import { GiftCardPage, FaqPage, DeliveryPage, NewsletterPage, PressPage, LegalNoticePage, TermsPage, PrivacyPage, CookiesPage } from './pages/InfoPages';
import { NotFoundPage } from './pages/NotFoundPage';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Titre, description et balises de partage à chaque changement de page (côté navigateur). */
function HeadManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = metaFor(pathname);
    document.title = m.title;
    const set = (sel: string, attr: string, val: string) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', m.description);
    set('meta[property="og:title"]', 'content', m.title);
    set('meta[property="og:description"]', 'content', m.description);
    set('meta[property="og:image"]', 'content', m.image);
    set('meta[property="og:url"]', 'content', SITE_URL + pathname);
    set('meta[name="twitter:title"]', 'content', m.title);
    set('meta[name="twitter:description"]', 'content', m.description);
    set('meta[name="twitter:image"]', 'content', m.image);
    set('link[rel="canonical"]', 'href', SITE_URL + (pathname === '/' ? '/' : pathname.replace(/\/$/, '')));
    track('page_view', { title: m.title });
    if (pathname.startsWith('/apres-mastectomie')) track('view_mastectomy_page');
  }, [pathname]);
  return null;
}

/** Retour à la position précédente au « retour arrière » (4.5), haut de page sinon. */
function ScrollManager() {
  const loc = useLocation();
  const nav = useNavigationType();
  const positions = useRef<Record<string, number>>({});
  useEffect(() => {
    const save = () => { positions.current[loc.key] = window.scrollY; };
    window.addEventListener('scroll', save, { passive: true });
    return () => { save(); window.removeEventListener('scroll', save); };
  }, [loc.key]);
  useIsoLayoutEffect(() => {
    if (nav === 'POP' && positions.current[loc.key] != null) {
      const y = positions.current[loc.key];
      requestAnimationFrame(() => window.scrollTo(0, y));
    } else if (!loc.hash) {
      window.scrollTo(0, 0);
    }
  }, [loc.key]);
  return null;
}

export default function App() {
  return (
    <UiProvider>
      <CartProvider>
        <ListProvider>
          <HeadManager />
          <ScrollManager />
          <div className="flex min-h-screen flex-col bg-ink">
            <Header />
            <main id="contenu" className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/boutique" element={<ShopPage />} />
                <Route path="/boutique/:slug" element={<ProductPage />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/guide-des-tailles" element={<SizeGuidePage />} />
                <Route path="/toutes-les-tailles" element={<InclusivityPage />} />
                <Route path="/heritage" element={<HeritagePage />} />
                <Route path="/mariee" element={<BridePage />} />
                <Route path="/mariee/liste" element={<TrousseauListPage />} />
                <Route path="/apres-mastectomie" element={<MastectomyPage />} />
                <Route path="/conseils" element={<AdvicePage />} />
                <Route path="/conseils/glossaire" element={<GlossaryPage />} />
                <Route path="/conseils/:slug" element={<ArticlePage />} />
                <Route path="/nos-boutiques" element={<StoresPage />} />
                <Route path="/nos-boutiques/:id" element={<StorePage />} />
                <Route path="/notre-histoire" element={<StoryPage />} />
                <Route path="/maisons" element={<BrandsPage />} />
                <Route path="/commander-depuis-l-etranger" element={<AbroadPage />} />
                <Route path="/livraison-afrique-de-l-ouest" element={<WestAfricaPage />} />
                <Route path="/rendez-vous" element={<AppointmentPage />} />
                <Route path="/carte-cadeau" element={<GiftCardPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/livraison-retours" element={<DeliveryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/inscription" element={<NewsletterPage />} />
                <Route path="/presse" element={<PressPage />} />
                <Route path="/mentions-legales" element={<LegalNoticePage />} />
                <Route path="/cgv" element={<TermsPage />} />
                <Route path="/confidentialite" element={<PrivacyPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <FloatingWhatsApp />
          <SizeGuideModal />
          <AddedToast />
          <ConsentBanner />
        </ListProvider>
      </CartProvider>
    </UiProvider>
  );
}
