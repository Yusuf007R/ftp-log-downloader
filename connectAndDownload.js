const ftp = require("basic-ftp");
var fs = require("fs");

module.exports = async (data) => {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: data.host,
      user: data.user,
      password: data.pass,
      secure: false,
    });
    if (!fs.existsSync(data.saveDir)) {
      fs.mkdirSync(data.saveDir);
    }
    console.log(`trying to ${data.fileDir}/${data.fileName} from ${data.host}`);

    await client.downloadTo(
      `${data.saveDir}/${data.fileName}`,
      `${data.fileDir}/${data.fileName}`
    );
    console.log("done");
  } catch (err) {
    if (err.code == 550)
      return console.log("Permission Denied or No Such File or Directory");
    console.log(err);
  }
  client.close();
};
