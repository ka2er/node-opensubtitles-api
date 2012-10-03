var fs = require('fs'),
	event = require('events').EventEmitter;


var os = module.exports = function() {
};

os.prototype.__proto__ = EventEmitter.prototype;


os.prototype.computeHash = function(path, cb) {
	// get file size
	// get first 64kb
	// get last 64kb
	// summup everything

	var chunk_size = 65536;
	var buf_start = new Buffer(chunk_size);
	var buf_end = new Buffer(chunk_size);
	var file_size = 0;
	var self = this;
	var chksum = 0;
	var finished = 0;

	this.on('checksum-ready', function(err, chksum_part) {
		finished++;
		chksum = this.sumHex64bits(chksum, chksum_part);
		if(finished == 2) {
			cb(null, chksum);
		}
	});

	fs.stat(path, function(err, stat) {
		if(err) return cb(err);

		file_size = stat.size;
		chksum = file_size;
		fs.open(path, 'r', function(err, fd) {
			if(err) {
				return cb(err);
			}
			fs.read(fd, buf_start, 0, chunk_size, 0, function(err, bytesRead, buffer) {
				if(err) {
					return cb(err);
				}
				console.log("Read "+bytesRead+" bytes from the start");
				console.log(buffer);
				chksum_start = self.checksumBuffer(buffer, 64);
			});
			fs.read(fd, buf_end, 0, chunk_size, file_size - chunk_size, function(err, bytesRead, buffer) {
				if(err) {
					return cb(err);
				}
				console.log("Read "+bytesRead+" bytes from the end");
				console.log(buffer);
				chksum_end = self.checksumBuffer(buffer, 64);
			});
		});
	});
	console.log(file_size +' '+chksum_start+' '+chksum_end);
};

/**
 * compute checksum of the buffer splitting by chunk of lengths bits
 *
 * @param buf
 * @param length
 * @param cb
 */
os.prototype.checksumBuffer = function(buf, length, cb) {
	var checksum = 0, checksum_hex = 0, h_length = length / 2;
	for(var i=0; i<(buf.length/length); i++) {
		checksum_hex = buf.toString('hex', i*h_length, ((i+1)*h_length-1)); // hex string to int

		/*
		console.log("chunk #"+i+' RAW '+buf.toString('hex', i*length, ((i+1)*length-1)));
		console.log("chunk #"+i+' MOD '+checksum_int);
		console.log("chunk #"+i+' MOD '+checksum_int.toString(16));
*/
		checksum = this.sumHex64bits(checksum.toString(), checksum_hex).substr(-16);
	}
	console.log("chck sum : "+checksum);
	cb(null, checksum);
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

	// 1st 32 bits
	var n1_0 = n1.substr(0, 8);
	var n2_0 = n2.substr(0, 8);
	var r_0 = parseInt(n1_0, 16) + parseInt(n2_0, 16);

	// 2nd 32 bits
	var n1_1 = n1.substr(8, 8);
	var n2_1 = n2.substr(8, 8);
	var r_1 = parseInt(n1_1, 16) + parseInt(n2_1, 16);

	// back to hex
	var n_1 = r_1.toString(16);

	var n_1_over = 0;
	if(n_1.lenth > 8) {
		n_1_over = parseInt(n_1.substr(0, n_1.length - 8), 16);
	} else {
		n_1 = this.padLeft(n_1, '0', 8);
	}

	var n_0 = (n_1_over + r_0).toString(16);

	return n_0 + n_1.substr(-8);
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