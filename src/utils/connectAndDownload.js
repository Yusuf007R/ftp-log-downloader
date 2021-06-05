const ftp = require("basic-ftp");
const fs = require("fs");
const Log = require("./log");

module.exports = async (data) => {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  let dir = `${data.saveDir}/${data.name}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    await client.access({
      host: data.host,
      user: data.user,
      password: data.pass,
      secure: data.secure,
    });

    Log(`trying to ${dir}/${data.fileName} from ${data.host}`);

    await client.downloadTo(
      `${dir}/${data.fileName}`,
      `${data.fileDir}/${data.fileName}`
    );
    Log("done");
  } catch (err) {
    console.log(err);
    Log("error", true);
    if (err.code == 550)
      return Log("Permission Denied or No Such File or Directory", true);
  }
  client.close();
};
