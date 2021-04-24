const fs = require("fs");

module.exports = (data) => {
  fs.appendFileSync("log.txt", data + "\n");
  console.log(data);
};
