//////////////////////////////////////////////////////////////////////////
// Changer - Main Script
//////////////////////////////////////////////////////////////////////////
//
// Changer modifies text files according to user defined 'rules'
//
/* ----------------------------------------------------------------------
                                                    Object Structures
-------------------------------------------------------------------------

*/
//////////////////////////////////////////////////////////////////////////
// Node.js Exports
exports.createChanger = function( isZeroIndexed ) { 
	return new Changer( isZeroIndexed ); 
}


//////////////////////////////////////////////////////////////////////////
// Namespace (lol)
var DEBUG = true;
	
var log = function( text, isImportant ) { 
	if( DEBUG && isImportant ) {
		console.log("\n******************************************")
		console.log("* " + text)
		console.log("******************************************\n")
	} else if( DEBUG ) {
		console.log(text); 
	};
}

var bw = require("buffered-writer"),
	lineReader = require('line-reader');

//////////////////////////////////////////////////////////////////////////
// Constructor
function Changer( isZeroIndexed ) {
	this.fileContents = [];
	this.filePath = "";
	this.isZeroIndexed = isZeroIndexed || false;

	this.commentOutRule = function( lineNumber, text ) {
		return "// " + text;;
	};
} // end Changer()


//////////////////////////////////////////////////////////////////////////
// Change a file according to a rule
Changer.prototype.change = function( rule, file, startLine, endLine, callback ) {	
	var _this = this;

	var fileContents = [];

	// The callback is the last argument. This allows the 
	// start and end lines to be optional arguments
	callback = arguments[arguments.length-1];

	this.filePath = file;

	function readFinished() {
		// Write the file
		_this.writeFile( file, fileContents, callback );
	}
	
	var linesRead = this.isZeroIndexed ? 0 : 1;

	lineReader.eachLine( file, function(line, last) {
		var newLine = line;

		// Call the rule
		if( (startLine != undefined && linesRead < startLine) || 
			(endLine != undefined && linesRead > endLine) ) {
			// Do nothing
		} else {
			newLine = rule( linesRead, line );
			
			// If the rule didn't return anything, just go with the original line
			if( newLine === undefined )
				newLine = line;
		}

	   	fileContents.push( newLine );

		if( last ) {
			readFinished();
		}

		linesRead++;
	});
} // end change()


//////////////////////////////////////////////////////////////////////////
// Insert some text into a file
Changer.prototype.insert = function( file, insertAfterLine, text, callback ) {
	// Read the file into an array
	this.readIntoArray( file, function(fileContents) {
		fileContents.splice(insertAfterLine, 0, "Lene");
	});
} // end insert()


//////////////////////////////////////////////////////////////////////////
// Reads a file and pushes its contents into an array
Changer.prototype.readIntoArray = function( file, callback ) {
	var fileContents = [];

	lineReader.eachLine( file, function(line, last) {
		fileContents.push( line );

		if( last ) {
			callback( fileContents );
		}
	}); // end for each line
} // end readIntoArray()


//////////////////////////////////////////////////////////////////////////
// Write the contents of a file to disk
Changer.prototype.writeFile = function( filePath, fileContents, callback ) {
	console.log( "Writing file " + filePath );

	var writer = bw.open( filePath )
				   .on( "error", function(error) { console.log (error); });

	for( var iLine = 0; iLine < this.fileContents.length; ++iLine ) {
		writer.write( this.fileContents[iLine] + "\n" );
	}

	writer.close();

	if( callback != undefined ) {
		callback();
	}
} // end writeFile()


//////////////////////////////////////////////////////////////////////////
// Convenience function to comment out some lines of code
Changer.prototype.commentOut = function( file, startLine, endLine, callback ) {
	this.change( this.commentOutRule, file, startLine, endLine, callback );
} // end writeFile()