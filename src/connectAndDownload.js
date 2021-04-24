const ftp = require("basic-ftp");
const fs = require("fs");
const Log = require("./log");

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
    Log(
      `trying to ${data.fileDir}/${data.fileName} from ${
        data.host
      } ${new Date().toString()}`
    );
    await client.downloadTo(
      `${data.saveDir}/${data.fileName}`,
      `${data.fileDir}/${data.fileName}`
    );
    Log("done");
  } catch (err) {
    if (err.code == 550)
      return Log("Permission Denied or No Such File or Directory");
    Log(err);
  }
  client.close();
};
