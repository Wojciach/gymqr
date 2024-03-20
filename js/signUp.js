import { customFetch } from "./customFetch.js";
import { showAlert } from "./showAlert.js";

//exaple of form input
// $('#signupUsername').val('jjjkkk'),
// $('#signupPassword').val('jjjkkk1!A'),
// $('#signupPasswordConfirm').val('jjjkkk1!A'),
// $('#signupEmail').val('')

$("#snedSignUpForm").off('click').click(() => {
    if (clientSideValidation()) {
        grecaptcha.ready(function() {
            $("#snedSignUpForm").addClass('loading');
            grecaptcha.execute('6LfSK1wpAAAAANjGvUUHlIVMCElgpB2VvVMe_huM', {action: 'submit'})
                .then(function(token) { createNewAdmin(token); })
                .then(() => $("#snedSignUpForm").removeClass('loading'));
        });
    } else {
       // alert("Please fill in the form correctly");
    }
});

$("#cancelButton").off('click').click(() => {
    window.location.href = "login.html";
})

function createNewAdmin(token) {
   let formData = {
      userName:  $('#signupUsername').val(),
      password:  $('#signupPassword').val(),
      passwordConfirm:  $('#signupPasswordConfirm').val(),
      email:  $('#signupEmail').val() 
    }
    customFetch({
        createNewAdmin : [
            token,
            formData.userName,
            formData.password,
            formData.passwordConfirm,
            formData.email
        ]})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log("from server:")
            console.log(data?.ok);
            console.log(data?.err);
            return data;
        })
        .then((data) => {
            if (data.ok) {
                $("#alert").load("alert.html",
                    () => { showAlert(
                        "Success!",
                        "Account createtion initiated for the user:",
                        ['fontColor', 'fontColor'],
                        [formData.userName, formData.email].join(" - "),
                        "Please check your email for the verification link",
                    );
                        // Add event listener to the button in the alert window
                        $('#closeAlert').on('click', function() {
                            window.location.href = "login.html";
                        });
                    }
                );
                return "ok";
            } else if (data.err) {
                throw new Error(data.err);
            }
            
        })
        .then((ok) => {
            if (ok === "ok") { //fix this thing to awaig with claring the form
                console.log("second then !!!!!!!");
                $('#signupUsername').val(''),
                $('#signupPassword').val(''),
                $('#signupPasswordConfirm').val(''),
                $('#signupEmail').val('')
            } else {
                throw new Error("Server error");
            }
           // window.location.href = "login.html";
        })
        .catch((err) => {
            console.log(err);
            $("#alert").load("alert.html",
                () => showAlert(
                    "Ops!",
                    `${err.message} <br> Please contact the administrator. <br> Or try different name.`,
                    ['fontColorRed', 'fontColor2'],
                    null,
                ));
        });
}

function clientSideValidation() {

    const userName = $('#signupUsername');
    const password = $('#signupPassword');
    const passwordConfirm = $('#signupPasswordConfirm');
    const email = $('#signupEmail');

    if (userName.val().length > 20 || userName.val().length < 5) {
        userName.parent()
            .addClass('wrong')
            .find('.warning')
            .text('Username must be between 5 and 20 characters long')
        return false;
    } else {
        userName.parent()
            .removeClass('wrong')
            .find(".warning")
            .text('');
    }

    if(!validator.valdateName(userName.val())) {
        userName.parent()
            .addClass('wrong')
            .find('.warning')
            .text('Username can only contain letters, numbers, and the following characters: . _ -')
        return false;
    } else {
        userName.parent()
            .removeClass('wrong')
            .find(".warning")
            .text('');
    }

    if (password.val() !== passwordConfirm.val()) {
        password.parent()
            .addClass('wrong')
            .find(".warning")
            .text('"Password" and "Confirm Password" do not match')
        passwordConfirm.parent()
            .addClass('wrong')
            .find(".warning")
            .text('"Password" and "Confirm Password" do not match')
        return false;
    } else {
        password.parent()
            .removeClass('wrong')
            .find(".warning")
            .text('');
        passwordConfirm.parent()
            .removeClass('wrong')
            .find(".warning")
            .text('');
    }

    if (password.val().length < 6 || password.val().length > 32) {
        password.parent()
            .addClass('wrong')
            .find(".warning")
            .text('Password must be between 6 and 32 characters long')
        return false;
    } else {
        password.parent()
            .removeClass('wrong')
            .find(".warning")
            .text('');
    }

    if (!validator.validatePassword(password.val())) {
        password.parent()
            .addClass('wrong')
            .find(".warning")
            .text('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        return false;
    } else {
        password.parent()
            .removeClass('wrong')
            .find(".warning")
            .text('');
    }

    if (!validator.validateEmail(email.val())) {
        email.parent()
            .addClass('wrong')
            .find(".warning")
            .text('Invalid email address')
        return false;
    } else {
        email.parent()
            .removeClass('wrong')
            .find(".warning")
            .text('');
    }

    console.log("client side validation passed");
    return true;

}

const validator = {
    validateEmail(email) {
        var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    },
    valdateName(name) {
        var regex = /^[a-zA-Z0-9._-]+$/;
        return regex.test(name);
    },
    validatePassword(password) {
        // Check character types
        var hasUppercase = /[A-Z]/.test(password);
        var hasLowercase = /[a-z]/.test(password);
        var hasNumber = /\d/.test(password);
        var hasSpecialChar = /\W/.test(password);
        if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
            return false;
        } else {
            return true;
        }
    }
}


