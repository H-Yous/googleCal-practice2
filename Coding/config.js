const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { getDates, calcDays, setEventObjects } = require("./functions.js");

const TOKEN_PATH = "token.json";
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
var start, end;
var eventObjects = [];

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, async (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    promise = new Promise(async (resolve) => {
      this.eventObjects = await callback(oAuth2Client);
      if (this.eventObjects.length > 0) {
        resolve(this.eventObjects);
      }
    });
    setEventObjects(await promise);
  });
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

  var promise = new Promise(async (resolve) => {
    const days = calcDays()
    var count = 0;
    var finalArray = [];
    const dates = getDates()
    var testCount = 3
    console.log("Beginning While Loop")
    while (count < days) {
      dates.end.setDate(dates.start.getDate())
      dates.end.setHours(23, 59, 59)
      dates.start.setHours(00, 00, 00)

      var array = new Promise((resolve) => {
        testCount2 = 8
        calendar.events.list(
          {
            calendarId: "primary",
            timeMin: dates.start.toISOString(),
            timeMax: dates.end.toISOString(),
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
      console.log(`${testCount++}. Date: ${dates.start.getDate()}/${dates.start.getMonth()}, Time: ${dates.start.getHours() +":"+ dates.start.getMinutes()} - ${dates.end.getHours()+":"+dates.end.getMinutes()}, day: ${dates.start.getDay()}, Event Amount: ${(await array).length}`)
      finalArray.push({ day: dates.start.getUTCDay(), events: await array });
      dates.start.setDate(dates.start.getDate() + 1);
      count++;
    }

    resolve(finalArray);
  });
  return await promise;
}


module.exports = { authorize, listEvents };
