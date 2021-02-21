const fs = require('fs')

function writeToFile (filename, content ) {
  fs.writeFile(filename, JSON.stringify(content), function (err,data) {
    if (err) {
      return console.log(err);
    }
  });
}

module.exports = {
  writeToFile
}