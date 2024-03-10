<?php
namespace Wojciach\Wojciach;

use Wojciach\Wojciach\PHPMailerEmail;

class MyEmailSender
{
    public static function sendEmail($body, $emailAddress, $admin) : bool
    {
                $passesDir;
                // if user doesn to have its own individual email set, the universal one is used
                $individuaEmaillPass = "./passes/$admin/emailPass.php";
                $universalEmailPass = "./passes/tester/emailPass.php";
                if (file_exists($individuaEmaillPass)) {
                    $passesDir = $individuaEmaillPass;
                } else {
                    $passesDir = $universalEmailPass;
                }
        

        $mail = new PHPMailerEmail($body, $passesDir, $emailAddress);
        if(!$mail->send()) {
            throw new \Exception("Email could not be sent. Mailer Error: " . $mail->getErrorInfo());
        }
        return true;
    }

    public static function getBodyForQrEmail($row, $admin) : string
    {   
        // file name is going made of ID and timestamp, both need to be passed to link in email (PHPmailer) and file creator in ednpoint (QRcode generator)
        $id = $row[0];
        $timeStamp = time();
        $timeStampString = strval($timeStamp);
        $fileName = $id . "_" . $timeStampString . ".png";
        $json = json_encode($row);

        // creating QR image on the server using external endpoint
        $endpointUrl = "https://utc.make-me.website/mockEndpoint.php?param=" . urlencode($json) . "&time=" . $timeStampString . "&admin=" . $admin;
        $response = file_get_contents($endpointUrl);
        if ($response !== "success") {
            throw new \Exception("Failed to create QR code image on the server.");
        }

        // creating a link to QR code image on the server that is going to be passed to email
        $linkString = "https://utc.make-me.website/QRs/$admin/" . $fileName;

        $dir;
        $fileName = "./emailLayouts/$admin/emailLayout.html";
        $backupFileName = "./emailLayouts/tester/emailLayout.html";
        if (file_exists($fileName)) {
            $dir = $fileName;
        } else {
            $dir = $backupFileName;
        }
        $template = file_get_contents($dir);
        if (!$template) {
            throw new \Exception("Failed to open email layout file: emailLayout.html");
        }

        $body = str_replace(
            array('{{qrCodeLink}}', '{{name}}', '{{surname}}', '{{id}}'),
            array($linkString, $row[1], $row[2], $row[0]),
            $template
        );
        return $body;
    }

    public static function getBodyForReminderEmail($row, $admin) : string
    {
        // calculating how many days have passed since payment
        $paidDate = new \DateTime($row[5]);
        $currentDate = new \DateTime();
        $daysFromPayment = $paidDate->diff($currentDate);

        // crating email body to be sent to user as a reminder
        // posible using backup email layout in case the admin has not created its own layout
        $dir;
        $fileName = "./emailLayouts/$admin/emailLayout.html";
        $backupFileName = "./emailLayouts/tester/emailLayout.html";
        if (file_exists($filename)) {
            $dir = $fileName;
        } else {
            $dir = $backupFilename;
        }
        $template = file_get_contents($dir);
        if (!$template) {
            throw new \Exception("Failed to open email layout file: reminderEmailLayout.html");
        }
        $body = str_replace(
            array('{{name}}', '{{surname}}', '{{id}}', '{{paidDate}}', '{{paidAmount}}', '{{daysFromPayment}}', '{{admin}}'),
            array($row[1], $row[2], $row[0], $row[5], $row[6], $daysFromPayment->format('%a'), $admin),
            $template
        );
        return $body;
    }

    public static function getBodyForEmailConfirmation($email, $adminName, $randomNumber) : string
    {
        $template = file_get_contents("./emailLayouts/confirmEmailLayout.html");
        if (!$template) {
            throw new \Exception("Failed to open email layout file: confirmEmailLayout.html");
        }
        $link = "https://utc.make-me.website/confirmEmail.php?email=" . $email . "&adminName=" . $adminName . "&rand=" . $randomNumber;
        $body = str_replace(
            array('{{link}}', '{{userName}}', '{{userEmail}}', '{{appName}}'),
            array($link, $adminName, $email, "GymQr"),
            $template
        );
        return $body;
    }

    public static function isArrayOfInts($arr) 
    {
        if (!is_array($arr)) {
            throw new \InvalidArgumentException('$IDs must be an array');
        }
        
        // checkig if all elements in the array are integers
        $filteredIDs = array_filter($arr, 'is_int');
    
        if (count($arr) !== count($filteredIDs)) {
            throw new \InvalidArgumentException('All elements in $IDs must be integers');
        }
    }
    
}