/**
 * Connexion « Se connecter avec GitHub » de l'administration (/admin).
 * Étape 2 : GitHub revient ici avec un code, échangé contre un jeton, transmis à la fenêtre /admin.
 */
const page = (status, content) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Connexion…</title></head>
<body style="font-family:system-ui,sans-serif;background:#F4F2EE;color:#5A1725;display:grid;place-items:center;height:100vh;margin:0">
<p>${status === 'success' ? 'Connexion réussie, vous pouvez fermer cette fenêtre.' : 'La connexion a échoué. Fermez cette fenêtre et réessayez.'}</p>
<script>
(function () {
  var msg = 'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(content))};
  function receive(e) { window.opener.postMessage(msg, e.origin); window.removeEventListener('message', receive); setTimeout(function () { window.close(); }, 300); }
  if (window.opener) { window.addEventListener('message', receive); window.opener.postMessage('authorizing:github', '*'); }
})();
</script></body></html>`;

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const cookie = (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith('c69_oauth_state='));
  const expected = cookie ? cookie.split('=')[1] : '';
  const { code, state, error } = req.query;
  if (error || !code || !state || state !== expected) {
    return res.status(400).end(page('error', { message: error ? String(error) : 'Requête de connexion invalide ou expirée.' }));
  }
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: process.env.GITHUB_OAUTH_ID, client_secret: process.env.GITHUB_OAUTH_SECRET, code }),
    });
    const data = await r.json();
    if (!data.access_token) throw new Error(data.error_description || data.error || 'jeton absent');
    res.setHeader('Set-Cookie', 'c69_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    return res.status(200).end(page('success', { token: data.access_token, provider: 'github' }));
  } catch (e) {
    return res.status(500).end(page('error', { message: `Échec de la connexion GitHub : ${e.message}` }));
  }
}
