<?php 
namespace Wojciach\Wojciach;

use Wojciach\Wojciach\PHPMailerEmail;
use \Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Wojciach\Wojciach\QrSender;
use Wojciach\Wojciach\TokenManager;

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
        $this->scans = "scans_" . $admin;
        $this->users = "users_" . $admin;
    }

    public function getAll($tableName) : void
    {
        $allowedTables = ['users', 'scans'];
        if (!in_array($tableName, $allowedTables)) {
            throw new Exception('Invalid table name');
        }

        $tableName .= "_" . $this->admin;

        $sql = "SELECT * FROM $tableName";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        $result->free_result();
        echo json_encode($rows);
    }

    public function addUser($body) : void
    {   
        $randomNumber = mt_rand(100000, 999999);
        $sql = "INSERT INTO `$this->users`(`name`, `surname`, `pin`, `email`, `paidDate`, `paidAmount`) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('ssissd', $body->name, $body->surname, $randomNumber, $body->email, $body->paidDate, $body->paidAmount);
        $stmt->execute();
    }

    public function requestForUserDetails($DBid) : void
    {
        $sql = "SELECT * FROM `$this->users` WHERE id = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('i', $DBid);
        $stmt->execute();
        $result = $stmt->get_result();  

        $row = $result->fetch_assoc();
        echo json_encode($row);
        $result->free_result();
        exit();
    }

    public function editUser($body) : void
    {
        $sql = "UPDATE `$this->users` SET `name`=?, `surname`=?, `email`=?, `paidDate`=?, `paidAmount`=? WHERE `id`=?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('ssssdi', $body->name, $body->surname, $body->email, $body->paidDate, $body->paidAmount, $body->DBid);
        $stmt->execute();
    }

    public function deleteUser($DBid) : void
    {
        $sql = "DELETE FROM `$this->users` WHERE `id` = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('i', $DBid);
        $stmt->execute();
    }

    private function close() : void {
        $this->mysqli->close();
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
        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = array($row['id'], $row['name'], $row['surname'], $row['pin'], $row['email'], $row['paidDate'], $row['paidAmount']);
        }
        $result->free_result();
        $this->usersData = $rows;
        return $rows;
    }

    private function validateEmailAddresses($usersData)
    {
        $invalidEmailsRows = array();
        foreach ($usersData as $record) {
            if (!filter_var($record[4], FILTER_VALIDATE_EMAIL)) {
                $invalidEmailsRows[] = $record;
            }
        }
    
        if (empty($invalidEmailsRows)) {
            $this->validEmailsRows = $usersData;
            return true;
        } else {
            $this->invalidEmailsRows = $invalidEmailsRows;
            return false;
        }
    }

    public function sendQrViaEmails(array $IDs)
    {
       QrSender::isArrayOfInts($IDs);

        $this->getUsersData($IDs);
        $emailValidation = $this->validateEmailAddresses($this->usersData);
        if($emailValidation === true)
        {
            foreach ($this->validEmailsRows as $row) {
                $body = QrSender::getBodyForQrEmail($row, $this->admin);
                QrSender::sendEmail($body, $row[4], $this->admin);
            }
            echo json_encode(array('validEmails' => $this->validEmailsRows));
        } else {
            echo json_encode(array('invalidEmails' => $this->invalidEmailsRows));
        }
    }

    public function sendReminder($ID)
    {
        if (!is_int($ID)) {
            throw new \InvalidArgumentException('$ID must be an integer');
        }

        $this->getUsersData([$ID]);
        $userToSendReminder = $this->usersData[0];
        $body = QrSender::getBodyForReminderEmail($userToSendReminder, $this->admin);
        QrSender::sendEmail($body, $userToSendReminder[4], $this->admin);
        echo json_encode(array("ok" => $userToSendReminder[4]));
    }

    public function saveScannedQRs($scannedQRsArray)
    {
        $arrayOfScans = $scannedQRsArray;
        $repeatedScans = array();
        foreach ($arrayOfScans as $scannedQR) {
            $sql = "SELECT * FROM `$this->scans` WHERE user_ID = ? AND scanTime = ?";
            $stmt = $this->mysqli->prepare($sql);
            $stmt->bind_param('is', $scannedQR[0], $scannedQR[2]);
            $stmt->execute();
            $result = $stmt->get_result();
            //$result = $this->mysqli->query($sql);
            if ($result->num_rows === 0) {
                $sql = "INSERT INTO `$this->scans`(`user_ID`, `pin`, `scanTime`) VALUES (?, ?, ?)";
                $stmt = $this->mysqli->prepare($sql);
                $stmt->bind_param('iss', $scannedQR[0], $scannedQR[1], $scannedQR[2]);
                $stmt->execute();
               // $this->mysqli->query($sql);
                $repeatedScans[] = $scannedQR;
            } elseif ($result->num_rows > 0) {
                $repeatedScans[] = $scannedQR;
            }
        }
        // repatedScans coming back to frontend to be marked as sent
        echo json_encode($repeatedScans);
    }
    
    public function checkCredentials($cerdentials)
    {
        $login = $cerdentials[0];
        $loginPassword = $cerdentials[1];

        $sql = "SELECT * FROM `admins` WHERE `login` = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('s', $login);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($result->num_rows === 1) {
            if (password_verify($loginPassword, $row['hashed_password'])) {
               // echo 'Password is valid!';
               TokenManager::checkCredentials($login, $row);
            } else {
               echo json_encode(['err' => 'Invalid password']);
            }
        } else {
           echo json_encode(['err' => 'no such user']);
        }
    }

    public function createNewAdmin($adminData)
    {
        echo "request succesful";
        // $login = $adminData[0];
        // $loginPassword = $adminData[1];
        // $layout = $adminData[2];
        // $hashedPassword = password_hash($loginPassword, PASSWORD_DEFAULT);
        // $sql = "INSERT INTO `admins`(`login`, `hashed_password`, `layout`) VALUES (?, ?, ?)";
        // $stmt = $this->mysqli->prepare($sql);
        // $stmt->bind_param('sss', $login, $hashedPassword, $layout);
        // $stmt->execute();
    }
}

