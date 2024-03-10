<?php 
namespace Wojciach\Wojciach;

use Wojciach\Wojciach\PHPMailerEmail;
use \Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Wojciach\Wojciach\MyEmailSender;
use Wojciach\Wojciach\TokenManager;
use Wojciach\Wojciach\Validator;
use Wojciach\Wojciach\AdminManager;

class RequestDatabase 
{
    private $mysqli;
    private $emailAdressesList;
    private $validEmailsRows;
    private $invalidEmailsRows;
    private $usersData;
    private $admin;
    private $scans;
    private $users;

    public function __construct(object $mysqli, $admin)
    {   
        $this->mysqli = $mysqli;
        $this->admin = $admin;
        $this->scans = $admin . "_scans";
        $this->users = $admin . "_users";
    }

    public function getAll($tableName) : bool
    {
        $allowedTables = ['users', 'scans'];
        if (!in_array($tableName, $allowedTables)) {
            throw new \Exception('Invalid table name in getAll method');
        }

        $tableName =  $this->admin . "_" . $tableName;

        $sql = "SELECT * FROM $tableName";
        $stmt = $this->mysqli->prepare($sql);
        if(!$stmt->execute()) {
            throw new \Exception("Failed to execute statement in getAll method: " . $stmt->error);
        };
        $result = $stmt->get_result();
        if(!$result) {
            throw new \Exception("Failed to get result in getAll method: " . $stmt->error);
        }
        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        $result->free_result();
        echo json_encode($rows);
        return true;
    }

    public function addUser($body) : bool
    {   
        $randomNumber = mt_rand(100000, 999999);
        $sql = "INSERT INTO `$this->users`(`name`, `surname`, `pin`, `email`, `paidDate`, `paidAmount`) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('ssissd', $body->name, $body->surname, $randomNumber, $body->email, $body->paidDate, $body->paidAmount);
        if(!$stmt->execute()) {
            throw new \Exception("Failed to execute statement in addUser method: " . $stmt->error);
        }
        return true;
    }

    public function requestForUserDetails($DBid) : bool
    {
        $sql = "SELECT * FROM `$this->users` WHERE id = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('i', $DBid);
        $stmt->execute();
        $result = $stmt->get_result();
        if(!$result) {
            throw new \Exception("Failed to get result in requestForUserDetails method: " . $stmt->error);
        }
        $row = $result->fetch_assoc();
        if ($row === null) {
            throw new \Exception("No user found with id: " . $DBid);
        }
        echo json_encode($row);
        $result->free_result();
        return true;
    }

    public function editUser($body) : bool
    {
        $sql = "UPDATE `$this->users` SET `name`=?, `surname`=?, `email`=?, `paidDate`=?, `paidAmount`=? WHERE `id`=?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('ssssdi', $body->name, $body->surname, $body->email, $body->paidDate, $body->paidAmount, $body->DBid);
        $stmt->execute();
        if (!$stmt->execute()) {
            throw new \Exception("Failed to execute statement: " . $stmt->error);
        }
        if ($stmt->affected_rows !== 1) {
            throw new \Exception("ERROR: More or less than one row affected: " . $stmt->affected_rows);
        }
        return true;
    }

    //deleting an user and all his scans
    public function deleteUser($DBid) : bool
    {
        $sql = "DELETE FROM `$this->users` WHERE `id` = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('i', $DBid);
        if (!$stmt->execute()) {
            throw new \Exception("Failed to execute statement delete user: " . $stmt->error);
        }
        if ($stmt->affected_rows !== 1) {
            throw new \Exception("ERROR: More or less than one row affected: " . $stmt->affected_rows);
        }
        
        $sql = "DELETE FROM `$this->scans` WHERE `user_ID` = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('i', $DBid);
        if (!$stmt->execute()) {
            throw new \Exception("Failed to execute statement delete scans: " . $stmt->error);
        }
        return true;
    }

