import attendanceChart from './attendanceChart.js';
import { selectedDate } from './reports.js';
import { DatabaseManager } from './Classes/DatabaseManager.js';
import { TableBuilder } from './Classes/TableBuilder.js';

function attendanceReport() {

     const databaseManager = new DatabaseManager(
          localStorage.getItem("Database"),
          localStorage.getItem("allScansFromServer"),
     );
     databaseManager.filterOutBeforeScans(selectedDate.startDate);
     databaseManager.filterOutAfterScans(selectedDate.endDate);

     const selectedUser = $('#selectMember').val();

     if(selectedUser === 'onlyCurrentMembers') {
          let included = databaseManager.getOnlyCurrentMembersArr();
          databaseManager.filterOutUsersExept(included);
     } 

     if(selectedUser !== 'allScans' && selectedUser !== 'onlyCurrentMembers') {
          let included = [Number(selectedUser)];
          databaseManager.filterOutUsersExept(included);
     }

     var scansByDayAndHour = databaseManager.getScansByDayAndHour();
     let count = databaseManager.getScans().length;
     $("#counter").text(count);

     //goint throw all cels an getting maximum value of scans in cell to have reference for visual indicators that goinh to be generated in next step
     //geting maximum value of scans in cell to have reference for visual indicators
     // other way is to use Math.max.apply(null, scansByDayAndHour.map(day => Math.max.apply(null, day.map(hour => hour.length))));
     let maxScans = databaseManager.getHighestValueFromCells();

     const theTable = new TableBuilder(
               document.getElementById('reportTable'),
               scansByDayAndHour
     );
     
     theTable.adjustVisualIndicators(maxScans);
     theTable.hideZeros(true);
     attendanceChart(scansByDayAndHour);

     $('#tableManipulationBar input[type="checkbox"]').change(function() {
          if (this.value === 'hideZeros') {
               theTable.hideZeros(this.checked);
          }
          if (this.value === 'showVisualIndicators') {
          theTable.showVisualIndicators(this.checked);
          }
     });
}

export default attendanceReport;
