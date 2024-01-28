import { customFetch } from "./customFetch.js";
import { status } from "./js.js";
import { showAlert } from "./showAlert.js";

function sendScansToServer() {
    let scannedUsers = localStorage.getItem("scannedUsers");
    scannedUsers = JSON.parse(scannedUsers);
    if (status.onLine === false) {
        $("#alert").load(
            "alert.html",
            () => showAlert(
                "WARNING!",
                "You are in offline mode. <br> Sending scans to server is not possible at the moment."
        ));
    } else if (!scannedUsers) {
        $("#alert").load(
            "alert.html",
            () => showAlert(
                "WARNING!",
                "There is no scans to be send to server. <br> Please scan some codes first."
        ));
    } else {
      //  console.log("sending scans to server");
        customFetch({saveScannedQRs: scannedUsers})
        .then(response => response.json())
        .then(data => {
           // console.log(data)
            data.map((item) => {
                // mark as sent those scans that came back from server
                $("li div:contains('" + item[2].slice(11) + "')").parent().addClass("sent");
            })
        })
        .catch(() => {
            $("#alert").load(
                "alert.html",
                () => showAlert(
                    "Ops!",
                    "That's a serious error With sendind scans.(SSTS). <br> Please contact the administrator.",
                    ['fontColorRed', 'fontColor2'],
                    null,
            ));
        });
    }
}

export default sendScansToServer;