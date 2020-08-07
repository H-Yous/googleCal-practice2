const fs = require("fs");
const Papa = require("papaparse");
const { resolve } = require("path");
const { title } = require("process");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var startDate, endDate;

async function calculateDuplicates(objects) {
  let filteredEvents = await Promise.all(
    object = objects.map(async object => {
      switch(object.day){
        case 0: 
          return {day: 0, events: await calcTimes(object)}
        case 1:
          return {day: 1, events: await calcTimes(object)}
        case 2:
          return {day: 2, events: await calcTimes(object)}
        case 3:
          return {day: 3, events: await calcTimes(object)}
        case 4:
          return {day: 4, events: await calcTimes(object)}
      }
    })
  ).then(object => {
    return object;
  })
  console.log("\n8. Resulting Day 1 Object in Array from CalculateDuplicates Function:");
  console.log(JSON.stringify(filteredEvents[0].events));
  return filteredEvents;
}

function parseFile(file) {
  file = fs.readFileSync(file);
  file = file.toString();
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      columns: ["projectCodes"],
      complete: (results) => {
        var array = []
        results.data.forEach(data => array.push(data.projectCodes))
        resolve(array)
      },
    });
  });
}

async function emptyDescriptions(title) {
  title = title.substr(0, title.indexOf(':'))
  projectCodes = await parseFile("projectCodes.csv");
  return new Promise(async resolve => {
    code = projectCodes.filter(code => code.includes(title))
    if (code.length === 0) code = 'None Returned'
    resolve(code.toString(','))
  })
}

// function calcDays() {
//   var days;
//   return 5;
//   if (this.endDate.getDate() > this.startDate.getDate()) {
//     days = this.endDate.getDate() - this.startDate.getDate();
//   } else {
//     switch (this.startDate.getMonth()) {
//       case (1, 3, 5, 7, 8, 10, 12):
//         //If the startDate date is the 30th and the end date is the 2nd.
//         //EITHER 31 - 30 + 2 OR 30 - 30 + 2 = 3 OR 2 respectively
//         days = 31 - this.startDate.getDate() + this.end.getDate();
//         break;
//       default:
//         days = 30 - this.startDate.getDate() + this.end.getDate();
//         break;
//     }
//   }
//   console.log(`2. Days: ${days}`);
//   return days;
// }

async function calcTimes(day) {
    var titles = [];
    day.events.forEach((event) => {
      if (event.title) titles.push(event.title);
    });
    let x = (names) => names.filter((name, i) => names.indexOf(name) === i);
    titles = x(titles);

    let eventObj = await Promise.all (
      object = titles.map(async (title) => {
        var timeCount = 0;
        day.events.map((event) => {
          totalCount = 0;
          if(title === event.title) {
            totalCount += event.time;
          }
          timeCount += totalCount;
        })
        var description;
        if(day.events.filter(obj => obj.title === title)[0].description != undefined){
          description = day.events.filter(obj => obj.title === title)[0].description;
        } else {
          description = await emptyDescriptions(title)
        }
        return {
          title: title,
          description: await description,
          time: timeCount
        };
      })).then(async (object) => {
        return object;
      })
    return await eventObj;
}

function setDates(startDate) {
  //Set startDate date and end date
  this.startDate = startDate;
  this.endDate = new Date();
  this.endDate.setDate(startDate.getDate() + 4) //End date is startDate date + 5
  this.endDate.setHours(23, 59, 00); //Ends at the end of the 5th day
  switch (this.startDate.getMonth()) {
    case (1, 3, 5, 7, 8, 10, 12): //If months have 31 days, anything above 26th moves to next month.
      (this.startDate.getDate() >= 26) ? this.endDate.setMonth(startDate.getMonth()+1) : this.endDate.setMonth(startDate.getMonth())
      break;
    default: //If months have 30 days, anything above 25 moves to next month
      (this.startDate.getDate() > 25) ? this.endDate.setMonth(startDate.getMonth() + 1) : this.endDate.setMonth(startDate.getMonth())
      break;
  }
  console.log(`1. startDate date: ${this.startDate}, endDate date: ${this.endDate}`);
}

function getDates() {
  return { startDate: this.startDate, endDate: this.endDate };
}

function printToCSV(objects) {
  finalArray = objects.map(object => {
    newArray = [];
    object.events.forEach(event => {
      newArray.push.apply(newArray, [{
        day: object.day,
        title: event.title,
        description: event.description,
        time: event.time
      }])
    })
    return newArray;
  })
  count = 0;
  var brandNew = []
  while(count < finalArray.length){
    brandNew = brandNew.concat(finalArray[count]);
    count++
  }
  console.log(`\n9. The created JSON from printToCSV ${JSON.stringify(brandNew)}`)
  const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'day', title: 'day'},
      {id: 'title', title: 'title'},
      {id: 'description', title: 'description'},
      {id: 'time', title: 'time'}
    ]
  });
  csvWriter
    .writeRecords(brandNew)
    .then(() => console.log('10. The CSV file was written to successfully!'))
}

module.exports = {
  setDates,
  getDates,
  calculateDuplicates,
  printToCSV
};
