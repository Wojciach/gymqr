//this function let you to run calbackFunction with prevoius confirmation

function withConfirmation(calbackFunction, userData = null, message) {

    console.log("withConfirmation");
    console.log(message);
    
    $("#confirmDialog").css("display", "flex");
    $("#confirmText").html(message);
   

    let userDetails = userData 
    ? userData?.name + " " + userData?.surname + " (id: " + userData?.id + ")"
    : "";
    
    $("#confirmUserDetails").text(userDetails);

    $("#confirmYes").click(function() {
        $("#confirmDialog").hide();
        calbackFunction(userData?.id);
    });

    $("#confirmNo").click(function() {
        console.log("confirmNo clicked");
        $("#confirmDialog").hide();
    });
}

export default withConfirmation;
