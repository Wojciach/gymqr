import { customFetch } from './customFetch.js';
import { showAlert } from './showAlert.js';


    $("#loginButton").click(() => {
        grecaptcha.ready(function() {
            grecaptcha.execute('6LfSK1wpAAAAANjGvUUHlIVMCElgpB2VvVMe_huM', {action: 'submit'}).then(function(token) {
                checkCredentials(token);
            });
        });
    });

    $("#signUpButton").click(() => {
        grecaptcha.ready(function() {
            grecaptcha.execute('6LfSK1wpAAAAANjGvUUHlIVMCElgpB2VvVMe_huM', {action: 'submit'}).then(function(token) {
                createNewAdmin(token);
            });
        });
    });

function checkCredentials(token) {
    
    let login = $("#loginLogin").val();
    let password = $("#loginPassword").val();
    let recaptchaResponse = token;

    customFetch({checkCredentials: [login, password, recaptchaResponse]})
        .then(response => response.json()) //should be a json
        .then(data => {
            //console.log(data);
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

$(document).ready(function() {
    $("#signUpButton").slideUp(0);
});

$('#singnUpLogin').click(function(){
    if($('#btnSlider').text() == 'Sign Up') {
        $('#btnSlider').text('Login');

        $('#loginLogin').prop("disabled", true);
        $('#loginPassword').prop("disabled", true);

        $('#btnFrame').addClass('on');
        $('#btnSlider').addClass('on');
        $('#loginInputs').addClass('on');


        $('#signUpButton').slideDown('fast');
        $('#loginButtons').slideUp('fast');
    } else {
        $('#btnSlider').text('Sign Up');

        $('#loginLogin').prop("disabled", false);
        $('#loginPassword').prop("disabled", false);

        $('#btnFrame').removeClass('on');
        $('#btnSlider').removeClass('on');
        $('#loginInputs').removeClass('on');

        $('#signUpButton').slideUp('fast');
        $('#loginButtons').slideDown('fast');
    }
});

function createNewAdmin(token) {
    alert("xxx");
    customFetch({createNewAdmin : ["aa", 'bbb', token]})
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })

}