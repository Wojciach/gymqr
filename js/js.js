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
import findOldestNewestScanTime from "./findOldestNewestScanTime.js";

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

$(document).ready(function() {
  var urlParams = new URLSearchParams(window.location.search);
  var redirect = urlParams.get('redirect');
 // console.log("redirect: " + redirect);
  if (redirect) {
   // console.log(typeof redirect);
   // console.log(redirect);
    
      $("#showDB").click();

    setTimeout(() => {
      showAddRecordScreen(redirect);
      $("#deleteUser").show();
      $("#saveChanges").show();
      $("#saveNewRecord").hide();
    }, 200);
  }
});

function showVersion() {
    const admin = localStorage.getItem('admin') || "%$*";
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
        .text(showDB_version(Database))
        .removeClass('fontColorRed');
    } else {
      $("#DB_Version")
        .text("incorrect database")
        .addClass('fontColorRed');
    }
    var allScans = localStorage.getItem('allScansFromServer');
  
    if (databaseCorrectnessCheck(allScans) && JSON.parse(allScans).length === 0) {
          $("#scanDB_Version").text("Database empty").addClass('fontColorRed');
    }else if (JSON.parse(allScans).length > 0) {
      $("#scanDB_Version")
        .text(findOldestNewestScanTime(JSON.parse(allScans)).newestScanTime)
        .removeClass('fontColorRed');
    } else {
      $("#scanDB_Version")
        .text("incorrect database")
        .addClass('fontColorRed');
    }
}


$("#showDB").click(async function() {

  $(this).addClass('loading');
  await refreshDatabase('users', 'Database');
  $(this).removeClass('loading');

  if (status.onLine === true) {
    $('#database').load("database.html", showDB)
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

$("#logout").click(function() {

  localStorage.removeItem('token');
  localStorage.removeItem('Database');
  localStorage.removeItem('allScansFromServer');
  localStorage.removeItem('admin');
  localStorage.removeItem('layout');
  localStorage.removeItem('scannedUsers');

  window.location.href = 'login.html';
});