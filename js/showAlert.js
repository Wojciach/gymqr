//alerts manipulation
export function showAlert(
  isOk,
  customMessage = null,
  color = null,
  IDs = null,
  alertInstructions = null
  ) {
    var alertColor = color ? color : ["fontColor", "fontColor"];
    $("#alert").css("display", "flex");
    $("#alertTitle").html(isOk).addClass(alertColor[0]);
    $("#alertMessage").html(customMessage).addClass(alertColor[1]);
    $("#alertUserDetails").html(IDs);
    $("#alertInstructions").html(alertInstructions);
}

$(document).on('click', '#closeAlert', function() {
  $("#alert").hide();
});

