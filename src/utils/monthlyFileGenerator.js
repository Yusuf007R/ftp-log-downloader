module.exports = (data, date) => {
  let { fileGeneration } = data;
  let fileFormat = fileGeneration.format;
  fileFormat = fileFormat.replace(
    "${m}",
    fileGeneration.monthList[date.getMonth()]
  );
  fileFormat = fileFormat.replace(
    "${y}",
    fileGeneration.yearDigits == 2
      ? date.getFullYear().toString().substr(-2)
      : date.getFullYear()
  );
  let fileName = `${fileFormat}${fileGeneration.ext}`;

  return { fileName, ...data };
};
