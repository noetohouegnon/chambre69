import type { ProductImage } from '../../data/catalog';

type Props = {
  image: ProductImage;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
};

/** Image produit responsive : WebP 480/960 px, dimensions déclarées, chargement différé (6.2). */
export function Img({ image, alt, className = '', sizes = '(min-width: 1024px) 25vw, 50vw', priority, fit = 'cover' }: Props) {
  const w = 960;
  const h = Math.round(w / (image.ratio || 0.75));
  return (
    <img
      src={image.srcSmall}
      srcSet={`${image.srcSmall} 480w, ${image.src} 960w`}
      sizes={sizes}
      width={w}
      height={h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // @ts-expect-error attribut HTML valide, pas encore typé par React 18
      fetchpriority={priority ? 'high' : undefined}
      className={`${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`}
    />
  );
}
