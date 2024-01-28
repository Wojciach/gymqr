import { showAlert } from "./showAlert.js";

let scanner;
let currentCameraIndex = 0;
let cameras;

export async function swapCamera() {

    // Stop the current scanner
    await scanner.stop();

    // Increment the current camera index
    currentCameraIndex++;

    // If we've gone past the end of the array, loop back to the start
    if (currentCameraIndex >= cameras.length) {
        currentCameraIndex = 0;
    }

    // Start the scanner with the next camera
    scanner.start(cameras[currentCameraIndex]);
}


export function scanCode() {

    scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

    scanner.addListener('scan', function (content) {
        console.log(content);
        const contentObj = JSON.parse(content);

        const database = localStorage.getItem("Database");
        const databaseObj = JSON.parse(database);

       //check if scaned user id in the database
        let result = databaseObj.find(obj => obj.id == contentObj[0] && obj.pin == contentObj[1]);
        
        if (result) {
            $("#alert").load("alert.html", () => showAlert("Scanned successfully."));
            setTimeout(()=>{$("#alert").hide()}, 2000);
        } else {
            $("#alert").load("alert.html", () => showAlert("Credentials are not valid.", null, ["red", "green"], null));
            return;
        }
        
        if ($('#scannedUsers').length) {

            //add scan time to the content
            content = JSON.parse(content);
            let date = new Date();
            date.setHours(date.getHours() + 1); // add 1 hour
            let mysqlFormatDate = date.toISOString().slice(0, 19).replace('T', ' ');;
            content.push(mysqlFormatDate);

            if (localStorage.getItem("scannedUsers") === null) {
                localStorage.setItem("scannedUsers", JSON.stringify([]));
            }

            let currentData = localStorage.getItem("scannedUsers");
            currentData = JSON.parse(currentData);
            currentData.push(content);

            localStorage.setItem("scannedUsers", JSON.stringify(currentData));
            
            $('#scannedUsers #list').prepend(
                `<li>
                    <div class="liID">${content[0]}.</div>
                    <div class="liNameSurname">
                        <div class="liName">${result.name}</div>
                        <div class="liSurname">${result.surname}</div>
                    </div>
                    <div class="liTime">${content[2].slice(11)}</div>
                    <div class="liStatus"></div>
                </li>`
            );
        }
    });

    Instascan.Camera.getCameras().then(function (cams) {
        cameras = cams;
        if (cameras.length > 0) {
            scanner.start(cameras[currentCameraIndex]);
            console.log(cameras);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
}

export function stopScanning() {
        scanner.stop();
      //  console.log("scanner stopped");
}