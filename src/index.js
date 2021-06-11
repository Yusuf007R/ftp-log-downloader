const ConnectAndDownload = require("./utils/connectAndDownload");
const inquirer = require("inquirer");
const config = require("./config.json");
const monthlyFileGenerator = require("./utils/monthlyFileGenerator");
const dailyFileGenerator = require("./utils/dailyFileGenerator");
const getDates = require("./utils/getDates");

inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

inquirer
  .prompt([
    {
      type: "list",
      name: "typeOfLog",
      message: "Monthly or daily logs?",
      choices: ["Monthly", "Daily"],
    },
  ])
  .then(({ typeOfLog }) => {
    if (typeOfLog == "Monthly") {
      inquirer
        .prompt({
          type: "datetime",
          name: "date",
          message: "Insert a date (dd-mm-yy)",
          format: ["dd", "/", "mm", "/", "yy"],
        })
        .then(async ({ date }) => {
          console.log("generating file names...");
          let listOfFIles = [];
          for (let i = 0; i < config.monthly.length; i++) {
            listOfFIles.push({
              data: monthlyFileGenerator(
                {
                  saveDir: config.configs.monthlySavePath,
                  ...config.monthly[i],
                },
                date
              ),
              serverInfo: config.monthly[i],
            });
          }
          for (let i = 0; i < listOfFIles.length; i++) {
            await ConnectAndDownload(
              listOfFIles[i].serverInfo,
              listOfFIles[i].data
            );
          }
        });
    } else if (typeOfLog == "Daily") {
      inquirer
        .prompt({
          type: "list",
          name: "TypeOfDaily",
          message:
            "Do you want to download 1 day or a group of days between 2 dates",
          choices: ["1 Day", "Group of days"],
        })
        .then(({ TypeOfDaily }) => {
          if (TypeOfDaily == "1 Day") {
            inquirer
              .prompt({
                type: "datetime",
                name: "date",
                message: "Insert a date (dd-mm-yy)",
                format: ["dd", "/", "mm", "/", "yy"],
              })
              .then(async ({ date }) => {
                let listOfFIles = [];
                for (let i = 0; i < config.daily.length; i++) {
                  listOfFIles.push({
                    data: dailyFileGenerator(
                      {
                        saveDir: config.configs.DailySavePath,
                        ...config.daily[i],
                      },
                      [date]
                    ),
                    serverInfo: config.daily[i],
                  });
                }
                for (let i = 0; i < listOfFIles.length; i++) {
                  await ConnectAndDownload(
                    listOfFIles[i].serverInfo,
                    listOfFIles[i].data
                  );
                }
              });
          } else if (TypeOfDaily == "Group of days") {
            inquirer
              .prompt({
                type: "datetime",
                name: "firstDate",
                message: "Insert a first date (dd-mm-yy)",
                format: ["dd", "/", "mm", "/", "yy"],
              })
              .then(({ firstDate }) => {
                inquirer
                  .prompt({
                    type: "datetime",
                    name: "SecondDate",
                    message: "Insert a Second date (dd-mm-yy)",
                    format: ["dd", "/", "mm", "/", "yy"],
                  })
                  .then(async ({ SecondDate }) => {
                    const arrayOfDates = getDates(firstDate, SecondDate);
                    let listOfFIles = [];
                    for (let i = 0; i < config.daily.length; i++) {
                      listOfFIles.push({
                        data: dailyFileGenerator(
                          {
                            saveDir: config.configs.DailySavePath,
                            ...config.daily[i],
                          },
                          arrayOfDates
                        ),
                        serverInfo: config.daily[i],
                      });
                    }
                    for (let i = 0; i < listOfFIles.length; i++) {
                      await ConnectAndDownload(
                        listOfFIles[i].serverInfo,
                        listOfFIles[i].data
                      );
                    }
                  });
              });
          }
        });
    }
  })
  .catch((error) => {
    console.log(error);
  });
