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

	describe('#padLeft', function() {
		it('should left pad a string as occurence of max char', function() {

			var os = new OS();
			assert.equal(os.padLeft("123456", 0, 10), "0000123456");
			assert.equal(os.padLeft("123456", "0", 10), "0000123456");
		});
	});

	describe('#sumHex64Bits', function() {
		it('should add 64 bits hex string', function() {
			var os = new OS();
			assert.equal(
				os.sumHex64bits(
					"3a3e2a2340",
					"4d6b464332"
					),
				"87a9706672"
			);
			//assert.equal(os.padLeft("123456", "0", 10), "0000123456");
		});
	});


});

