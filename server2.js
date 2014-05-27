var express = require('express');
var fs = require('fs');
var https = require('https');
var hbs = require('handlebars');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	
});
var taskSchema = new mongoose.Schema({
	name: String, 
	des: String, 
	due: String, 
	loc: String
});
var Task = mongoose.model('Task', taskSchema);
mongoose.connect('mongodb://localhost/test');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/addtask', function(req, res){
	fs.readFile('./addtask.hbs', function(err, data){
		if(err) throw err;
		var template = hbs.compile(data.toString());
		res.send(template());
		
	});
});

app.get('/', function(req,res){
	if( req.query.task !== undefined ){
		var task = new Task({
			name: req.query.task, 
			des: req.query.des, 
			due: req.query.due, 
			loc: req.query.loc
		}); 
		
		task.save(function (err, task) {
			if(err) return console.error(err);
			
		});
		
	}
	fs.readFile('./index.hbs', function(err, data){
		if(err) throw err;
		var template = hbs.compile(data.toString());
		res.send(template());

	});
});

app.all('/report', function(req,res){
	Task.find({}, function(err, records){
		res.send(records);		
	});
});


app.listen(8000);
