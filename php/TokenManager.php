<?php

namespace Wojciach\Wojciach;

use \Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenManager
{
    public $admin;
    public $layout;
    public $iat;
    public $exp;
    public $iss;
    public $err = null;

    public function __construct()
    {   
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
            $jwt = str_replace('Bearer ', '', $auth_header); // Remove 'Bearer ' from the start of the string
            $jwt = trim($jwt); // Remove extra space from the start and end of the string
            if($jwt === 'null') {
                echo "noToken";
                exit();
            }
            // Decode the token
            try {
                $jwtParts = explode('.', $jwt);
                $payload = base64_decode($jwtParts[1]);
                $payloadArray = json_decode($payload, true);

                $passDir = $payloadArray['sub'];

                require("./passes/$passDir/emailPass.php");
                $secretKey = 'magicSecretOf' . $tokenPass .  $payloadArray['sub']; // Replace with your secret key
                $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
                
                $this->admin = $decoded->sub;
                $this->layout = $decoded->layout;
                $this->iat = $decoded->iat;
                $this->exp = $decoded->exp;
                $this->iss = $decoded->iss;

                // Token is valid, proceed with the request
            } catch (\Exception $e) {
                // Token is invalid, return an error response
             //   echo "tokenError";
               echo $e->getMessage();
                exit();//$e->getMessage();
                // http_response_code(401);
                // echo json_encode(['error' => '$e->getMessage()']);
                // exit();
            }
        } else {
            // Authorization header is not set, return an error response
            http_response_code(401);
            echo json_encode(['error' => 'No token provided']);
            exit();
        }
    }

    public function checkCredentials($cerdentials)
    {
        $login = $cerdentials[0];
        $loginPassword = $cerdentials[1];
        $sql = "SELECT * FROM `admins` WHERE `login` = '$cerdentials[0]'";
        $result = $this->mysqli->query($sql);
        $row = $result->fetch_assoc();

        if ($result->num_rows === 1) {
            if (password_verify($loginPassword, $row['hashed_password'])) {
               // echo 'Password is valid!';
                $payload = [
                    'iat' => time(), // Issued at time
                    'iss' => 'yourdomain.com', // Issuer
                    'sub' => $login, // Subject (usually user ID)
                    'exp' => time() + (60*60), // Expiration time (1 hour from now)
                    'layout' => $row['layout']
                ];
                
                $jwt = JWT::encode($payload, 'your-secret-key', 'HS256'); 
                echo json_encode(['token' => $jwt]);
            } else {
                echo 'Invalid password.';
            }
        } else {
            echo "no such user";
        }

    }
}