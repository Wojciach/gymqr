import { showAlert } from './showAlert.js';

export function emailValidation(email) {
    var pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (email.match(pattern)) {
        return true;
    } else {
        $("#alert").load("alert.html", () => showAlert('Invalid email address', email));
     //   showAlert('Invalid email address', email);
        return false;
    }
}
