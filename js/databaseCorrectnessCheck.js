function databaseCorrectnessCheck(databaseString) {

    try {
        var database = JSON.parse(databaseString);
    } catch (e) {
        return false;
    }

    if (Array.isArray(database) && database.every(item => typeof item === 'object')) {
        return true;
    } else {
        return false;
    }
}

export default databaseCorrectnessCheck;