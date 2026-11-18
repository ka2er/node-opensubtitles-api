// Heap snapshots: this script needs the `heapdump` package (npm i heapdump) or,
// on modern Node, run it with `node --heapsnapshot-signal=SIGUSR2` and send SIGUSR2.
var heapdump = null;
try { heapdump = require("heapdump"); } catch (e) { /* handled in writeSnapshot */ }

var OS = require("../lib/opensubtitles.js");
var os = new OS();

var current = 0;
var limit = 500;

function computeHashUntilLimit() {
  console.log("compute hash current %d/%d", current, limit);
  
  if (current === 0) {
    writeSnapshot();
  }
  
  if (current === limit) {
    writeSnapshot();
    return;
  }
  
  os.computeHash(__dirname + '/breakdance.avi', function (err, size) {
    current++;
    computeHashUntilLimit();
  });
  
}

function writeSnapshot() {
  if (heapdump) {
    heapdump.writeSnapshot(__dirname + '/' + Date.now() + '.heapsnapshot');
  } else {
    console.error("heapdump not installed; use `node --heapsnapshot-signal=SIGUSR2` and send SIGUSR2 instead");
  }
}


computeHashUntilLimit();