// This test script inserts "TEST" in the beginning of every line of README.md
var changer = require("./changer").createChanger();

// Create a rule
var rule = function( lineNumber, text ) {
	if( true ) {
		text = "TEST " + text;
	}		

	return text;
}

var fileName = "README.md";

changer.change( rule, fileName, function() {
	console.log( "Changed some stuff!" );

	changer.insert( "/////////////////////////////////////\n////////////////////////////\n///////////////////////////", fileName, 5, function(){
		console.log("Inserted some stuff")
	});
});