var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

/*var articles = {
	'article-one': {
		title: 'Article One ! IMAD App',
		heading: 'Article One',
		date: '08-25-2019',
		content: `
				<p>
					Let's say this is the begining of something new. Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.
				</p>
				<p>
					Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.
				</p>`,
		comment:`
				<textarea id="comment" placeholder="Comments"></textarea>
				<input type="submit" id="subcomment" value="Post!"></input>
				<ul id="commentlist">
				</ul>`
	},
	'article-two': {
		title: 'Article Two ! IMAD App',
		heading: 'Article Two',
		date: '08-25-2019',
		content: `
				<p>
					Let's say this is the begining of something new. Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.
				</p>
				<p>
					Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.
				</p>`,
		comment:`
				<textarea id="comment" placeholder="Comments"></textarea>
				<input type="submit" id="subcomment" value="Post!"></input>
				<ul id="commentlist">
				</ul>`
	},
	'article-three': {
		title: 'Article Three ! IMAD App',
		heading: 'Article Three',
		date: '08-25-2019',
		content: `
				<p>
					Let's say this is the begining of something new. Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.
				</p>
				<p>
					Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.Let's say this is the begining of something new.
				</p>`,
		comment:`
				<textarea id="comment" placeholder="Comments"></textarea>
				<input type="submit" id="subcomment" value="Post!"></input>
				<ul id="commentlist">
				</ul>`
	}
};*/

function createTemplate (data) {
	var title = data.title;
	var date = data.date;
	var heading = data.heading;
	var content = data.content;
	var comment = data.comment;						
	var htmlTemplate = `
	<!doctype html>
	<html>
		<head>
			<title>
				${title}
			</title>
			<meta name="viewport" content="width=device-width, initia-scale=1"/>
			<link href="/ui/style.css" rel="stylesheet"/>
		</head>
		<body>
			<div class="container">
				<div>
					<a href="/">Home</a>
				</div>
				<hr/>
				<h3>
					${heading}
				</h3>
				<div>
					${date.toDateString()}
				</div>
				<div>
					${content}     
				</div>
				<!--<div>
					${comment}
				</div>
				<script type="text/javascript" src="../ui/comment.js">
				</script>-->
			</div>
		</body>
	</html>
	`;
	return htmlTemplate;
}

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash (input, salt) {
	var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
	return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
};

app.get('/hash/:input', function(req, res) {
	var salt = 'this-is-some-random-string';
	var hashedString = hash(req.params.input, salt);
	res.send(hashedString);
});

app.post('/create-user', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var salt = crypto.randomBytes(128).toString('hex');
	var dbString = hash(password, salt);
	pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
		if (err){
			res.status(500).send(err.toString());
		} else {
			res.send("User Successfully created: " + username);
		}
	});
});

app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	pool.query('SELECT * from "user" where username = $1', [username], function (err, result) {
		if (err){
			res.status(500).send(err.toString());
		} else {
			if (result.rows.length === 0) {
				res.status(403).send("User not found");
			} else {
				var dbString = result.rows[0].password;
				var salt = dbString.split('$')[2];
				var hashedPassword = hash(password, salt);
				if (hashedPassword === dbString) {
				res.send("Credentials are correct");	
				} else {
					res.status(403).send("Credentials Incorrect");
				}
			}
		}	
	});
});

var pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'imad_buildapp',
	password: process.env.DB_PASSWORD,
	port: 5432
});
app.get('/test-db', function(req, res) {
	//make a select request
	pool.query('SELECT * FROM test', function (err, result){
		if (err){
			res.status(500).send(err.toString());
		} else {
			res.send(JSON.stringify(result.rows));
		}
	});
	//return a response with results
});

var counter = 0;
app.get('/counter', function(req, res) {
	counter = counter + 1;
	res.send(counter.toString());
});

var birds = [];
app.get('/submit-bird', function (req, res) {
	//Get the Bird from request
	var bird = req.query.bird;
	birds.push(bird);
	res.send(JSON.stringify(birds));
});

var commentList = [];
app.get('/articals/:articleName/comment', function (req, res) {
	//Get the Comment from request
	var comment = req.query.comment;
	commentList.push(comment);
	res.send(JSON.stringify(commentList));
});

app.get('/articles/:articleName', function(req, res) {
	// articleName = article-one
	// articles[articleName] == {} content object for article one
	pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result){
		if (err) {
			res.status(500).send(err.toString());
		} else {
			if (result.rows.length === 0) {
				res.status(404).send("Article not found");
			} else {
				var articleData = result.rows[0];
				res.send(createTemplate(articleData));
			}
		}
	});
	/*res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));*/
});

app.get('/ui/style.css', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/comment.js', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'comment.js'));
});

app.get('/ui/madi.png', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080;
app.listen(8080, function () {
	console.log(`IMAD course app listening on port ${port}!`);
});
