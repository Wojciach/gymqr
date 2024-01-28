<?php

//require_once('vendor/autoload.php');
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$admin;

$headers = getallheaders();
echo json_encode($headers); exit();

if (isset($headers['Authorization'])) {
    $auth_header = $headers['Authorization'];
    $jwt = str_replace('Bearer ', '', $auth_header); // Remove 'Bearer ' from the start of the string
    $jwt = trim($jwt); // Remove extra space from the start and end of the string
    
    // Decode the token
    try {
        $secretKey = 'your-secret-key'; // Replace with your secret key
        $decoded = JWT::decode($jwt, new Key('your-secret-key', 'HS256'));
        echo json_encode($decoded);
        // $admin = $decoded->sub;

        // Token is valid, proceed with the request
    } catch (Exception $e) {
        // Token is invalid, return an error response
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
} else {
    // Authorization header is not set, return an error response
    http_response_code(401);
    echo json_encode(['error' => 'No token provided']);
    exit();
}