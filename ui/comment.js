var submitreq = document.getElementById('subcomment');
submitreq.onclick = function () {

    //Create a request
    var request = new XMLHttpRequest

    //Capture the response from the page
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            // Take Action
            if (request.status === 200) {
                //Capture list of Comments and render it as list
                var commentList = request.responseText;
                commentList = JSON.parse(commentList);
                var list = '';
                for (var i=0; i<commentList.length; i++){
                    list += '<li>' + commentList[i] + '</li>';
                }  
                var ul = document.getElementById('commentlist');
                ul.innerHTML = list;
            }
        }
    };

    //Make a request
    var commentInput = document.getElementById('comment');
    var comment = commentInput.value;
    request.open('GET', 'http://localhost:8080/:articleName/comment?comment=' + comment, true);
    request.send(null);
};

