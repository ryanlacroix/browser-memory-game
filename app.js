// Ryan Lacroix, 100901696
// Assignment 3

var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
var makeBoard = require('./makeBoard');

const ROOT = "./public_html";

var users = {};

var server = http.createServer(handleRequest); 
server.listen(2406);
console.log('Server listening on port 2406');

function handleRequest(req, res) {
	//parse the url
	var urlObj = url.parse(req.url,true);
	var filename = ROOT+urlObj.pathname;

	// Route for creation of new user.
	if (urlObj.pathname == "/memory/intro") {
		console.log(urlObj.query.complete);
		// New client
		if (users[urlObj.query.username] && urlObj.query.complete == "true") {
			// Client returning for new game.
			users[urlObj.query.username].level += 2;
		} else {
			// New client.
			var client = {};
			client.level = 4; // Beginner board size.
			users[urlObj.query.username] = client;
		}
		users[urlObj.query.username].board = makeBoard.makeBoard(users[urlObj.query.username].level);
		var sendObj = {};
		sendObj.level = users[urlObj.query.username].level;
		res.writeHead(200, {'content-type': 'application/json'});
		res.end(JSON.stringify(sendObj));
	} else if (urlObj.pathname == "/memory/card") {
		// Client asks for card value
		var xCoord = urlObj.query.column;
		var yCoord = urlObj.query.row;
		var sendObj = {};
		sendObj.cardValue = users[urlObj.query.username].board[xCoord][yCoord];
		res.writeHead(200, {'content-type': 'application/json'});
		res.end(JSON.stringify(sendObj));
	} else {
		fs.stat(filename,function(err, stats){ // this is firing unnecessarily
			// should probably else this from routes
			if(err){   //try and open the file and handle the error, handle the error
				respondErr(err);
			}else{
				if(stats.isDirectory())	filename = ROOT + "/index.html";
			
				fs.readFile(filename,"utf8",function(err, data){
					//if(err)respondErr(err);
					if (err) serve404();
					else respond(200,data);
				});
			}
		});
	}			
	
	//locally defined helper function
	//serves 404 files 
	function serve404(){
		fs.readFile(ROOT+"/404.html","utf8",function(err,data){ //async
			if(err)respond(500,err.message);
			else respond(404,data);
		});
	}
		
	//locally defined helper function
	//responds in error, and outputs to the console
	function respondErr(err){
		console.log("Handling error: ",err);
		if(err.code==="ENOENT"){
			serve404();
		}else{
			respond(500,err.message);
		}
	}
		
	//locally defined helper function
	//sends off the response message
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		// write message and signal communication is complete
		res.end(data);
	}	
	
};//end handle request