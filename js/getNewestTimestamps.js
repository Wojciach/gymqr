function getNewestTimestamps(array) {
   // console.log(array);
    return array.reduce((acc, obj) => {
        if (!acc[obj.user_ID] || new Date(acc[obj.user_ID]) < new Date(obj.scanTime)) {
            acc[obj.user_ID] = obj.scanTime;
        }
        return acc;
    }, {});
}

export default getNewestTimestamps;