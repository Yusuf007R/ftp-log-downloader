const fs = require("fs");
const Log = require("./log");
const config = require("../config.json");

async function sftpDownload(fileNames, dir, serverInfo) {
  const Client = require("ssh2-sftp-client");
  let sftp = new Client();
  try {
    await sftp.connect({
      host: serverInfo.host,
      user: serverInfo.user,
      password: serverInfo.pass,
      port: serverInfo.port,
    });

    for (let i = 0; i < fileNames.length; i++) {
      Log(`downloading ${serverInfo.absolutePath}/${fileNames[i]}`);
      await sftp
        .fastGet(
          `${serverInfo.absolutePath}/${fileNames[i]}`,
          `${dir}/${fileNames[i]}`
        )
        .catch((error) => console.log(error.message));
    }
    Log("done");
    return sftp.end();
  } catch (err) {
    console.log(err);
    Log("error", true);
    if (err.code == 550)
      return Log("Permission Denied or No Such File or Directory", true);
    return;
  }
}

async function ftpDownload(fileNames, dir, serverInfo) {
  const ftp = require("basic-ftp");
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: serverInfo.host,
      user: serverInfo.user,
      password: serverInfo.pass,
      secure: serverInfo.secure,
    });

    for (let i = 0; i < fileNames.length; i++) {
      Log(`downloading ${serverInfo.absolutePath}/${fileNames[i]} `);
      await client
        .downloadTo(
          `${dir}/${fileNames[i]}`,
          `${serverInfo.absolutePath}/${fileNames[i]}`
        )
        .catch((error) => console.log(error.message));
    }
    Log("done");
    return client.close();
  } catch (err) {
    console.log(err);
    Log("error", true);
    if (err.code == 550)
      return Log("Permission Denied or No Such File or Directory", true);
    return;
  }
}

module.exports = async (serverInfo, data) => {
  let dir = `${config.configs.DailySavePath}/${serverInfo.name}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (serverInfo.protocol === "sftp") {
    return sftpDownload(data, dir, serverInfo);
  }
  ftpDownload(data, dir, serverInfo);
};
