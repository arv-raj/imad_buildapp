var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
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
};

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
					${date}
				</div>
				<div>
					${content}     
				</div>
				<div>
					${comment}
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
app.get('/:articleName/comment', function (req, res) {
	//Get the Comment from request
	var comment = req.query.comment;
	commentList.push(comment);
	res.send(JSON.stringify(commentList));
});

app.get('/:articleName', function(req, res) {
	// articleName = article-one
	// articles[articleName] == {} content object for article one
	var articleName = req.params.articleName;
	res.send(createTemplate(articles[articleName]));
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
