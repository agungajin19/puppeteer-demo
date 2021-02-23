const fs = require('fs');

function writeToFile(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content));
}

module.exports = {
  writeToFile,
};
