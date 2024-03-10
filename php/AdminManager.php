<?php
namespace Wojciach\Wojciach;

class AdminManager {

    private $mysqli;

    public function __construct($mysqli)
    {
        $this->mysqli = $mysqli;
    }

    public function checkIfExist($tableName, $columnName, $value) 
    {
        $sql = "SELECT * FROM `$tableName` WHERE `$columnName` = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('s', $value);
        $stmt->execute();
        $result = $stmt->get_result();
        $numRecords = $result->num_rows;
        $result->free_result();
        if ($numRecords > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function addRecord(string $types, array $array) : bool
    {
            //adding a new record to databse based on array where key is the table name and value is an array of columns and values
            $tableName =  array_keys($array)[0];

            $columnNames = array_keys($array[$tableName]);
            $columnNamesString = implode("`, `", $columnNames);

            $placeholders = implode(", ", array_fill(0, count($columnNames), "?"));

            $sql = "INSERT INTO `$tableName` (`$columnNamesString`) VALUES ($placeholders)";
            $stmt = $this->mysqli->prepare($sql);
            $values = array_values($array[$tableName]);
            $stmt->bind_param($types, ...$values);
            $result = $stmt->execute();
            if (!$result) {
                throw new \Exception($stmt->error);
            }
            return true;
    }

    public function createLayoutsForEmails($adminName) : bool
    {
        $dir = "./emailLayouts/$adminName";
        if (!file_exists($dir)) {
            if(!mkdir($dir, 0777, true)) {
                throw new \Exception("Failed to create directory for email layouts");
            }
        } 

        $file = './emailLayouts/tester/emailLayout.html';
        $dest = "./emailLayouts/$adminName/emailLayout.html";
        if (!copy($file, $dest)) {
            throw new \Exception("Failed to copy file: emailLayout.html");
        }

        $file = './emailLayouts/tester/reminderEmailLayout.html';
        $dest = "./emailLayouts/$adminName/reminderEmailLayout.html";
        if (!copy($file, $dest)) {
            throw new \Exception("Failed to copy file: reminderEmailLayout.html");
        } 

        $dir = "./passes/$adminName";
        if (!file_exists($dir)) {
            if(!mkdir($dir, 0777, true)) {
                throw new \Exception("Failed to create directory with passes");
            }
        }

        $file = './passes/tester/emailPass.php';
        $dest = "./passes/$adminName/emailPass.php";
        if (!copy($file, $dest)) {
            throw new \Exception("Failed to copy file: emailPass.php");
        }
        return true;
    }

    public function deleteLayoutsForEmails($adminName) : bool
    {
        $dest = "./emailLayouts/$adminName/emailLayout.html";
        if (file_exists($dest)) {
            if (!unlink($dest)) {
                throw new \Exception("Failed to delete a file: emailLayout.html");
            }
        }

        $dest = "./emailLayouts/$adminName/reminderEmailLayout.html";
        if (file_exists($dest)) {
            if (!unlink($dest)) {
                throw new \Exception("Failed to delete a file: reminderEmailLayout.html");
            }
        }

        $dir = "./emailLayouts/$adminName";
        if (is_dir($dir)) {
            if (!rmdir($dir)) {
                throw new Exception("Failed to remove directory: $dir");
            }
        }
        
        $dest = "./passes/$adminName/emailPass.php";
        if (file_exists($dest)) {
            if (!unlink($dest)) {
                throw new \Exception("Failed to delete a file: emailPass.php");
            }
        }

        $dir = "./passes/$adminName";
        if (is_dir($dir)) {
            if (!rmdir($dir)) {
                throw new Exception("Failed to remove directory: $dir");
            }
        }
        return true;
    }

    public function deleteRecord($tableName, $columnName, $value) : bool
    {
        $sql = "DELETE FROM `$tableName` WHERE `$columnName` = ?";
        $stmt = $this->mysqli->prepare($sql);
        $stmt->bind_param('s', $value);
        $result = $stmt->execute();
        if (!$result) {
            throw new \Exception($stmt->error);
        }
        return true;
    }

    public function creataTable($newTable, $baseTable) : bool
    {   
        $newTable = $this->mysqli->real_escape_string($newTable);
        $baseTable = $this->mysqli->real_escape_string($baseTable);
        $sql = "CREATE TABLE $newTable LIKE $baseTable";
        $result = $this->mysqli->query($sql);
        if (!$result) {
            throw new \Exception($this->mysqli->error);
        }
        return true;
    }

    public function dropTable($tableName) : bool
    {   
        $tableName = $this->mysqli->real_escape_string($tableName);
        $sql = "DROP TABLE $tableName";
        $result = $this->mysqli->query($sql);
        if (!$result) {
            throw new \Exception($this->mysqli->error);
        }
        return true;
    }

}