import createButton from "./createButton.js";
import { customFetch } from "./customFetch.js";
import databaseCorrectnessCheck from "./databaseCorrectnessCheck.js";
import displayFetchedDataIn from './displayFetchedDataIn.js';
import { showAlert } from "./showAlert.js";
import sortBy from "./sortBy.js";

export function showDBforQRsend() {

    // adhjusting buttons for different operations.
    // This function uses simlar code to showDB() 
    // but it it used for different purpose, 
    // namely it is used for sending QR codes to users.
    $("#sortingButtonBar button").removeClass("marked");
    $('#databaseButtonBar').empty();
    var btn1 = createButton("selectAll", "Select All");
    var btn2 = createButton("unselectAll", "Unselect All");
    var btn3 = createButton("sendQRs", "Send QRs To Selected");
    var btn4 = createButton("DBforQRsend", "Close");

    $('#databaseButtonBar').prepend(btn1, btn2, btn3, btn4);
    $("#sortingButtonBar button").click((event) => sortBy($("#database #fetchedData p"), event));
    
    $("#unselectAll").hide();
    $('#databaseButtonBar #selectAll').click(function() {
        $("#fetchedData p").addClass('marked');
        $("#selectAll").hide();
        $("#unselectAll").show();
    })
    $('#databaseButtonBar #unselectAll').click(function() {
        $("#fetchedData p").removeClass('marked');
        $("#unselectAll").hide();
        $("#selectAll").show();
    })

    $('#databaseButtonBar #sendQRs').click(function() {
        
        if ($("#fetchedData p.marked").length === 0) {
            $("#alert").load("alert.html", () => showAlert('', "No users selected."));
            return;
        }

        var ids = [];
        $("#fetchedData p.marked").each(function() {
            ids.push(Number($(this).attr("data-DBid")));
        });

        $(this).addClass('loading');

        customFetch({sendQrViaEmails: ids})
        .then(response => response.json())  //should be json response
        .then(data => {
            // console.log("from server: " )
            // console.log(data)
            if (data.hasOwnProperty('validEmails')) {
              //  console.log("valid emails: ");
                const records = [];
                Object.entries(data.validEmails).map((r) => {
                        records.push(r[1][0] + " " + r[1][4] + "<br>");
                });
                //showAlert("ok", records)
                $("#alert").load("alert.html", () => showAlert('ok', null, null, records));

            } else if (data.hasOwnProperty('invalidEmails')) {
               // console.log("invalid emails: ");
                const records = [];
                Object.entries(data.invalidEmails).map((r) => {
                    records.push(r[1][0] + ", ");
                });
                //showAlert("err", records)
                $("#alert").load("alert.html", () => showAlert('err', null, null, records));
            }
        })
        .then(() => {
            $(this).removeClass('loading');
        })
        .catch(() => {
            $("#alert").load(
                "alert.html",
                () => showAlert(
                    "Ops!",
                    "That's a serious error (SDBFQRS). <br> Please contact the administrator.",
                    ['fontColorRed', 'fontColor2'],
                    null,
            ));
        });
    });
    
    $('#databaseButtonBar #DBforQRsend').click(function() {
        closeDBforQRsend();
        window.location.reload();
    });

    $('#fetchedData p').removeClass('marked');
    if($('#fetchedData p.marked').length === 0) {
        $('#editDB').addClass('disabled');
        $('#editDB').prop("disabled", true);
    };

    var database = localStorage.getItem("Database");
    if (databaseCorrectnessCheck(database)) {
        database = JSON.parse(database);
        displayFetchedDataIn(database, "#database #fetchedData");
      } else {
        console.log("Data from localSotage is not an array of objects");
      }
      
      $("#fetchedData").off('click', 'p').on(
        'click',
        'p',
        function() {$(this).toggleClass('marked');});
};

export function closeDBforQRsend() {
        $('#database #fetchedData').html("");
        $('#database').css('display', 'none');
        $('#selectAll').remove();
        $('#SendQRs').remove();
}
