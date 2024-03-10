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

                $individuaEmaillPass = "./passes/$passDir/emailPass.php";
                $universalEmailPass = "./passes/tester/emailPass.php";
                if (file_exists($individuaEmaillPass)) {
                    require $individuaEmaillPass;
                } else {
                    require $universalEmailPass;
                }

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

    public static function checkCredentials($login, $row)
    {
        $payload = [
        'iat' => time(), // Issued at time
        'iss' => 'make-me.website', // Issuer
        'sub' => $login, // Subject (usually user ID)
        'exp' => time() + (60*60*24), // Expiration time (24 hour from now)
        'layout' => $row['layout']
        ];

        // if user doesn to have its own individual email set, the universal one is used
        $individuaEmaillPass = "./passes/$login/emailPass.php";
        $universalEmailPass = "./passes/tester/emailPass.php";
        if (file_exists($individuaEmaillPass)) {
            require $individuaEmaillPass;
        } else {
            require $universalEmailPass;
        }

        $jwt = JWT::encode($payload, 'magicSecretOf' . $tokenPass . $login, 'HS256');
       // echo "łolaboga!";
        echo json_encode([
            'token' => $jwt,
            'layout' => $row['layout'],
            'admin' => $login
        ]);

    }
}