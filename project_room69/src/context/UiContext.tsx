import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { MESSAGES } from '../lib/whatsapp';
import { track } from '../lib/analytics';

type Ctx = {
  sizeGuideOpen: boolean;
  openSizeGuide: (source: string) => void;
  closeSizeGuide: () => void;
  /** Message du bouton WhatsApp flottant, rendu contextuel par la page affichée (4.3). */
  waMessage: string;
  setWaMessage: (m: string | null) => void;
};
const UiContext = createContext<Ctx | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [sizeGuideOpen, setOpen] = useState(false);
  const [waMessage, setMsg] = useState<string>(MESSAGES.general);
  const openSizeGuide = useCallback((source: string) => { setOpen(true); track('size_guide_open', { source }); }, []);
  const closeSizeGuide = useCallback(() => setOpen(false), []);
  const setWaMessage = useCallback((m: string | null) => setMsg(m || MESSAGES.general), []);
  const value = useMemo(() => ({ sizeGuideOpen, openSizeGuide, closeSizeGuide, waMessage, setWaMessage }), [sizeGuideOpen, openSizeGuide, closeSizeGuide, waMessage, setWaMessage]);
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export const useUi = () => {
  const c = useContext(UiContext);
  if (!c) throw new Error('useUi doit être utilisé dans UiProvider');
  return c;
};
