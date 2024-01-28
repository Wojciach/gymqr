function findOldestNewestScanTime(data) {
   // console.log("OLD-NEW");
    let newestScanTime = data.reduce(
        (max, item) => item.scanTime > max ? item.scanTime : max, data[0].scanTime
    );

    let oldestScanTime = data.reduce(
        (min, item) => item.scanTime < min ? item.scanTime : min, data[0].scanTime
    );

    return { newestScanTime, oldestScanTime };
}

export default findOldestNewestScanTime;