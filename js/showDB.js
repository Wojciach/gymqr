import createButton from './createButton.js';
import { showAddRecordScreen, closeDbRecord, saveNewRecord, deleteRecord } from "./addDbRecord.js";
import displayFetchedDataIn from './displayFetchedDataIn.js';
import { emailValidation } from './emailVaidation.js';
import withConfirmation from './withConfirmation.js';
import sortBy from './sortBy.js';
import databaseCorrectnessCheck from './databaseCorrectnessCheck.js';

export function showDB() {

  //  console.log("showDB");
    $("#sortingButtonBar button").removeClass("marked");
    $('#databaseButtonBar').empty();
    var btn1 = createButton("editDB", "Edit");
    var btn2 = createButton("addDbRecord", "Add");
    var btn3 = createButton("closeDB", "Close");

    $('#databaseButtonBar').prepend(btn1, btn2, btn3);
    $("#sortingButtonBar button").click((event) => sortBy($("#database #fetchedData p"), event));

    $("#editDB").click(() => {
        const markedUser = $('#fetchedData p.marked').attr('data-dbid');
        showAddRecordScreen(markedUser);
        $("#deleteUser").show();
        $("#saveChanges").show();
        $("#saveNewRecord").hide();
      });
    
    $("#addDbRecord").click(() => {
        showAddRecordScreen();
        $("#deleteUser").hide();
        $("#saveChanges").hide();
        $("#saveNewRecord").show();
    });

    $('#closeDB').click(() => {
      closeDB();
      window.location.href = "index.html";
    });
    
    $('#databaseButtonBar #sendQRs').click(function() {
        $("#fetchedData p.marked").each(function() {
           // console.log($(this).attr("data-DBid"));
        });
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

    $("#fetchedData").off('click', 'p').on('click', 'p', function() {
        $('#fetchedData p').removeClass('marked');
        $(this).addClass('marked');
        $('#editDB').removeClass('disabled');
        $('#editDB').prop("disabled", false);
    });

    //database conrols (fisrst screen - after clickinig on Show)
  $("#close").click(closeDbRecord);

  $("#saveNewRecord").off('click').click(() => {
      if (!emailValidation($('#email').val())) return;
      saveNewRecord();
    });

  $("#deleteUser").click(() => {
    console.log("deleteUser clicked");
      withConfirmation(
        deleteRecord,
        {
          id: $("#DBid").data('DBid'),
          name: $("#name").val(),
          surname: $("#surname").val()
        },
        'Are you sure you want to delete this record?'
      );
    });

  $("#saveChanges").click(() => {
    if (!emailValidation($('#email').val())) return;
    withConfirmation(
      saveNewRecord,
      {
        id: $("#DBid").data('DBid'),
        name: $("#name").val(),
        surname: $("#surname").val()
      },
      'Are you sure you want to save changes to: '
    );
  })
};

export function closeDB() {
        $('#database #fetchedData').html("");
        $('#database').css('display', 'none');
        $('#databaseButtonBar').empty();
}
