import {customFetch} from './customFetch.js';
import {showAlert} from './showAlert.js';


    $("#loginButton").click(() => {
        grecaptcha.ready(function() {
            grecaptcha.execute('6LfSK1wpAAAAANjGvUUHlIVMCElgpB2VvVMe_huM', {action: 'submit'}).then(function(token) {
                checkCredentials(token);
            });
        });
    });

function checkCredentials(token) {
    
    let login = $("#loginLogin").val();
    let password = $("#loginPassword").val();
    let recaptchaResponse = token;
   // console.log(recaptchaResponse);

    customFetch({checkCredentials: [login, password, recaptchaResponse]})
        .then(response => response.json()) //should be a json
        .then(data => {
           // console.log(data);
           // data = JSON.parse(data);
            if(data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("layout", data.layout);
                localStorage.setItem("admin", data.admin);
                window.location.href = 'index.html';
            } else {
              //  console.log(data);
              //  console.log(data.err);
                $("#alert").load(
                    "alert.html",
                    () => showAlert(
                        "Ops!",
                        data.err,
                        ['fontColor2', 'fontColor'],
                        null,
                ));
            }
        })
        .catch(() => {
            $("#alert").load(
                "alert.html",
                () => showAlert(
                    "Ops!",
                    "That's a serious login error. <br> Please contact the administrator.",
                    ['fontColorRed', 'fontColor2'],
                    null,
                ));
        });

}

$('#cancelButton').click(function(){
    window.location.href = 'index.html';
});