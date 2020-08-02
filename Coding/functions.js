const fs = require("fs");
const Papa = require("papaparse");
const { resolve } = require("path");

var start, end;
var eventObjects = [];

function finalProduct() {
  new Promise(async resolve => {
    var week = []
    eventObjects.map(async day => {
        switch(day.day){
            case 0:
                (day.events.val) ? week.push({ day: day.day, events: 'empty'}) : week.push({ day: day.day, events: await calcTimes(day)})
                break;
            case 1:
                (day.events.val) ? week.push({ day: day.day, events: 'empty'}) : week.push({ day: day.day, events: await calcTimes(day)})
                break;
            case 2:
                (day.events.val) ? week.push({ day: day.day, events: 'empty'}) : week.push({ day: day.day, events: await calcTimes(day)})
                break;
            case 3:
                (day.events.val) ? week.push({ day: day.day, events: 'empty'}) : week.push({ day: day.day, events: await calcTimes(day)})
                break;
            case 4: 
                (day.events.val) ? week.push({ day: day.day, events: 'empty'}) : week.push({ day: day.day, events: await calcTimes(day)})
                break;
            case 5:
                (day.events.val) ? week.push({ day: day.day, events: 'empty'}) : week.push({ day: day.day, events: await calcTimes(day)})
                break;
            case 6:
                (day.events.val) ? week.push({ day: day.day, events: 'empty'}) : week.push({ day: day.day, events: await calcTimes(day)})
                break;
        } 
    })
    console.log("week")
    console.log(await week)
    return resolve(await week)
  })
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
  return new Promise(resolve => {
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

    var eventObj = [];
    
    titles.forEach(async (title) => {
      var timeCount = 0;
      day.events.forEach((event) => {
        if (title === event.title) {
          timeCount += event.time;
        }
      });
      if(day.events.filter(obj => obj.title === title)[0].description != undefined) description = day.events.filter(obj => obj.title === title)[0].description
      else description =  await emptyDescriptions(title)
      //description = (day.events.filter(obj => obj.title === title)[0].description != undefined) ? day.events.filter(obj => obj.title === title)[0].description : await emptyDescriptions(title);

      eventObj.push({
        title: title,
        description: description,
        time: timeCount
      });
    });
   // console.log(await eventObj)

    return await eventObj

}

function setDates(start) {
  this.start = start;
  this.end = new Date();
  this.end.setDate(this.start.getDate() + 5);
  this.end.setHours(23, 59, 00);
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

module.exports = {
  setDates,
  getDates,
  calcDays,
  setEventObjects,
  getEventObjects,
  calcTimes,
  finalProduct
};
