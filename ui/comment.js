var currentArticleTitle = window.location.pathname.split('/')[2];

function loadLogin () {
    var request = new XMLHttpRequest;
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadCommentForm(this.responseText);
            }
        }
    };

    request.open('GET', '/check-login', true);
    request.send(null);
};

loadLogin();

