const fs = require("fs");
const Papa = require("papaparse");
const { resolve } = require("path");
const { title } = require("process");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var start, end;
var eventObjects = [];

async function finalProduct(objects) {
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

function calcDays() {
  var days;
  if (this.end.getDate() > this.start.getDate()) {
    days = this.end.getDate() - this.start.getDate();
  } else {
    switch (this.start.getMonth()) {
      case (1, 3, 5, 7, 8, 10, 12):
        //If the start date is the 30th and the end date is the 2nd.
        //EITHER 31 - 30 + 2 OR 30 - 30 + 2 = 3 OR 2 respectively
        days = 31 - this.start.getDate() + this.end.getDate();
        break;
      default:
        days = 30 - this.start.getDate() + this.end.getDate();
        break;
    }
  }
  console.log(`2. Days: ${days}`);
  return days;
}

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

function setDates(start) {
  this.start = start;
  this.end = new Date();
  this.end.setDate(start.getDate() + 5)
  this.end.setHours(23, 59, 00);
  switch (this.start.getMonth()) {
    case (1, 3, 5, 7, 8, 10, 12):
      (this.start.getDate() >= 26) ? this.end.setMonth(start.getMonth()+1) : this.end.setMonth(start.getMonth())
      break;
    default:
      (this.start.getDate() >= 25) ? this.end.setMonth(start.getMonth() + 1) : this.end.setMonth(start.getMonth())
      break;
  }
  console.log(`1. Start date: ${this.start}, End date: ${this.end}`);
}

function getDates() {
  return { start: this.start, end: this.end };
}

function setEventObjects(eventObjects) {
  this.eventObjects = eventObjects;
}

async function getEventObjects() {
  var promise = new Promise((resolve) => {
    interval = setInterval(() => {
      if (this.eventObjects.length > 0) {
        clearInterval(interval);
        return resolve(this.eventObjects);
      } else {
        console.log("2 seconds, Event Object is empty");
      }
    }, 2000);
  });
  return await promise;
}

async function printToCSV(objects) {
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
    //console.log(newArray.length)
    return newArray;
  })
  count = 0;
  var brandNew = []
  while(count < finalArray.length){
    brandNew = brandNew.concat(finalArray[count]);
    count++
    console.log(brandNew)
    console.log("00000000000000000")
  }
  console.log(brandNew)
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
    .then(() => console.log('The CSV file was written to successfully'))
}

module.exports = {
  setDates,
  getDates,
  calcDays,
  setEventObjects,
  getEventObjects,
  finalProduct,
  printToCSV
};
