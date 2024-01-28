<?php

namespace Wojciach\Wojciach;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class PHPMailerEmail 
{
    private $mail;
    
    public function __construct($body, $passesDir, $emailAddress)
    {
        require($passesDir);
        $this->mail = new PHPMailer(true);
        //Server settings
        //$this->mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $this->mail->isSMTP();
        $this->mail->Host       = $eHost;
        $this->mail->SMTPAuth   = true;
        $this->mail->Username   = $eUserName;
        $this->mail->Password   = $ePassword;
        $this->mail->SMTPSecure = 'ssl';
        $this->mail->Port       = 465;
        $this->mail->SMTPOptions = array(
            'ssl' => array(
                //false for local dev true for production
                'verify_peer' => $verify_peer,
                'verify_peer_name' => true,
                'allow_self_signed' => true
            )
        );
        //Recipient
        $this->mail->setFrom($eUserName, $nameForEmail);
        $this->mail->addAddress($emailAddress);
        //Content
        $this->mail->isHTML(true);
        $this->mail->CharSet = 'UTF-8';
        $this->mail->Subject = $subjectForEmail;
        $this->mail->Body = $body;
        // $this->mail->send();
        return $this->mail;
    }
    public function send()
    {
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $this->mail->send();
    }
}
