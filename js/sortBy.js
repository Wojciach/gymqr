function sortBy(whatToSort, event) {

    if($(event.target).hasClass('marked')) {
        let reversedTr = whatToSort.toArray().reverse();
        whatToSort.parent().html(reversedTr);
        return;
    }

    $(event.target).siblings().removeClass("marked");
    $(event.target).addClass("marked");

    var index = $(event.target).index() + 1;
    console.log(index);

    var alphabeticallyOrderedTr = whatToSort.sort(function (a, b) {
        
        console.log("SORTING");
        var aText = $(a).find(`:nth-child(${index})`).text();
        var bText = $(b).find(`:nth-child(${index})`).text();

        if (isFloat(aText) && isFloat(bText)) {
            var aNum = parseFloat(aText);
            var bNum = parseFloat(bText);
            return aNum - bNum;
        } else {
            return aText.localeCompare(bText);
        }
    });

    whatToSort.parent().html(alphabeticallyOrderedTr);
}

// console.log("sortBy loaded");

function isFloat(val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
}

export default sortBy;