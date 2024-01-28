import databaseCorrectnessCheck from "./databaseCorrectnessCheck.js";
import {customFetch} from "./customFetch.js";
import { onlineIndicator } from "./onlineIndicator.js";
import { status } from "./js.js";

async function refreshDatabase(tableName, localStorageName) {

   // console.log("refreshDatabase");
    const fetchResult = await customFetch({ getAll: tableName })
    .then(response => response.text())
    .then((data) => {
       // console.log(data);
        if(data === "tokenError") {
            console.log("tokenError on refreshDatabase");
            window.location.href = 'login.html'; return;
        }
        //console.log(data);
        if (databaseCorrectnessCheck(data) === true) {
            localStorage.setItem(localStorageName, data);
            status.onLine = true;
            onlineIndicator(true)
           // console.log("switched to online mode");
            return data; 
        } else {
            status.onLine = false;
            onlineIndicator(false);
            return false;
          // console.log("switched to offline mode");
        }
    })
    return fetchResult;
}
 
export default refreshDatabase;
