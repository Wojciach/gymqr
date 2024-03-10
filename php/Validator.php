<?php 
namespace Wojciach\Wojciach;

class Validator {
    public static function validateInputs($adminData)
    {
        $token = $adminData[0];
        $name = $adminData[1];
        $password = $adminData[2];
        $passwordConfirm = $adminData[3];
        $email = $adminData[4];

        if (strlen($name) > 20 || strlen($name) < 5) {
            return "Username must be between 5 and 20 characters long";
            // return $name;
        }
        if (!preg_match('/^[a-zA-Z0-9._-]+$/', $name)) {
            return "Username can only contain letters, numbers, and the following characters: . _ -";
        }

        if ($password !== $passwordConfirm) {
            return "'Password' and 'confirm password' do not match";
        }

        if (strlen($password) < 6 || strlen($password) > 32) {
            return "Password must be between 6 and 32 characters long";
        }

        if (!preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/\d/', $password) || !preg_match('/\W/', $password)) {
            return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return "Invalid email address";
        }

        // create temporary record in the database to confirm email

        return "successful server side validation";
    }
}