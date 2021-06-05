module.exports = (data, datesArray) => {
  let fileNames = [];
  let { fileGeneration } = data;
  for (let i = 0; i < datesArray.length; i++) {
    let fileDate = fileGeneration.format;
    fileDate = fileDate.replace(
      "${d}",
      fileGeneration.dayMonthDigits == 2
        ? ("0" + datesArray[i].getDate()).slice(-2)
        : datesArray[i].getDate()
    );
    fileDate = fileDate.replace(
      "${m}",
      fileGeneration.dayMonthDigits == 2
        ? ("0" + (datesArray[i].getMonth() + 1)).slice(-2)
        : datesArray[i].getMonth() + 1
    );
    fileDate = fileDate.replace(
      "${y}",
      fileGeneration.yearDigits == 2
        ? datesArray[i].getFullYear().toString().substr(-2)
        : datesArray[i].getFullYear()
    );
    let fileName = `${fileDate}${fileGeneration.ext}`;
    fileNames.push({ fileName, ...data });
  }
  return fileNames;
};
