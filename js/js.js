import  refreshDatabase  from "./refreshDatabase.js";
import { scanCode, stopScanning, swapCamera} from "./scanCode.js";
import { showDB, closeDB } from "./showDB.js";
import  formatInputNumber  from "./formatInputNumber.js";
import { showDBforQRsend } from "./showDBforQRsend.js";
import databaseCorrectnessCheck from "./databaseCorrectnessCheck.js";
import showDB_version from "./showDB_version.js";
import { showAlert } from "./showAlert.js";
import withConfirmation from "./withConfirmation.js";
import { showAddRecordScreen } from "./addDbRecord.js";
import { customFetch } from "./customFetch.js";

export const status = {
  onLine: false,
  databaseCorrectness: false,
  emptyDatabase: true
};

export var dataFromForm = {
  name: "",
  surname: "",
  email: "",
  paidDate: null,
  paidAmount: null,
  DBid: null
};

Promise.all([
  refreshDatabase('users', 'Database'),
  refreshDatabase('scans', 'allScansFromServer')
]).then(() => {showVersion();});

//this function check if there is a redirect parameter in the URL to go straight to editinng user in case this page is oppened as redirec from payment status page
$(document).ready(function() {
  var urlParams = new URLSearchParams(window.location.search);
  var redirect = urlParams.get('redirect');
  if (redirect) {
    //simulating clicking on Eddit/Add button
    $("#showDB").trigger("click", { extraData: redirect });
  }
});

function showVersion() {
    const admin = localStorage.getItem('admin') || "%$* Incorrect Admin Name *%";
    const newAdmin = admin.replace(/[^\w\s]/gi, '');
    if (admin === newAdmin) {
      $("#adminName")
        .text(admin)
        .removeClass('fontColorRed');
    } else {
      $("#adminName")
        .text("error")
        .addClass('fontColorRed');
    }
  
    const Database = localStorage.getItem('Database');

    if (databaseCorrectnessCheck(Database)) {
      $("#DB_Version")
        .text(showDB_version(Database, "timeStamp"))
        .removeClass('fontColorRed');
    } else {
      $("#DB_Version")
        .text("incorrect database")
        .addClass('fontColorRed');
    }
    var allScans = localStorage.getItem('allScansFromServer');
  
    if (databaseCorrectnessCheck(allScans)) {
          $("#scanDB_Version")
            .text(showDB_version(allScans, "scanTime"))
            .removeClass('fontColorRed');
    } else {
      $("#scanDB_Version")
        .text("incorrect database")
        .addClass('fontColorRed');
    }
}


$("#showDB").click(async function(event, data) {
  console.log(`data from showDB: ${data?.extraData}`)
  $(this).addClass('loading');
  await refreshDatabase('users', 'Database');
  $(this).removeClass('loading');

  if (status.onLine === true) {
    $('#database').load("database.html",  ()=>{showDB(data?.extraData)})
  } else {
    $("#alert").load("alert.html", () => showAlert("You need to be online to edit database."));
  }})

$("#showDBforQRsend").click(async function() {

  $(this).addClass('loading');
  await refreshDatabase('users', 'Database');
  $(this).removeClass('loading');

  if (status.onLine === true) {
    $('#database').load("database.html", showDBforQRsend)
  } else {
    $("#alert").load("alert.html", () => showAlert("You need to be online to send QR codes to users."));
  }
});

$("#scanQR").click(async function() {

  $(this).addClass('loading');
  await refreshDatabase('users', 'Database');
  $(this).removeClass('loading');

  if (status.onLine === true) {
    window.location.href = 'scanner.html';
  } else {
    $("#alert").load("alert.html", () => withConfirmation(
      () => {window.location.href = 'scanner.html';},
      null,
      "Do you want to scan QR codes in offline mode?"
    ));
  }
});

$("#refreshDB").click(() => {
  window.location.reload();
});

$("#reports").click(async function() {

  $(this).addClass('loading');
  await refreshDatabase('users', 'Database');
  await refreshDatabase('scans', 'allScansFromServer');
  $(this).removeClass('loading');

  if (status.onLine === true) {
    window.location.href = 'reports.html';
  } else {
    $("#alert").load("alert.html", () => showAlert("You need to be online to the see repots."));
  }
});

$(document).on('click', '#confirmDialog #confirmNo', function() {
 // console.log("confirmNo clicked");
  $("#confirmDialog").hide();
});

$("#swapCamera").click(function() {
  swapCamera();
});

$("#stop").click(function() {
  stopScanning();
  $("#videoPreview").slideUp();
  $("#buttons").css("display", "flex");
});

$("#paid-amount").on('change', formatInputNumber);

$(document).ready(function() {
  if(localStorage.getItem('layout') === "bright") {
    $("#settings").removeClass("dark");
  } else {
    $("#settings").addClass("dark");
  }
});

$("#settings").click(function() {
  if(localStorage.getItem('layout') === "bright") { 
    localStorage.setItem('layout', 'dark');
    $("#settings").addClass("dark");
  } else {
    localStorage.setItem('layout', 'bright');
    $("#settings").removeClass("dark");
  }
  
  window.location.reload();
});

$("#logout").click(logout);

$('#deleteAdmin').click(function() {
  $("#confirmDialog").load(
    "confirmDialog.html?_=" + Math.random(),
    () => withConfirmation(
        () => {
          console.log("removing admin");
          customFetch({deleteThisAdmin: localStorage.getItem('admin')})
            .then(response => response.text())
            .then(data => {
              if(data === "ok") {
                logout();
              } else {
                throw new Error("errorek");
              }
            })
            .catch((e) => {
              console.log(`errorendo: ` + e.message);
            });
        },
        `(((removeing all data of ${localStorage.getItem('admin')})))`,
        "Do you want to remove this account? <br> This action is irreversible and will remove all data regarding this user. ",
        "WARNING!"
     
  ));
});
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('Database');
  localStorage.removeItem('allScansFromServer');
  localStorage.removeItem('admin');
  localStorage.removeItem('layout');
  localStorage.removeItem('scannedUsers');

  window.location.href = 'login.html';
}