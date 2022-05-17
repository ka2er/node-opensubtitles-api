var fs = require('fs'),
	ee = require('events').EventEmitter,
	Api = require('./endpoints.js');


var os = module.exports = function(user, password, lang, ua) {

	this.api = new Api();
	this.user = user;
	this.password = password;
	this.lang = lang ? lang : 'en';
	this.ua = ua ? ua : 'NodeOpensubtitles v0.0.1';
};

os.prototype.__proto__ = ee.prototype;


// http://api.opensubtitles.org/xml-rpc


os.prototype.checkMovieHash = function(t_hash, cb) {
	var self = this;
	this.api.LogIn(function(err, res) {
		if(err) return cb(err);

		var token = res.token;
		self.api.CheckMovieHash(function(err, res){

			if(err) return cb(err);

			cb(null, res);
		},token, t_hash);
	}, this.user, this.password, this.lang, this.ua);
};

os.prototype.computeHash = function(path, cb) {
	// get file size
	// get first 64kb
	// get last 64kb
	// summup everything

	var chunk_size = 65536;
	var buf_start = new Buffer(chunk_size*2);
	var buf_end = new Buffer(chunk_size*2);
	var file_size = 0;
	var self = this;
	var t_chksum = [];
  
  function checksumReady(chksum_part, name) {
    self.emit('checksum-ready', chksum_part, name);

    t_chksum.push(chksum_part);
    if(t_chksum.length == 3) {
      var chksum = self.sumHex64bits(t_chksum[0], t_chksum[1]);
      chksum = self.sumHex64bits(chksum, t_chksum[2]);
      chksum = chksum.substr(-16);
      cb(null, self.padLeft(chksum, '0', 16));
    }
  }
  

	fs.stat(path, function(err, stat) {
		if(err) return cb(err);

		file_size = stat.size;
    
    checksumReady(file_size.toString(16), "filesize");

		fs.open(path, 'r', function(err, fd) {
			if(err) {
				return cb(err);
			}

			var t_buffers = [{buf:buf_start, offset:0}, {buf:buf_end, offset:file_size-chunk_size}];
			for(var i in t_buffers) {
				fs.read(fd, t_buffers[i].buf, 0, chunk_size*2, t_buffers[i].offset, function(err, bytesRead, buffer) {
					if(err) return cb(err);
          checksumReady(self.checksumBuffer(buffer, 16), "buf?");
				});
			}
			fs.close(fd);
		});
	});
};


/**
 * read 64 bits from buffer starting at offset as LITTLE ENDIAN hex
 *
 * @param buffer
 * @param offset
 * @return {String}
 */
os.prototype.read64LE = function(buffer, offset) {
	var ret_64_be = buffer.toString('hex', offset*8, ((offset+1)*8));
	var t = [];
	for(var i=0; i<8; i++) {
		t.push(ret_64_be.substr(i*2, 2));
	}
	t.reverse();
	return t.join('');
};


/**
 * compute checksum of the buffer splitting by chunk of lengths bits
 *
 * @param buf
 * @param length
 */
os.prototype.checksumBuffer = function(buf, length) {
	var checksum = 0, checksum_hex = 0;
	for(var i=0; i<(buf.length/length); i++) {
		checksum_hex = this.read64LE(buf, i);
		checksum = this.sumHex64bits(checksum.toString(), checksum_hex).substr(-16);
		//console.log("hash#"+i+" "+checksum_hex+" => "+checksum);
	}
	//console.log("chck sum : "+checksum);
	return checksum;
};

/**
 * calculate hex sum between 2 64bits hex numbers
 *
 * @param n1
 * @param n2
 * @return {String}
 */
os.prototype.sumHex64bits = function(n1, n2) {

	if(n1.length < 16) n1 = this.padLeft(n1, '0', 16);
	if(n2.length < 16) n2 = this.padLeft(n2, '0', 16);

	//console.log("n1 "+n1);
	//console.log("n2 "+n2);

	// 1st 32 bits
	var n1_0 = n1.substr(0, 8);
	var n2_0 = n2.substr(0, 8);
	var i_0 = parseInt(n1_0, 16) + parseInt(n2_0, 16);

	// 2nd 32 bits
	var n1_1 = n1.substr(8, 8);
	var n2_1 = n2.substr(8, 8);
	var i_1 = parseInt(n1_1, 16) + parseInt(n2_1, 16);

	// back to hex
	var h_1 = i_1.toString(16);
	//console.log('i'+i_1);
	//console.log('x'+h_1);
	//console.log(h_1.length);
	var i_1_over = 0;
	if(h_1.length > 8) {
		//console.log('retenue');
		i_1_over = parseInt(h_1.substr(0, h_1.length - 8), 16);
	} else {
		h_1 = this.padLeft(h_1, '0', 8);
	}

	var h_0 = (i_1_over + i_0).toString(16);

	//console.log(h_0+' | '+h_1);
	return h_0 + h_1.substr(-8);
};

/**
 * pad left with c up to length characters
 *
 * @param str
 * @param c
 * @param length
 * @return {*}
 */
os.prototype.padLeft = function(str, c, length) {
	while(str.length < length) {
		str = c.toString() + str;
	}
	return str;
};