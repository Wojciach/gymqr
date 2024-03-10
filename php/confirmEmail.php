<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';

use Wojciach\Wojciach\AdminManager;

$email = $_GET['email'];
$adminName = $_GET['adminName'];
$randomNumber = intval($_GET['rand']);

if (
    !is_string($email) ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !is_string($adminName) ||
    !is_int($randomNumber) 
) {
    $message = "Invalid data";
    $message = urlencode($message);
    header("Location: ./adminCreationConfirmation.html?result=$message");
    exit();
}

require './passes/db_passProd.php';
$mysqli = new mysqli($host, $user, $pass, $db_name);

$sql = "SELECT * FROM `admins_temporary` WHERE `login` = ? AND `email` = ? AND `randomNumber` = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param('ssi', $adminName, $email, $randomNumber);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$numRecords = $result->num_rows;
$result->free_result();
if ($numRecords < 1 || !$row || !$row['hashed_password']) {
    $message = "No such record <br>
    The link is not active anymore or the admin with this name has been already created. <br>
    Please contact the administrator.";
    $message = urlencode($message);
    header("Location: ./adminCreationConfirmation.html?result=$message");
    exit();
}

$hashedPassword = $row['hashed_password'];

$adminManager = new AdminManager($mysqli);
$exist = $adminManager->checkIfExist('admins', 'login', $adminName);

if ($exist === true) {
    $message = "Admin already exists";
    $message = urlencode($message);
    header("Location: ./adminCreationConfirmation.html?result=$message");
    exit();
    
} else {

    try {
    // adding new admin to the database after confirming the email
    $adminManager->addRecord('sss', array(
        'admins' => array(
            'login' => $adminName,
            'hashed_password' => $hashedPassword,
            'email' => $email
        )
    ));

    // create folder with emai layouts for this user, new email address or linkt one to universal email so one can send emails to his users
    //$adminManager->createLayoutsForEmails($adminName);

    // creating tables for this admin for its members and scans
    $adminName_users = $adminName . "_users";
    $adminManager->creataTable($adminName_users, "users");

    $adminName_scans = $adminName . "_scans";
    $adminManager->creataTable($adminName_scans,  "scans");

    // delete record from temporary admins after confirmation
    $adminManager->deleteRecord("admins_temporary", "login", $adminName);

    $message = "OK! <br>
    Admin has been created successfully.";
    $message = urlencode($message);
    header("Location: ./adminCreationConfirmation.html?result=$message");
    exit();
    }
    catch (Exception $e) {
        $message = "Error: " . $e->getMessage();
        $message = urlencode($message);
        header("Location: ./adminCreationConfirmation.html?result=$message");
        exit();
    }
}
