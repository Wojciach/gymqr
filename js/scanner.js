import { scanCode, stopScanning, swapCamera} from "./scanCode.js";
import {status} from "./js.js";
import databaseCorrectnessCheck from "./databaseCorrectnessCheck.js";
import showDB_version from "./showDB_version.js";
import refreshDatabase from "./refreshDatabase.js";
import { showAlert } from "./showAlert.js";
import withConfirmation from "./withConfirmation.js";
import sendScansToServer from "./sendScansToServer.js";

(async () => { 
    await refreshDatabase('users', 'Database');
    if(localStorage.getItem("scannedUsers")) {
        sendScansToServer();
    }
})();

if (databaseCorrectnessCheck(localStorage.getItem("Database")) === true) {
  //  console.log("we have correct database");
   // $("#DB_Version").css("color", "yellowgreen");
    $("#DB_Version").removeClass("fontColorRed");
    $("#DB_Version").addClass("fontColor2");
    $("#DB_Version").text(showDB_version(localStorage.getItem("Database")))
    status.databaseCorrectness = true;

} else {
    console.log("we dont have correct database");
    status.databaseCorrectness = false;
    status.emptyDatabase = true;
    //$("#DB_Version").css("color", "red");
    $("#DB_Version").removeClass("fontColor2");
    $("#DB_Version").addClass("fontColorRed");
    $("#DB_Version").text("incorrect database");
};


var scannedUsers = localStorage.getItem("scannedUsers");
if (scannedUsers) {

    scannedUsers = JSON.parse(scannedUsers);
    let Database = JSON.parse(localStorage.getItem("Database"));

    scannedUsers.map((scan) => {
        let indexInDatabase = Database.find(obj => obj.id == scan[0]);
        $('#scannedUsers #list').prepend(
            `<li>
                <div class="liID">${scan[0]}.</div>
                <div class="liNameSurname">
                    <div class="liName">${indexInDatabase.name}</div>
                    <div class="liSurname">${indexInDatabase.surname}</div>
                </div>
                <div class="liTime">${scan[2].slice(11)}</div>
                <div class="liStatus"></div>
            </li>`
        );
    });
}

$("#startScanning").click(function() {
    console.log("startScanning");
    console.log(status.databaseCorrectness);
    console.log(status.databaseCorrectness);
    console.log("XXXstartScanningXXXX");
    if ((status.databaseCorrectness === false) || (status.emptyDatabase === true)) {
        $("#alert").load(
            "alert.html",
            () => showAlert(
                "WARNING!",
                "There is no uploaded database to check users against. However, You can still scan the codes now and send them to server later."
            ));
    }
    $("#startScanning").css("display", "none");
    $("#videoPreview").css("display", "flex");
    scanCode();
})

$("#swapCamera").click(function() {
    swapCamera();
});

$("#stop").click(function() {
    stopScanning();
    $("#videoPreview").slideUp();
    $("#buttons").css("display", "flex");
});

$("#goBackFromScanner").click(function() {
    window.location.href = 'index.html';
});

$("#sendScansToServer").click(sendScansToServer);

$("#clearScans").click(function() {
    $("#confirmDialog").load(
        "confirmDialog.html?_=" + Math.random(),
        () => withConfirmation(
            ()=>{
                if ($('li:not(.sent)').length > 0) {
                    $("#alert").load(
                        "alert.html",
                        () => showAlert(
                            "WARNING!",
                            "There are still some unsent scans. <br> Please send them to server first.",
                            ["yellow", "green"]
                        )
                    );
                    return;
                } else {
                    localStorage.removeItem("scannedUsers");
                    window.location.reload();
                }
            },
            null,
            "Doy you want to clear all scans?"
    ));
});