/**
 * Connexion « Se connecter avec GitHub » de l'administration (/admin).
 * Étape 1 : redirige vers GitHub pour autoriser l'application OAuth de Chambre 69.
 * Variables Vercel requises : GITHUB_OAUTH_ID et GITHUB_OAUTH_SECRET (voir ADMINISTRATION.md).
 */
import crypto from 'node:crypto';

export default function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_ID;
  if (!clientId) {
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Connexion GitHub non configurée : ajoutez GITHUB_OAUTH_ID et GITHUB_OAUTH_SECRET dans Vercel (voir ADMINISTRATION.md).');
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const state = crypto.randomBytes(16).toString('hex');
  const scope = typeof req.query.scope === 'string' && req.query.scope ? req.query.scope.replace(/,/g, ' ') : 'repo';
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `https://${host}/api/callback`);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);
  res.setHeader('Set-Cookie', `c69_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.setHeader('Cache-Control', 'no-store');
  res.writeHead(302, { Location: url.toString() });
  res.end();
}
