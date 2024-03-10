import {customFetch} from './customFetch.js';
import {showAlert} from './showAlert.js';

function sendReminder(id) {
   // console.log(id);
    customFetch({sendReminder: Number(id)})
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        if(data === "tokenError") {window.location.href = 'login.html'; return;}
        data = JSON.parse(data);
        if (Object.keys(data)[0] === "ok") {
           // console.log("ok in if");
          //  console.log(data.ok);
            $("#alert").load("alert.html", () => showAlert(
                "Email reminder sent to:",
                data.ok,
                ["green", "yellowgreen"],
                null
            ));
        } else {
          //  console.log("err in else");
           // console.log(data);
            $("#alert").load("alert.html", () => showAlert(
                "Sorry!",
                "Sending email reminder failed.",
                ["yellow", "green"],
                null
            ));
        }
    })
}

export default sendReminder;