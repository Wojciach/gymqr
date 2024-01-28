function createButton(id, text, callback = null) {
    var button = document.createElement("button");
    button.id = id;
    button.innerHTML = text;
    return button;
}

export default createButton;