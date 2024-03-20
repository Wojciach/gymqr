export class TableBuilder {

        constructor(theTable, scansByDayAndHour) {
            this.table = theTable;
            this.scansByDayAndHour = scansByDayAndHour;
            this.table.innerHTML = '';
            this.createHeaderRow();
            this.createTableBody();
        }

        createHeaderRow() {
            const headerRow = document.createElement('tr');
            ['Hour', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
                const th = document.createElement('th');
                th.textContent = day;
                headerRow.appendChild(th);
            });
            this.table.appendChild(headerRow);
        }

        createTableBody() {
            for (let hour = 0; hour < 24; hour++) {
                // Only create a row if there are scans for this hour
                if (this.scansByDayAndHour.some(dayScans => dayScans[hour].length > 0)) {
                    const row = document.createElement('tr');

                    // First cell is the hour so it have added zeros to look like time format
                    const hourCell = document.createElement('td');
                    hourCell.textContent = hour + ':00';
                    row.appendChild(hourCell);

                    // Next cells are the counts for each day
                    for (let day = 0; day < 7; day++) {
                        const cell = document.createElement('td');
                        cell.classList.add('dataCell');
                        cell.textContent = this.scansByDayAndHour[day][hour].length;
                        row.appendChild(cell);
                    }
                    this.table.appendChild(row);
                }
            }
        }

        adjustVisualIndicators(maxScans) {
            //setting a size of visual indicator that shows how many scans are in cell
            $(".dataCell").each(function() {
                const div = document.createElement('div');
                const content = Number($(this).text());
                $(this).append(div);
                div.style.width = (content / maxScans) * 100 + '%';
                div.style.height = (content / maxScans) * 100 + '%';
            });
        }

        hideZeros(bool) {
            let opacity = bool ? "0" : "1";
            $(".dataCell").each(function() {
                 if (Number($(this).text()) === 0) {
                      $(this).css("opacity", opacity);
                 }
            });
        }

        showVisualIndicators(bool) {
            let opacity = bool ? "1" : "0";
            $(".dataCell div").css('opacity', opacity); 
        }
}