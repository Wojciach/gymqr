import databaseCorrectnessCheck from "../databaseCorrectnessCheck.js";

export class DatabaseManager {
    constructor(users, scans) {
        if(!databaseCorrectnessCheck(users)) {
            throw new Error("Problem with users database");
        } else {
            this.users = JSON.parse(users);
        
        }
        if(!databaseCorrectnessCheck(scans)) {
            throw new Error("Problem with scans database");
        } else {
            this.scans = JSON.parse(scans);
        }
    }

    filterOutBeforeScans(date) {
        this.scans = this.scans.filter(scan => {
            const scanDate = new Date(scan.scanTime);
            const scanDateUTC = new Date(scanDate.toISOString());
            const filterDate = new Date(date);
            const filterDateUTC = new Date(filterDate.toISOString());
            return scanDateUTC >= filterDateUTC;
        });
    }

    filterOutAfterScans(date) {
        this.scans = this.scans.filter(scan => {
            const scanDate = new Date(scan.scanTime);
            const scanDateUTC = new Date(scanDate.toISOString());
            const filterDate = new Date(date);
            const filterDateUTC = new Date(filterDate.toISOString());
            return scanDateUTC <= filterDateUTC;
        });

    }

    filterOutUsersExept(userIdsToInclude) {
       this.scans = this.scans.filter(scan => {
            return userIdsToInclude.includes(scan.user_ID);
        });
    }

    getOnlyCurrentMembersArr() {
        return this.users.map(user => user.id);
    }

    getScans() {
        return this.scans;
    }

    getScansByDayAndHour() {
        var scansByDayAndHour = Array(7).fill().map(() => Array(24).fill().map(() => []));
        // Group the scans by day and hour
                this.scans.forEach(scan => {
                const scanDate = new Date(scan.scanTime);
                const dayOfWeek = (scanDate.getDay() + 6) % 7; //adjusting to start from Monday
                const hourOfDay = scanDate.getHours();
                scansByDayAndHour[dayOfWeek][hourOfDay].push(scan);
        });
        return scansByDayAndHour;
    }

    getHighestValueFromCells() {
        let scansByDayAndHour = this.getScansByDayAndHour();
        let maxScans = 0;
        for (let day = 0; day < scansByDayAndHour.length; day++) {
             for (let hour = 0; hour < scansByDayAndHour[day].length; hour++) {
                  const scansSearch = scansByDayAndHour[day][hour].length;
                  if (scansSearch > maxScans) {
                       maxScans = scansSearch;
                  }
             }
        }
        return maxScans;
    }
}