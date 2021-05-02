module.exports = (data, datesArray) => {
  let fileNames = [];
  for (let i = 0; i < datesArray.length; i++) {
    let { fileGeneration, host } = data;
    let fileDate = fileGeneration.format;
    fileDate = fileDate.replace("d", datesArray[i].getDate());
    fileDate = fileDate.replace("m", datesArray[i].getMonth());
    fileDate = fileDate.replace(
      "y",
      fileGeneration.yearDigits == 2
        ? datesArray[i].getFullYear().toString().substr(-2)
        : datesArray[i].getFullYear()
    );
    let fileName = `${host}-${fileDate}${fileGeneration.ext}`;
    fileGeneration.fileName = fileName;
    fileNames.push(fileGeneration);
  }
  return fileNames;
};
