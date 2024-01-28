<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: text/plain');

//quiet errors meesages
//include_once('err.php');

require 'vendor/autoload.php';
//require "tokenVerification.php";

use Wojciach\Wojciach\PHPMailerEmail;
use Wojciach\Wojciach\RequestDatabase;
use Wojciach\Wojciach\EmailBody;
use Wojciach\Wojciach\TokenManager;

try {

    $body = file_get_contents('php://input');
    $json = json_decode($body);
    $key;
    if(!empty($body)) {
        $key = array_keys(get_object_vars($json))[0];
    } else {
        echo 'no key';
        exit();
    }

    require_once("./passes/db_passDev.php");
    $mysqli = new mysqli($host, $user, $pass, $db_name);

    if($key === 'checkCredentials')
    {
        if ($json->checkCredentials[2]) {
            $recaptcha = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=6LfSK1wpAAAAAKCo7P5uJGlOp72Qu0JPqGjqya-r&response=' . $json->checkCredentials[2]);
            $recaptcha = json_decode($recaptcha);
            if ($recaptcha->success == true) {
                $RequestDatabase = new RequestDatabase($mysqli, "");
            } else {
                echo 'captcha error';
                exit();
            }
        } else {
            echo 'no captcha response';
            exit();
        }
        
    } else {
        $tokenManager = new TokenManager();
        $RequestDatabase = new RequestDatabase($mysqli, $tokenManager->admin);
    }
    
    $RequestDatabase->$key($json->$key);
    
} catch (Exception $e) {
  //  echo "O_la_bo_ga!"; 
    echo $e->getMessage();
    exit();
}