    private function getUsersData($IDs) : array
    {
        // Create a string of question marks, one for each ID
        $placeholders = str_repeat('?,', count($IDs) - 1) . '?';

        $sql = "SELECT * FROM `$this->users` WHERE `id` IN ($placeholders)";
        $stmt = $this->mysqli->prepare($sql);

        // Dynamically bind parameters
        $params = array(str_repeat('i', count($IDs)));
        foreach ($IDs as $key => $value) {
            $params[] = &$IDs[$key];
        }
        call_user_func_array(array($stmt, 'bind_param'), $params);
        $stmt->execute();
        $result = $stmt->get_result();
        if (!$result) {
            throw new \Exception("Failed to execute statement get userrs data: " . $stmt->error);
        }
        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = array($row['id'], $row['name'], $row['surname'], $row['pin'], $row['email'], $row['paidDate'], $row['paidAmount']);
        }
        $result->free_result();
        $this->usersData = $rows;
        return $rows;
    }

    // creating array of valid or invalid rows based on email validation
    private function validateEmailAddresses($usersData) : bool
    {
        $invalidEmailsRows = array();
        foreach ($usersData as $record) {
            if (!filter_var($record[4], FILTER_VALIDATE_EMAIL)) {
                $invalidEmailsRows[] = $record;
            }
        }
        
        // if there are no invalid emails we crate array of valid emails
        if (empty($invalidEmailsRows)) {
            $this->validEmailsRows = $usersData;
            return true;
        } else {
            // if there are invalid emails in rows with data we create array of rows with invalid emails
            $this->invalidEmailsRows = $invalidEmailsRows;
            return false;
        }
    }

    public function sendQrViaEmails(array $IDs) : bool
    {
        MyEmailSender::isArrayOfInts($IDs);

        // retrieving user data from database
        $this->getUsersData($IDs);

        // validating email addresses
        $emailValidation = $this->validateEmailAddresses($this->usersData);
        if($emailValidation === true)
        {
            foreach ($this->validEmailsRows as $row) {
                $body = MyEmailSender::getBodyForQrEmail($row, $this->admin);
                MyEmailSender::sendEmail($body, $row[4], $this->admin);
            }
            echo json_encode(array('validEmails' => $this->validEmailsRows));
        } else {
            echo json_encode(array('invalidEmails' => $this->invalidEmailsRows));
        }
        return true;
    }

    public function sendReminder($ID) : bool
    {
        if (!is_int($ID)) {
            throw new \InvalidArgumentException('$ID must be an integer');
        }

        $this->getUsersData([$ID]);
        $userToSendReminder = $this->usersData[0];
        $body = MyEmailSender::getBodyForReminderEmail($userToSendReminder, $this->admin);
        MyEmailSender::sendEmail($body, $userToSendReminder[4], $this->admin);
        echo json_encode(array("ok" => $userToSendReminder[4]));
        return true;
    }

    public function saveScannedQRs($scannedQRsArray) : bool
    {
        $arrayOfScans = $scannedQRsArray;
        $repeatedScans = array();
        foreach ($arrayOfScans as $scannedQR) {
            // checking if there scans like this one aleready in the database
            $sql = "SELECT * FROM `$this->scans` WHERE user_ID = ? AND scanTime = ?";
            $stmt = $this->mysqli->prepare($sql);
            $stmt->bind_param('is', $scannedQR[0], $scannedQR[2]);
            $stmt->execute();
            $result = $stmt->get_result();
            if(!$result) {
                throw new \Exception("Failed to get result in saveScannedQRs method: " . $stmt->error);
            }
            // if there are no scans with the same user_ID and scanTime we insert new scan
            if ($result->num_rows === 0) {
                $sql = "INSERT INTO `$this->scans`(`user_ID`, `pin`, `scanTime`) VALUES (?, ?, ?)";
                $stmt = $this->mysqli->prepare($sql);
                $stmt->bind_param('iss', $scannedQR[0], $scannedQR[1], $scannedQR[2]);
                if(!$stmt->execute()) {
                    throw new \Exception("Failed to save a new scan in saveScannedQRs method: " . $stmt->error);
                }
                $repeatedScans[] = $scannedQR;
            } elseif ($result->num_rows > 0) {
                $repeatedScans[] = $scannedQR;
            }
        }
        // repatedScans coming back to frontend to be marked as sent
        // no matter if the recod was already in the database or just have been added
        // this function is going to echp all scans that are in the database
        echo json_encode($repeatedScans);
        return true;
    }
    
    public function checkCredentials($cerdentials) : bool
    {
        $login = $cerdentials[1];
        $loginPassword = $cerdentials[2];

        $sql = "SELECT * FROM `admins` WHERE `login` = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('s', $login);
        $stmt->execute();
        $result = $stmt->get_result();
        if(!$result) {
            throw new \Exception("Failed to get result in checkCredentials method: " . $stmt->error);
        }
        $row = $result->fetch_assoc();

        if ($result->num_rows === 1) {
            if (password_verify($loginPassword, $row['hashed_password'])) {
               // echo 'Password is valid!';
               TokenManager::checkCredentials($login, $row);
            } else {
               echo json_encode(['err' => 'Invalid password']);
            }
        } else if ($result->num_rows < 1){
           echo json_encode(['err' => 'no such user']);
        } else {
              echo json_encode(['err' => 'DATABASE ERROR: more than one user with the same login']);
              throw new \Exception("DATABASE ERROR: more than one user with the same login");
        }
        return true;
    }

    //this function only initiates the process of adding new admin to the database
    //after the user confirms email the actual adding is done in confirmEmail.php
    public function createNewAdmin($adminData) : bool
    {   
        // data from the form
         $token = $adminData[0];
         $login = $adminData[1];
         $password = $adminData[2];
         $confirmPassword = $adminData[3];
         $email = $adminData[4];

         // get message from the server side form validation
         $message = Validator::validateInputs($adminData);

        // create temporary record in the tabase to confirm email if email is valid
        if ($message === "successful server side validation") {

            $adminManager = new AdminManager($this->mysqli);

            // checkIfExist() function takes three arguments: table name, column name, value;
            // checking if there is such admin in the admins database
            if ($adminManager->checkIfExist('admins', 'login', $login)) {
                echo json_encode(['err' => 'Admin already exists']);
                return false;
            }

            // if there is such admin in the admins_temporary database we delete it to overwrite it with new data
            if ($adminManager->checkIfExist('admins_temporary', 'login', $login)) {
                $adminManager->deleteRecord('admins_temporary', 'login', $login);
            }

            // if there is no such admin in the admins database we add it to the admins_temporary database
            if (!$adminManager->checkIfExist('admins_temporary', 'login', $login)) {
                $randomNumber = mt_rand(100000000, 999999999);
                $adminManager->addRecord('sssi', array(
                    'admins_temporary' => array(
                        'login' => $login,
                        'hashed_password' => password_hash($password, PASSWORD_DEFAULT),
                        'email' => $email,
                        'randomNumber' => $randomNumber
                    )
                ));

                // creating layouts for emails on local server for testing only
                // for production this 'if' statement should be removed
        //      if(!$adminManager->createLayoutsForEmails($login)) {
        //          throw new \Exception("Failed to create layouts for emails on local server");
        //     };

                $emailBody = MyEmailSender::getBodyForEmailConfirmation($email, $login, $randomNumber);
                MyEmailSender::sendEmail($emailBody, $email, "noAdmin");
                echo json_encode(['ok' => 'adding proccess sucessfuly startedd']);

            } else {
                echo json_encode(['err' => 'Admin already exists']);
            }
        } else {
            echo json_encode(['err' => $message]);
        }
        return true;
    }

    public function deleteThisAdmin($login) : bool
    {
        if($this->admin !== $login) {
            throw new \Exception("You dont have permission to delete this admin");
        }
        $adminManager = new AdminManager($this->mysqli);
        $adminManager->deleteRecord('admins', 'login', $this->admin);
        $adminManager->dropTable($this->scans);
        $adminManager->dropTable($this->users);
        $adminManager->deleteLayoutsForEmails($this->admin);
        echo "ok";
        return true;
    }

    private function close() : void
    {
        $this->mysqli->close();
    }
}

