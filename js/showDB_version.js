import {status} from "./js.js";

function showDB_version(databaseString) {
    
   // console.log("databaseString: " + typeof databaseString);
    var data = JSON.parse(databaseString);
    if (data.length === 0) {
        status.emptyDatabase = true;
        return "Database empty";
    }
    //findind the newest record in the database and using its  timestamp value as version of the database
    let highestTimestamp = data.reduce(
        (max, item) => item.timeStamp > max ? item.timeStamp : max, data[0].timeStamp
    );
    status.emptyDatabase = false;
    return highestTimestamp;
}

export default showDB_version;