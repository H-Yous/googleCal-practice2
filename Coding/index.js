//const authorize = require('./googleApiConfig')
const { authorize, listEvents } = require("./config");
const fs = require("fs");
const { setDates, calculateDuplicates, printToCSV } = require("./functions");
const prompt = require('prompt-sync')();
eventObject = [];

//Read Credentials JSON file and using the content to run google api calls.
fs.readFile("credentials.json", async (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Calendar API
  startDate = prompt('Please enter a date (DD MM YYYY Format SPACE SEPARATED): ');
  startDate = startDate.split(' ');
  console.log(startDate);
  //Set the dates to grab events from. 

  date = new Date(+startDate[2], +startDate[1]-1, +startDate[0]);
  setDates(date);

  // //Begin the authorize function -- googleApiConfig.js
  weekArray = await authorize(JSON.parse(content), listEvents);
  eventObject = await calculateDuplicates(weekArray);
  printToCSV(await eventObject);
});

