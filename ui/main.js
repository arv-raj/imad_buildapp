var button = document.getElementById("counter");

button.onclick = function () {

    //Create a request
    var request = new XMLHttpRequest

    //Capture the response from the page
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            // Take Action
            if (request.status === 200) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
    };

    //Make a request
    request.open('GET', 'http://localhost:8080/counter', true);
    request.send(null);
};

//Submit Birds
var submit = document.getElementById('submit_btn');
submit.onclick = function () {
    
    //Create a request
    var request = new XMLHttpRequest

    //Capture the response from the page
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            // Take Action
            if (request.status === 200) {
                //Capture list of Birds and reder it as list
                var birds = request.responseText;
                birds = JSON.parse(birds);
                var list = '';
                for (var i=0; i<birds.length; i++){
                    list += '<li>' + birds[i] + '</li>';
                }  
                var ul = document.getElementById('birdlist');
                ul.innerHTML = list;
            }
        }
    };

    //Make a request
    var birdInput = document.getElementById('bird');
    var bird = birdInput.value;
    request.open('GET', 'http://localhost:8080/submit-bird?bird=' + bird, true);
    request.send(null);
};

// Old Codes Below

/*console.log('Loaded!');

var element = document.getElementById("main-text");

element.innerHTML = 'New value';

var img = document.getElementById("madi");

var marginLeft = 0;

function moveRight () {
    marginLeft = marginLeft + 5;
    img.style.marginLeft = marginLeft + 'px';
};

img.onclick = function() {
    var interval = setInterval(moveRight, 50);
    //img.style.marginLeft = "100px";
};*/
