module.exports = (data, date) => {
  let { fileGeneration, host } = data;
  let fileDate = fileGeneration.format;
  fileDate = fileDate.replace("m", fileGeneration.monthList[date.getMonth()]);
  fileDate = fileDate.replace(
    "y",
    fileGeneration.yearDigits == 2
      ? date.getFullYear().toString().substr(-2)
      : date.getFullYear()
  );
  let fileName = `${host}-${fileDate}${fileGeneration.ext}`;
  return fileName;
};
