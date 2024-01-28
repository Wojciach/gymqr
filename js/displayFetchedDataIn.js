function displayFetchedDataIn(data, location) {
    var text = "";
    data.map((item) => {
        text += `<p data-DBid="${item.id}">
            <span class="id">${item.id}.</span>
            <span class="name"> ${item.name} </span>
            <span class="surname"> ${item.surname} </span>
         </p>`
    })
    $('#database').css('display', 'flex');
    $(location).html(text);
}

export default displayFetchedDataIn;