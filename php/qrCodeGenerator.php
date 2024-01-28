<?php
namespace Wojciach\Wojciach;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\Writer\PngWriter;

use Endroid\QrCode\Builder\BuilderInterface;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\ErrorCorrectionLevel;

function qrCodeGenerator($string) : string 
{
    $result = Builder::create()
    ->writer(new PngWriter())
    ->writerOptions([])
    ->data($string)
    ->encoding(new Encoding('UTF-8'))
    ->size(300)
    ->margin(10)
    ->errorCorrectionLevel(ErrorCorrectionLevel::High)
    ->build();

    file_put_contents("./QRs/$string.png", $result->getString());

    $dataUrl = 'data:'.$result->getMimeType().';base64,'.base64_encode($result->getString());
    return $dataUrl;
}