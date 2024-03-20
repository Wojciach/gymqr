import sortBy from "./sortBy.js";
import getNewestTimestamps from "./getNewestTimestamps.js";
import createThead from "./createThead.js";
import createTbody from "./createTbody.js";
import attendanceReport from "./attendanceReport.js";
import findOldestNewestScanTime from "./findOldestNewestScanTime.js";
import sendReminder from "./sendReminder.js";
import withConfirmation from "./withConfirmation.js";
//import refreshDatabase from "./refreshDatabase.js";

export var selectedDate = {
     startDate: '2020-01-01',
     endDate: '2030-12-31'
};

$("#goBackToIndex").click(function() {
     window.location.href = 'index.html'; 
});
    
$("#paymentStatus").click(function() {

     $('#myChart').hide();
     $('#attendanceReportsBarButton').hide(); 
     $('#tableManipulationBar').hide();
     $('#counter').hide();

     var data = localStorage.getItem("allScansFromServer");

     const tableHeader = createThead(
          "ID",
          "Name",
          "Surname",
          "Paid Amount",
          "Paid Date",
          "Days <br> Since <br> Paid",
          "Last Scan"
     );
     
     const tableBody = createTbody(
          JSON.parse(localStorage.getItem("Database")),
          getNewestTimestamps(JSON.parse(data))
     );          

     $("#reportTable").html(tableHeader);
     $("#reportTable").append(tableBody);

     $("#reportTable thead th").click((event) => sortBy($("#reportTable tbody tr"), event));

     //.edit button payent table
     $("#reportTable tbody td.edit").click(function() {
          let id = $(this).siblings().first().text();
          window.location.href = `index.html?redirect=${id}`; //redirect
     });

     $("#reportTable td:nth-child(6)").each(function() {
          if (Number($(this).text()) > 30) {
               $(this).css("color", "red");
          }
          if (Number($(this).text()) < 0) {
               $(this).css("color", "blue");
          }
     });

     $("#reportTable tbody tr").each(function() {
          // Parse the dates in the first and second columns
          var date1 = new Date($(this).find('td:nth-child(5)').text());
          var date2 = new Date($(this).find('td:nth-child(7)').text().slice(0,10));

          if (isNaN(date2.getTime())) {
               return;
          } else {
               // Calculate the difference in days
               var diffDays = Math.ceil(Math.abs(date2 - date1)) / (1000 * 60 * 60 * 24);
               // If the difference is 30 days or more, add the class to the cell in the second column
               if (diffDays >= 30) {
                    $(this).find('td:nth-child(7)').css("color", "red");
               }
               // console.log("diffDays: " + diffDays);
          }
     });
     $('.remind').click(function() {
          // console.log("remind");
          // sendReminder($(this).siblings(':first').text());
          const userId = $(this).siblings(':first').text();
          const userName = $(this).siblings(':nth(1)').text();
          const userSurname = $(this).siblings(':nth(2)').text();
          //console.log(userId);
          $("#confirmDialog").load(
               "confirmDialog.html?random=" + Math.random(),
               () => { withConfirmation(
                         ()=>sendReminder(userId),
                         `${userName} ${userSurname} (id: ${userId} )`,
                         'Do you want to sned reminder email to this user?'
               )}
          );
     })
});

$("#attendanceReport").click(function() {
     $('#attendanceReportsBarButton').css("display", "flex");
     $('#tableManipulationBar').css("display", "flex");
     $('#counter').css("display", "block");

     const data = localStorage.getItem("allScansFromServer");
     if(data) {
          var oldNewScanTime = findOldestNewestScanTime(JSON.parse(data));

          let startPeriod = new Date(oldNewScanTime.oldestScanTime);
          startPeriod.setDate(startPeriod.getDate() - 1);
          $('#dateFrom').val(startPeriod.toISOString().slice(0,10));

          let endPeriod = new Date(oldNewScanTime.newestScanTime);
          endPeriod.setDate(endPeriod.getDate() + 1);
          $('#dateTo').val(endPeriod.toISOString().slice(0,10));

     } else {
          $('#dateFrom').val(selectedDate.startDate);
          $('#dateTo').val(selectedDate.endDate);
     }

     attendanceReport();
     $('#selectMember').html(`
          <option value="allScans" selected>All Scans</option>
          <option value="onlyCurrentMembers">Only Current Members</option>
     `);
     var users = JSON.parse(localStorage.getItem("Database"));
     users.forEach(user => {
          $('#selectMember').append(`<option value="${user.id}">${user.id}. ${user.name} ${user.surname}</option>`);
     });
});

$('#attendanceReportsBarButton input, #attendanceReportsBarButton select').change(function() {
     selectedDate.startDate = $("#dateFrom").val();
     selectedDate.endDate = $("#dateTo").val();
     //console.log("selectedDate");
     attendanceReport();
});
