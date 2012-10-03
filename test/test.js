/**
 * User: seb
 * Date: 03/10/12
 * Time: 10:07
 * To change this template use File | Settings | File Templates.
 */

var assert = require("assert");
	OS = require("../lib/opensubtitles.js");

describe('Opensubtitles', function() {
	describe('#computeHash()', function(){

		it('should return a opensubtitles hash of the movie file ', function(done){
			var os = new OS();
			os.computeHash(process.cwd()+'/test/breakdance.avi', function(err, size){
				if (err) return done(err);
				assert.equal(size, '8e245d9679d31e12');
				done();
			});
		});
	});
});

