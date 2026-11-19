import type { ReactNode } from 'react';
import { waLink } from '../../lib/whatsapp';
import { track } from '../../lib/analytics';
import { WhatsAppIcon } from './icons';

type Props = {
  message: string;
  source: string;
  children: ReactNode;
  variant?: 'wa' | 'line' | 'gold' | 'ghost';
  className?: string;
};

/** Lien WhatsApp au message pré-rempli contextuel (4.3). Fonctionne sans JavaScript. */
export function WaButton({ message, source, children, variant = 'wa', className = '' }: Props) {
  const cls = variant === 'wa' ? 'btn-wa' : variant === 'gold' ? 'btn-gold' : variant === 'line' ? 'btn-line' : 'btn-ghost';
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click', { source })}
      className={`${cls} ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      <span>{children}</span>
    </a>
  );
}
