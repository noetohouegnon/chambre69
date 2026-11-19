<?php
/**
 * Connexion « Se connecter avec GitHub » de l'administration (/admin), version OVH.
 * Étape 1 : redirige vers GitHub. Les identifiants de l'application OAuth sont écrits dans
 * api/oauth-config.php par le robot de mise en ligne (secrets GitHub), jamais dans le dépôt.
 */
$config = @include __DIR__ . '/oauth-config.php';
if (!is_array($config) || empty($config['client_id'])) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    exit("Connexion GitHub non configurée : ajoutez les secrets GITHUB_OAUTH_ID et GITHUB_OAUTH_SECRET dans GitHub (voir DEPLOYMENT.md).");
}
$state = bin2hex(random_bytes(16));
$scope = isset($_GET['scope']) && is_string($_GET['scope']) && $_GET['scope'] !== '' ? str_replace(',', ' ', $_GET['scope']) : 'repo';
$host = $_SERVER['HTTP_HOST'];
setcookie('c69_oauth_state', $state, [
    'expires' => time() + 600, 'path' => '/api', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax',
]);
header('Cache-Control: no-store');
header('Location: https://github.com/login/oauth/authorize?' . http_build_query([
    'client_id' => $config['client_id'],
    'redirect_uri' => "https://$host/api/callback",
    'scope' => $scope,
    'state' => $state,
]), true, 302);
