export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Base URL used to load product images (same server as the API, without "/api")
export const IMAGE_BASE_URL = API_URL.replace(/\/api\/?$/, '');

// Builds a usable <img src> from whatever the backend returns.
// Handles old absolute localhost URLs AND new relative "/images/..." paths.
export function getImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Backward compatibility with old seeded data that stored a full localhost URL
    const match = url.match(/\/images\/.*/);
    return match ? `${IMAGE_BASE_URL}${match[0]}` : url;
  }
  return `${IMAGE_BASE_URL}${url}`;
}
