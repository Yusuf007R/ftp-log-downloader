const fs = require("fs");

module.exports = (data) => {
  fs.appendFileSync(data + " log.txt" + "\n");
  console.log(data);
};
