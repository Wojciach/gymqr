import {infoData} from './infoData.js';

function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

var handleScroll = debounce(function() {
    var element = document.getElementById('scrollUp');
    var position = window.scrollY;
    console.log(position);
    if (position > 160) {
        element.classList.add('show');
    } else {
        element.classList.remove('show');
    }
}, 250); // 250ms delay

window.addEventListener('scroll', handleScroll);

document.getElementById('scrollUp').addEventListener('click', scrollUp);

function scrollUp() {
    window.scrollTo(0, 0);
}


function articleTemplate(data) {
    const list = data.descriptionList.map(listTemplate).join('\n');
    return `
        <article id="${data.id}">
            <div>
                <h2>${data.title}</h2>
                <img src="${data.imageSrc}"/>
                <h3>${data.mainDescription}</h3>
                <ul>${list}</ul>
            </div>
        </article>
    `;
}

function listTemplate(data2) {
    return `
        <li>
            ${data2}
        </li>
    `;
}


let articles = infoData.map(articleTemplate).join('\n');

document.getElementById('section').innerHTML += articles;

