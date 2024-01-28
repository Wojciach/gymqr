export function onlineIndicator(bool) {
   // console.log("onlineIndicator");
   // console.log(bool);
    if (bool === true) {
        $("#btnSlider").addClass("on");
        $("#onlineStatus").addClass("on");
        $("#btnFrame").addClass("on");
        $("#btnSlider").html("ON");
    } else {
        $("#btnSlider").removeClass("on");
        $("#onlineStatus").removeClass("on");
        $("#btnFrame").removeClass("on");
        $("#btnSlider").html("OFF");
    }
}