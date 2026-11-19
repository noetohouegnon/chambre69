<?php
/**
 * Connexion « Se connecter avec GitHub » de l'administration (/admin), version OVH.
 * Étape 2 : échange le code GitHub contre un jeton et le transmet à la fenêtre /admin.
 */
function page(string $status, array $content): void {
    $msg = json_encode('authorization:github:' . $status . ':' . json_encode($content, JSON_UNESCAPED_SLASHES), JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
    $text = $status === 'success' ? 'Connexion réussie, vous pouvez fermer cette fenêtre.' : 'La connexion a échoué. Fermez cette fenêtre et réessayez.';
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    echo <<<HTML
<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Connexion…</title></head>
<body style="font-family:system-ui,sans-serif;background:#F4F2EE;color:#5A1725;display:grid;place-items:center;height:100vh;margin:0">
<p>$text</p>
<script>
(function () {
  var msg = $msg;
  function receive(e) { window.opener.postMessage(msg, e.origin); window.removeEventListener('message', receive); setTimeout(function () { window.close(); }, 300); }
  if (window.opener) { window.addEventListener('message', receive); window.opener.postMessage('authorizing:github', '*'); }
})();
</script></body></html>
HTML;
    exit;
}

$config = @include __DIR__ . '/oauth-config.php';
$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? '';
$expected = $_COOKIE['c69_oauth_state'] ?? '';
if (!is_array($config) || isset($_GET['error']) || !$code || !$state || !hash_equals($expected, $state)) {
    http_response_code(400);
    page('error', ['message' => isset($_GET['error']) ? (string) $_GET['error'] : 'Requête de connexion invalide ou expirée.']);
}

$payload = json_encode(['client_id' => $config['client_id'], 'client_secret' => $config['client_secret'], 'code' => $code]);
$headers = ['Accept: application/json', 'Content-Type: application/json', 'User-Agent: chambre69-admin'];
if (function_exists('curl_init')) {
    $ch = curl_init('https://github.com/login/oauth/access_token');
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $payload, CURLOPT_HTTPHEADER => $headers, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15]);
    $body = curl_exec($ch);
    curl_close($ch);
} else {
    $body = @file_get_contents('https://github.com/login/oauth/access_token', false, stream_context_create(['http' => [
        'method' => 'POST', 'header' => implode("\r\n", $headers), 'content' => $payload, 'timeout' => 15,
    ]]));
}
$data = json_decode((string) $body, true);
if (empty($data['access_token'])) {
    http_response_code(500);
    page('error', ['message' => 'Échec de la connexion GitHub : ' . ($data['error_description'] ?? $data['error'] ?? 'pas de réponse')]);
}
setcookie('c69_oauth_state', '', ['expires' => time() - 3600, 'path' => '/api', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
page('success', ['token' => $data['access_token'], 'provider' => 'github']);
