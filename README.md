changer reads in files and modifies them according to rules that you specify. It can be used to automatically modify code, change text, or anything else.

Installation
```
npm install changer
```

To use changer you need to create some rules. A rule is a just a function, and it returns the (possibly modified) line of text. Here's an example rule:

```JavaScript
var replaceEvens = function( lineNumber, text ) {
	if( lineNumber % 2 == 2 )
		text.replace( "Hello", "Goodbye" );

	return text;
}

var commentOut = function( lineNumber, text ) {
	if( lineNumber > 50 && lineNumber < 60 )
		text = "// " + text;

	return text;
}

exports.rules = {
	replace: replaceEvens,
	commentOut: commentOut
}
```

Then in another file, we can apply the rules to some files

```JavaScript
var change = require("changer").change,
	rules = require("./ruleSet");

// An array of filepaths
var files = [
	'file1.txt'
	'C:/file2.h'
	'includes/file3.cpp'
];

// Batch process the files
for( var iFile=0; iFile<files.length; ++iFile ) {
	change( rules.replaceEvens, files[iFile] );
	change( rules.commentOut, files[iFile] );
}

// Do one more for good measure
change( rules.replaceEvens, "anotherfile.csv" );
```