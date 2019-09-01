var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
	secret: 'someRandomSecretValue',
	cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

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
					<a href="/">Back to Home</a>
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
				<h3>Comments</h3>
				<div id="comment_form>
				</div>
				<div id="comments">
					<center>Loading Comments ...</center>
				</div>
				<script type="text/javascript" src="../ui/comment.js">
				</script>
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

var pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'imad_buildapp',
	password: process.env.DB_PASSWORD,
	port: 5432
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
				res.status(500).send("User not found");
			} else {
				var dbString = result.rows[0].password;
				var salt = dbString.split('$')[2];
				var hashedPassword = hash(password, salt);
				if (hashedPassword === dbString) {
					req.session.auth = {userId: result.rows[0].id};
					res.send("Credentials are correct");
				} else {
					res.status(403).send("Credentials Incorrect");
				}
			}
		}	
	});
});

app.get('/check-login', function (req, res) {
	if (req.session && req.session.auth && req.session.auth.userId) {
		pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
			if (err) {
				res.status(500).send(err.toString());
			} else {
				res.send(result.rows[0].username);
			}
		});
	} else {
		res.status(400).send('You are not logged in');
	}
});

app.get('/logout', function (req, res) {
	delete req.session.auth;
	res.send("<html><body>Logged Out, Successfully<br/><br/><a href='/'>Home</a></body></html>")
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

/*var counter = 0;
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
});*/

//Article list for the Home page
app.get('/get-articles', function(req, res) {
	pool.query('SELECT * from article ORDER BY date DESC', function(err, result){
		if (err) {
			res.status(500).send(err.toString());
		} else {
			res.send(JSON.stringify(result.rows));
		}
	});
});

//Need to get the comments for those articles
app.get('/get-comments/:articleName', function(req,res) {
	pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
				res.send(JSON.stringify(result.rows));
		}
	});
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

app.get('/ui/:fileName', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});

var port = 8080;
app.listen(8080, function () {
	console.log(`IMAD course app listening on port ${port}!`);
});
