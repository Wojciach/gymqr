<?php
//quiet errors meesages
//error_reporting(E_ALL & ~E_WARNING);

// this endpoint is used to handle all the requests from the front-end
// it gets the request in the form of a json object and then uses the key to call the appropriate method from the RequestDatabase class

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
    // this endpoint is used to handle all the requests from the front-end
    // it gets the request in the form of a json object and then uses the key to call the appropriate method from the RequestDatabase class
    // it looks like this: {"key": "values"} the valies can be an object or an array
    $body = file_get_contents('php://input');
    $json = json_decode($body);
    $key;
    if(!empty($body)) {
        //the $key is going to be a name of method that we want to call
        $key = array_keys(get_object_vars($json))[0];
    } else {
        echo 'no key';
        exit();
    }

    require_once("./passes/db_passProd.php");
    $mysqli = new mysqli($host, $user, $pass, $db_name);

    // the two methods that allow to use the database without token
    // check credentials is used to check if the user is allowed to log in
    // createNewAdmin is used to create a new admin
    if (($key === 'checkCredentials') || ($key === "createNewAdmin"))
    {
        // in case login or creating a new admin we need to check the captcha
        // the captacha token should be in the first position in the json object
        if ($json->$key[0]) {
            $recaptcha = file_get_contents(
                'https://www.google.com/recaptcha/api/siteverify?secret=6LfSK1wpAAAAAKCo7P5uJGlOp72Qu0JPqGjqya-r&response=' .
                $json->$key[0]
            );
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