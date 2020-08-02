
//const authorize = require('./googleApiConfig')
const { authorize, listEvents } = require('./config');
const fs = require('fs');
const { setDates, finalProduct } = require('./functions')


fs.readFile('credentials.json', async (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API

    const before = new Date(2020, 6, 20)
    setDates(before)
    await authorize(JSON.parse(content), listEvents);

    finalProduct()
  });



// setInterval(() => {
//   if(list){
//     console.log(list)
//   }
// }, 1000)