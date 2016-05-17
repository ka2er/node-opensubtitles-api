node-opensubtitles-api
======================

Node.js API library to query opensubtitles.org

![build status](https://travis-ci.org/ka2er/node-opensubtitles-api.svg?branch=master)

Usage
-----

The lib get hashing function :

	var OS = require("opensubtitles");
	var os = new OS();
	os.computeHash('./test/breakdance.avi', function(err, size){
		if (err) return;

		os.checkMovieHash([size], function(err, res) {
			if(err) return;

			console.log(res);
		})
	});

And it also bind all XML-RPC methods :

	os.api.LogIn(function(err, res){
		console.log(res);
	},user, pass, lang, ua);

Tests
-----

simply run :

	$ mocha

About
-----

The MIT License - Copyright (c) 2015 ka2er

>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<a href='http://www.opensubtitles.org/'>Subtitles service powered by www.OpenSubtitles.org <img src='http://static.opensubtitles.org/gfx/logo-transparent.png' /></a>
