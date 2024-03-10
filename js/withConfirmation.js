//this function let you to run calbackFunction with prevoius confirmation

function withConfirmation(calbackFunction, userData = null, message, title = null) {

    console.log("withConfirmation");
    console.log(message);
    
    $("#confirmDialog").css("display", "flex");
    $("#confirmText").html(message);
    $("#confirmTitle").html(title); 
    $("#confirmUserDetails").text(userData);

    $("#confirmYes").off('click').click(function() {
        $("#confirmDialog").hide();
        calbackFunction(userData?.id);
    });

    $("#confirmNo").off('click').click(function() {
        console.log("confirmNo clicked");
        $("#confirmDialog").hide();
    });
}

export default withConfirmation;
