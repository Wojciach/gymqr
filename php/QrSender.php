<?php
namespace Wojciach\Wojciach;

use Wojciach\Wojciach\PHPMailerEmail;

class QrSender
{
    public static function sendEmail($body, $emailAddress, $admin)
    {
        $mail = new PHPMailerEmail($body, "./passes/$admin/emailPass.php", $emailAddress);
        $mail->send();
    }

    public static function getBodyForQrEmail($row, $admin)
    {   
        // file name is going made of ID and timestamp, both need to be passed to link in email (PHPmailer) and file creator in ednpoint (QRcode generator)
        $id = $row[0];
        $timeStamp = time();
        $timeStampString = strval($timeStamp);
        $fileName = $id . "_" . $timeStampString . ".png";
        $json = json_encode($row);

        $endpointUrl = "https://utc.make-me.website/mockEndpoint.php?param=" . urlencode($json) . "&time=" . $timeStampString . "&admin=" . $admin;
        $response = file_get_contents($endpointUrl);

        // linkt to QR code image on the server that is going to be passed to email
        $linkString = "https://utc.make-me.website/QRs/$admin/" . $fileName;
        $template = file_get_contents("../emailLayouts/$admin/emailLayout.html");
        $body = str_replace(
            array('{{qrCodeLink}}', '{{name}}', '{{surname}}', '{{id}}'),
            array($linkString, $row[1], $row[2], $row[0]),
            $template
        );
        return $body;
    }

    public static function getBodyForReminderEmail($row, $admin)
    {
        // calculating how many days have passed since payment
        $paidDate = new \DateTime($row[5]);
        $currentDate = new \DateTime();
        $daysFromPayment = $paidDate->diff($currentDate);

        // crating email body to be sent to user as a reminder
        $template = file_get_contents("../emailLayouts/$admin/reminderEmailLayout.html");
        $body = str_replace(
            array('{{name}}', '{{surname}}', '{{id}}', '{{paidDate}}', '{{paidAmount}}', '{{daysFromPayment}}', '{{admin}}'),
            array($row[1], $row[2], $row[0], $row[5], $row[6], $daysFromPayment->format('%a'), $admin),
            $template
        );
        return $body;
    }

    public static function isArrayOfInts($arr) 
    {
        if (!is_array($arr)) {
            throw new \InvalidArgumentException('$IDs must be an array');
        }
    
        $filteredIDs = array_filter($arr, 'is_int');
    
        if (count($arr) !== count($filteredIDs)) {
            throw new \InvalidArgumentException('All elements in $IDs must be integers');
        }
    }
    
}