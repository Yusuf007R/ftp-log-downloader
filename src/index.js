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
        .then(({ date }) => {
          console.log("generating file names...");
          let downloads = [];
          for (let i = 0; i < config.monthly.length; i++) {
            downloads.push(monthlyFileGenerator(config.monthly[i], date));
          }
          console.log(downloads);
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
              .then(({ date }) => {
                console.log(date);
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
                console.log(firstDate);
                inquirer
                  .prompt({
                    type: "datetime",
                    name: "SecondDate",
                    message: "Insert a Second date (dd-mm-yy)",
                    format: ["dd", "/", "mm", "/", "yy"],
                  })
                  .then(({ SecondDate }) => {
                    const arrayOfDates = getDates(firstDate, SecondDate);
                    let listOfFIles = [];
                    for (let i = 0; i < config.daily.length; i++) {
                      listOfFIles.push(
                        dailyFileGenerator(config.daily[i], arrayOfDates)
                      );
                    }
                    console.log(listOfFIles);
                  });
              });
          }
        });
    }
  })
  .catch((error) => {
    console.log(error);
  });

// const data = {
//   host: "test.rebex.net",
//   user: "demo",
//   pass: "password",
//   fileDir: "/pub/example",

//   fileName: "KeyGeneratorSmall.png",
//   saveDir: "./downloads",
// };

// ConnectAndDownload(data);
