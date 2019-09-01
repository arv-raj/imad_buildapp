//Load Login Form
function loadLoginForm () {
    var loginHtml = `
        <h3>Login, To Irritate me</h3>
        <input type="text" id="username" placeholder="username"></input>
        <input type="password"" id="password"></input>
        <br/><br/>
        <input type="submit" id="submit_login" value="Login"></input>
        <input type="submit" id="submit_register" value="Register"></input>
        `;
        document.getElementById('login_area').innerHTML = loginHtml;

    //Submit Login (username/password)
    var submit = document.getElementById('submit_login');
    submit.onclick = function () {
        
        //Create a request
        var request = new XMLHttpRequest

        //Capture the response from the page
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                // Take Action
                if (request.status === 200) {
                    submit.value = 'User logged in';
                } else if (request.status === 403) {
                    submit.value = 'Credentials Incorrect';
                } else if (request.status === 500) {
                    alert("User not found");
                    submit.value = 'Login';
                }
                loadLogin();
            }
        };

        //Make a request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', 'http://localhost:8080/login', true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({username: username, password: password}));
        submit.value = 'Logging in ...';
    };

    var register = document.getElementById('submit_register');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    
    };
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
            <h3> Hi <i>${username}</i></h3>
            <a href='/logout'>Logout</a>
        `
}

function loadLogin () {
    var request = new XMLHttpRequest;
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };

    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadArticles() {
    var request = new XMLHttpRequest

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('article_area');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i<articleData.length; i++) {
                    content += `<li>
                        <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                        ${articleData[i].date.split('T')[0]}</li>`;
                }
                content += '</ul>';
                articles.innerHTML = content;
            } else {
                articles.innerHTML("No articles to show :D");
            }
        }
    };

    request.open('GET', '/get-articles', true);
    request.send(null);
}

loadLogin();

loadArticles();

// Old Codes Below

/*var button = document.getElementById("counter");

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
};*/

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
