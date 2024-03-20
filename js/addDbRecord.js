import { showDB } from "./showDB.js";
import { dataFromForm } from "./js.js";
import { customFetch } from "./customFetch.js";
import refreshDatabase from "./refreshDatabase.js";
import { showAlert } from "./showAlert.js";

export function showAddRecordScreen(DBid = null) {
    $('#DBid').text(DBid);
    $("#DBid").data(DBid);
    $('#addUser').css('display', 'flex');
    if(DBid) {
        fillFromWithStorageData(DBid);
    } else {
        clearTheForm();
        let today = new Date().toJSON().slice(0, 10);
        $("#paid-date").val(today);
    }
     
}

export function clearTheForm() {
    $("#name").val('');
    $("#surname").val('');
    $("#email").val('');
    $("#paid-date").val('');
    $("#paid-amount").val('');
}

export function fillFormWithServerData(DBid) {
    customFetch({requestForUserDetails: DBid})
    .then(response => response.json())
    .then(data => {
        $('#DBid').text("ID: " + data.id);
        $("#DBid").data("DBid", data.id);
        $('#name').val(data.name);
        $('#surname').val(data.surname);
        $('#email').val(data.email);
        $('#paid-date').val(data.paidDate);
        $('#paid-amount').val(data.paidAmount);
    })
    .catch(() => {
        $("#alert").load(
            "alert.html",
            () => showAlert(
                "Ops!",
                "That's a serious error (FFWSD). <br> Please contact the administrator.",
                ['fontColorRed', 'fontColor2'],
                null,
        ));
    });
}

export function fillFromWithStorageData(DBid = null) {
    if (!DBid) return;
    console.log('DBid from fillFromWithStorageData:');
    console.log(DBid);

    //console.log("fillFromWithStorageData: " + DBid);
    var Database = localStorage.getItem("Database");
    Database = JSON.parse(Database);
    var foundObject = Database.find(obj => obj.id === Number(DBid));

    $('#DBid').text("ID: " + foundObject.id);
    $("#DBid").data("DBid", foundObject.id);
    $('#name').val(foundObject.name);
    $('#surname').val(foundObject.surname);
    $('#email').val(foundObject.email);
    $('#paid-date').val(foundObject.paidDate);
    $('#paid-amount').val(foundObject.paidAmount);
}

export function saveNewRecord(id = null) {
    //if id is null then a new record is created otherwise record is edited
    dataFromForm.name = $('#name').val();
    dataFromForm.surname = $('#surname').val();
    dataFromForm.email = $('#email').val();
    dataFromForm.paidDate = $('#paid-date').val();
    dataFromForm.paidAmount = $('#paid-amount').val();
    dataFromForm.DBid = id;

    var key = id ? "editUser" : "addUser";
    console.log('id:');
    console.log(id);
    customFetch({[key]: dataFromForm})
    .then(() => {
        refreshDatabase('users', 'Database').then(() => {showDB();});
        $('#addUser').css('display', 'none');
    })
    .catch(() => {
        $("#alert").load(
            "alert.html",
            () => showAlert(
                "Ops!",
                "That's a serious error (add/edit). <br> Please contact the administrator.",
                ['fontColorRed', 'fontColor2'],
                null,
        ));
    });
}

export function deleteRecord(DBid) {
    console.log("deleteRecord: " + DBid);
    customFetch({deleteUser: DBid})
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .then(() => {
        refreshDatabase('users', 'Database').then(showDB);
        $('#addUser').css('display', 'none');
    })
    .catch(() => {
        $("#alert").load(
            "alert.html",
            () => showAlert(
                "Ops!",
                "That's a serious error (delete). <br> Please contact the administrator.",
                ['fontColorRed', 'fontColor2'],
                null,
        ));
    });
}

export function closeDbRecord() {
    $('#addUser').css('display', 'none');
}
