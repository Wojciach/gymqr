import createButton from './createButton.js';
import { showAddRecordScreen, closeDbRecord, saveNewRecord, deleteRecord } from "./addDbRecord.js";
import displayFetchedDataIn from './displayFetchedDataIn.js';
import { emailValidation } from './emailVaidation.js';
import withConfirmation from './withConfirmation.js';
import sortBy from './sortBy.js';
import databaseCorrectnessCheck from './databaseCorrectnessCheck.js';

export function showDB(editUser = null) {

  //  console.log("showDB");
    $("#sortingButtonBar button").removeClass("marked");
    $('#databaseButtonBar').empty();
    var btn1 = createButton("editDB", "Edit");
    var btn2 = createButton("addDbRecord", "Add");
    var btn3 = createButton("closeDB", "Close");

    $('#databaseButtonBar').prepend(btn1, btn2, btn3);
    $("#sortingButtonBar button").off('click').click((event) => sortBy($("#database #fetchedData p"), event));

    $("#editDB").off('click').click(() => {
        const markedUser = $('#fetchedData p.marked').attr('data-dbid');
        showAddRecordScreen(markedUser);
        $("#deleteUser").show();
        $("#saveChanges").show();
        $("#saveNewRecord").hide();
      });
    
    $("#addDbRecord").off('click').click(() => {
        showAddRecordScreen();
        $("#deleteUser").hide();
        $("#saveChanges").hide();
        $("#saveNewRecord").show();
    });

    $('#closeDB').off('click').click(() => {
      closeDB();
      window.location.href = "index.html";
    });
    
    $('#databaseButtonBar #sendQRs').off('click').click(function() {
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
  $("#close").off('click').click(closeDbRecord);

  $("#saveNewRecord").off('click').click(() => {
      if (!emailValidation($('#email').val())) return;
      saveNewRecord();
    });

  $("#deleteUser").off('click').click(() => {

    const userId = $("#DBid").data('DBid');
    const userName = $("#name").val();
    const userSurname = $("#surname").val();
    
      withConfirmation(
          () => { deleteRecord(userId) },
          `${userName} ${userSurname} (id: ${userId} )`,
          'Are you sure you want to delete this record?'
      );
    });

  $("#saveChanges").off('click').click(() => {
    if (!emailValidation($('#email').val())) return;
    withConfirmation(
      ()=>saveNewRecord($("#DBid").data('DBid')),
      `${$("#name").val()} ${$("#surname").val()} (id: ${$("#DBid").data('DBid')})`,
      'Are you sure you want to save changes to: '
    );
  })

  if (editUser) {
    showAddRecordScreen(editUser);
    $("#deleteUser").show();
    $("#saveChanges").show();
    $("#saveNewRecord").hide();
  }

};

export function closeDB() {
        $('#database #fetchedData').html("");
        $('#database').css('display', 'none');
        $('#databaseButtonBar').empty();
}
