import attendanceChart from './attendanceChart.js';
import {customFetch} from './customFetch.js';
import {selectedDate} from './reports.js';

function attendanceReport() {

     const data = localStorage.getItem("allScansFromServer");
     const scans = JSON.parse(data);

     // Initialize an array to hold the scans grouped by day and hour
     var scansByDayAndHour = [];
     for (let i = 0; i < 7; i++) {
          scansByDayAndHour[i] = [];
          for (let j = 0; j < 24; j++) {
               scansByDayAndHour[i][j] = [];
          }
     }

     // Group the scans by day and hour
     scans.forEach(scan => {
     const scanDate = new Date(scan.scanTime);
     const dayOfWeek = scanDate.getDay();
     const hourOfDay = scanDate.getHours();
     scansByDayAndHour[dayOfWeek][hourOfDay].push(scan);
     });

     // Define the user_ID or user_IDs you want to filter by
     var userIdsToInclude = scans.map(scan => scan.user_ID);
     if ($('#selectMember').val() !== 'allMembers') {
               userIdsToInclude = [Number($('#selectMember').val())];
     }

     const startDate = new Date(selectedDate.startDate);
     const startDateUTC = new Date(startDate.toISOString());
     const endDate = new Date(selectedDate.endDate);
     const endDateUTC = new Date(endDate.toISOString());

     // Filter scansByDayAndHour
     console.log(scansByDayAndHour);
     scansByDayAndHour = scansByDayAndHour.map(dayScans => 
          dayScans.map(hourScans => 
               hourScans.filter(scan => {
                    const scanDate = new Date(scan.scanTime);
                    const scanDateUTC = new Date(scanDate.toISOString());
                    return userIdsToInclude.includes(scan.user_ID) &&
                    scanDateUTC >= startDateUTC &&
                    scanDateUTC <= endDateUTC
               })
          )
     );

     function countScans(scansByDayAndHour) {
          return scansByDayAndHour.reduce((total, dayScans) => 
               total + dayScans.reduce((dayTotal, hourScans) => 
                    dayTotal + hourScans.length, 0), 0);
     }
     let count = countScans(scansByDayAndHour);
     $("#counter").text(count);

     //geting max value from array
     let maxScans = 0;
     for (let day = 0; day < scansByDayAndHour.length; day++) {
          for (let hour = 0; hour < scansByDayAndHour[day].length; hour++) {
               const scansSearch = scansByDayAndHour[day][hour].length;
               if (scansSearch > maxScans) {
                    maxScans = scansSearch;
               }
          }
     }

     // asign the table
     const table = document.getElementById('reportTable');
     table.innerHTML = '';

     // Create a header row
     const headerRow = document.createElement('tr');
     ['Hour', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
          const th = document.createElement('th');
          th.textContent = day;
          headerRow.appendChild(th);
     });
     table.appendChild(headerRow);

     // Create a row for each hour
     for (let hour = 0; hour < 24; hour++) {
          // Only create a row if there are scans for this hour
          if (scansByDayAndHour.some(dayScans => dayScans[hour].length > 0)) {
               const row = document.createElement('tr');

               // First cell is the hour
               const hourCell = document.createElement('td');
               hourCell.textContent = hour + ':00';
               row.appendChild(hourCell);

               // Next cells are the counts for each day
               for (let day = 0; day < 7; day++) {
                    const cell = document.createElement('td');
                    cell.classList.add('dataCell');
                    cell.textContent = scansByDayAndHour[day][hour].length;
                    row.appendChild(cell);
               }
               table.appendChild(row);
          }
     }

     attendanceChart(scansByDayAndHour);
     hideZeros(true);
     
     $(".dataCell").each(function() {
          const div = document.createElement('div');
          const content = Number($(this).text());
          $(this).append(div);
          div.style.width = (content / maxScans) * 100 + '%';
          div.style.height = (content / maxScans) * 100 + '%';
     });
     
     function hideZeros(bool) {
          let opacity = bool ? "0" : "1";
          $(".dataCell").each(function() {
               if (Number($(this).text()) === 0) {
                    $(this).css("opacity", opacity);
               }
          });
     }

     function showVisualIndicators(bool) {
          let opacity = bool ? "1" : "0";
          $(".dataCell div").css('opacity', opacity); 
     }

     $('#tableManipulationBar input[type="checkbox"]').change(function() {
          if (this.value === 'hideZeros') {
               hideZeros(this.checked);
          }
          if (this.value === 'showVisualIndicators') {
          showVisualIndicators(this.checked);
          }
     });

}

export default attendanceReport;
