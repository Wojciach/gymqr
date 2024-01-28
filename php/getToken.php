<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;

$secretKey = 'your-secret-key';

if ($_POST['username'] === 'user' && $_POST['password'] === 'pass') {
    $payload = [
        'username' => $_POST['username'],
        'exp' => time() + (60*60) // 1 hour expiration time
    ];

    $jwt = JWT::encode($payload, $secretKey);
    echo json_encode(['token' => $jwt]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid username or password']);
}
