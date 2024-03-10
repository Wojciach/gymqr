<?php
include "vendor/autoload.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\Writer\PngWriter;

use Endroid\QrCode\Builder\BuilderInterface;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\ErrorCorrectionLevel;

try {

    if (!isset($_GET['param'])) exit("No param");

    $paramUrlEncoded = $_GET['param'];
    $time = $_GET['time'];
    $admin = $_GET['admin'];

    $paramUrlDecoded = urldecode($paramUrlEncoded);
    $data = json_decode($paramUrlDecoded);

    function qrCodeGenerator($data, $time, $admin) : bool
    {
        $qrCodeArray = array($data[0], $data[3]);
        $qrCodeJson = json_encode($qrCodeArray);
        $result = Builder::create()
        ->writer(new PngWriter())
        ->writerOptions([])
        ->data($qrCodeJson)
        ->encoding(new Encoding('UTF-8'))
        ->size(300)
        ->margin(10) 
        ->errorCorrectionLevel(ErrorCorrectionLevel::High)
        ->build();

        $id = $data[0];
        $fileName = $id . "_" . $time . ".png";

        $existingFiles = glob("./QRs/$admin/" . $id . "_*.png");
        foreach ($existingFiles as $file) {
            unlink($file);
        }

        $path = "./QRs/$admin/";
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }
        file_put_contents($path . $fileName, $result->getString());
        
        $dataUrl = 'data:'.$result->getMimeType().';base64,'.base64_encode($result->getString());
        return true;
    }

    if(qrCodeGenerator($data, $time, $admin)) {
        echo "success";
    } else {
        echo "failure";
    }
}
catch(Exception $e) {
    echo $e->getMessage();
    exit();
}



