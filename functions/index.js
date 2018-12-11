const functions = require('firebase-functions');
const cheerio = require('cheerio');
const request = require('request-promise');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
  scrape().then((data) =>
      response.send(`.`)
  ).catch( (errorMessage) =>{
      console.error(errorMessage);
  });
});

const scrape = ()=>
    request({
        method: 'GET',
        uri: 'https://ppr.syngenta.com/vendavo'
    }).then(body => {
      // console.log(body);
      $ = cheerio.load(body);

      const title = $('title').text();
      console.log(title);

      if (title === 'Go To Home Page of Vendavo - Vendavo, Inc.') {
        console.log('YES!!');
        return db.collection('syngentcheck').add({live: true, timestamp: Date.now()});

      }
      return db.collection('syngentcheck').add({live: false, timestamp: Date.now()});
      // return '';
    });
//
