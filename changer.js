//////////////////////////////////////////////////////////////////////////
// Changer - Main Script
//////////////////////////////////////////////////////////////////////////
//
// Changer modifies text files according to user defined 'rules'
//
/* ----------------------------------------------------------------------
                                                    Object Structures
-------------------------------------------------------------------------
	var task = {
		lineNumber: someNumber,
		task: someTask,
		text: the text that's going into place
	}

	// Available task types
	insert
	replace
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
	if(DEBUG && isImportant) {
		console.log("\n******************************************")
		console.log("* " + text)
		console.log("******************************************\n")
	} else if(DEBUG) {
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
	this.isZeroIndexed = isZeroIndexed || true;

	this.commentOutRule = function( lineNumber, text ) {
		text = "// " + text;
	}
} // end Changer()


//////////////////////////////////////////////////////////////////////////
// Change a file according to a rule
Changer.prototype.change = function( rule, file, startLine, endLine, callback ) {	
	var _this = this;

	// The callback is the last argument. This allows the 
	// start and end lines to be optional arguments
	callback = arguments[arguments.length-1];

	this.filePath = file;

	function readFinished() {
		// Write the file
		_this.writeFile( file, callback );
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

	   	_this.fileContents.push( newLine );

		if( last ) {
			readFinished();
		}

		linesRead++;
	});
} // end change()


//////////////////////////////////////////////////////////////////////////
// Write our current file buffer to disk
Changer.prototype.writeFile = function( filePath, callback ) {
	console.log( "Writing file " + filePath );

	var writer = bw.open( filePath )
					.on ("error", function (error){ console.log (error); });

	for( var iLine = 0; iLine < this.fileContents.length; ++iLine ) {
		writer.write( this.fileContents[iLine] + "\n" );
	}

	writer.close();
} // end writeFile()


//////////////////////////////////////////////////////////////////////////
// Convenience function to comment out some lines of code
Changer.prototype.commentOut = function( file, startLine, endLine, callback ) {
	this.change( this.commentOutRule, file, startLine, endLine, callback );
} // end writeFile()