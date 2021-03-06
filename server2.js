var express = require('express');
var fs = require('fs');
var https = require('https');
var hbs = require('handlebars');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
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
app.use(require("connect").bodyParser());
var currIdx;

app.get('/addtask', function(req, res){
	fs.readFile('./addtask.hbs', function(err, data){
		if(err) throw err;
		var template = hbs.compile(data.toString());
		res.send(template());
		
	});
});

app.get('/details', function(req, res){
	fs.readFile('./details.hbs', function(err, data){
		if(err) throw err;
		var template = hbs.compile(data.toString());
		res.send(template());	
	});

});

app.get('/', function(req,res){
	if( req.query.task === undefined){  }
	else if ( (req.query.task).length < 1 ) {  }
	else{
		var task = new Task({
			name: req.query.task, 
			des: req.query.des, 
			due: req.query.due, 
			loc: req.query.loc
		}); 
		task.save(function (err) {
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

app.all('/clear', function(req,res){
	if( req.body._id != 'false' ){
		Task.remove({_id: req.body._id}, function(err){
			if (err) return handleError(err);
		});	
	}
	else{
		Task.remove({}, function(err){
			if (err) return handleError(err);
		});	
	}
});

app.all('/taskinfo', function(req, res){
	if (currIdx != undefined) {
		Task.find({}, function(err, records){
			res.send(records,currIdx);
					
		});
	}
	Task.count({}, function(err,c) {
		if( req.body.idx > -1 && req.body.idx < c ){
			currIdx = req.body.idx;
		}
		else{
			currIdx = undefined;
		}
	});
	
});

app.listen(8000);
