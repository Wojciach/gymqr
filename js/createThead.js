function createThead(...args) {
    let tableHeader = '<thead><tr>';
    for (let arg of args) {
        tableHeader += `<th>${arg}</th>`;
    }
    tableHeader += '</tr></thead>';
    return tableHeader;
}

export default createThead;