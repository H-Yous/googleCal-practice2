const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { getDates, setEventObjects } = require("./functions.js");

const TOKEN_PATH = "token.json";
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  // Check if we have previously stored a token.

  return new Promise(resolve => {
    fs.readFile(TOKEN_PATH, async (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(await callback(oAuth2Client));
    })
  }).then((weekArray) => {
    console.log('\n7. Resulting Day 1 object in array from ListEvents function:')
    console.log(JSON.stringify(weekArray[0].events));
    return weekArray;
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({ version: "v3", auth });

  return new Promise(async (resolve) => { 
    days = 5;
    var count = 0;
    var weekArray = [];
    const dates = getDates(); //GET startDate and endDate
    var testCount = 2
    console.log("==== Beginning listEvents While Loop ====")
    while (count < days) {
      dates.endDate.setDate(dates.startDate.getDate())
      dates.endDate.setHours(23, 59, 59)
      dates.startDate.setHours(00, 00, 00)

      var array = new Promise((resolve) => {
        calendar.events.list(
          {
            calendarId: "primary",
            timeMin: dates.startDate.toISOString(),
            timeMax: dates.endDate.toISOString(),
            maxResults: 1000,
            singleEvents: true,
            orderBy: "startTime",
          },
          (err, res) => {
            if (err) return console.log("The API returned an error: " + err);
            
            const events = res.data.items;
            if (events.length) {
              var array = [];
              events.forEach((event) => {
                
                var startDate = new Date(event.start.dateTime);
                var endDate = new Date(event.end.dateTime);
                var diff =
                  (endDate.getTime() - startDate.getTime()) / 1000 / 60;
                  
                array.push({
                  title: event.summary,
                  description: event.description,
                  time: ( diff / 60 != Infinity ) ? diff / 60 : 0,
                });
              });
              return resolve(array);
            } else {
              return resolve({ events: "empty" });
            }
          }
        );
      });
      console.log(`${testCount++}. Date: ${dates.startDate.getDate()}/${dates.startDate.getMonth()}, Time: ${dates.startDate.getHours() +":"+ dates.startDate.getMinutes()} - ${dates.endDate.getHours()+":"+dates.endDate.getMinutes()}, day: ${dates.startDate.getDay()}, Event Amount: ${(await array).length}`)
      weekArray.push({ day: dates.startDate.getDay()-1, events: await array });
      dates.startDate.setDate(dates.startDate.getDate() + 1);
      count++;
    }
    resolve(weekArray);
  });
}


module.exports = { authorize, listEvents };
