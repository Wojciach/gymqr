//alerts manipulation
export function showAlert(isOk, customMessage = null, color = null, IDs = null) {

    // console.log("showAlert FIRED!");
    // console.log(isOk);
    // console.log(IDs);

    var alertColor = color ? color : ["fontColor", "fontColor"];

  if (isOk === "err" || isOk === "ok") {
    $("#alert").css("display", "flex");

    //$("#alertTitle").text(message.alertTitle[isOk]).css("color", alertColor[0]);
    $("#alertTitle").text(message.alertTitle[isOk]).addClass(alertColor[0]);

    //$("#alertMessage").text(message.alertMessage[isOk]).css("color", alertColor[1]);
    $("#alertTitle").text(message.alertTitle[isOk]).addClass(alertColor[1]);

    $("#alertUserDetails").html(IDs);
    $("#alertInstructions").html(message.alertInstructions[isOk]);
  } else {
    $("#alert").css("display", "flex");

    //$("#alertTitle").html(isOk).css("color", alertColor[0]);
    $("#alertTitle").html(isOk).addClass(alertColor[0]);

    //$("#alertMessage").html(customMessage).css("color", alertColor[1]);
    $("#alertMessage").html(customMessage).addClass(alertColor[1]);

    $("#alertUserDetails").html(IDs);
    $("#alertInstructions").html('');
  }
}

$(document).on('click', '#closeAlert', function() {
  $("#alert").hide();
});

const message = {
  alertTitle: {
    ok: "Emails Sent!",
    err: "Sending Failed!"
  },
  alertMessage: {
    ok: "QR codes have been sent to the following users: ",
    err: "Sorry! some users you are trying to send QR codes to do not have a valid email address in our database. Their IDs are:"
  },
  userDetails: {
    ok: "",
    err: ""
  },
  alertInstructions: {
    ok: "",
    err: "To send QR codes correctly, please update the database with valid email addresses for the users listed above."
  },
};