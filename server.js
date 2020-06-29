console.log('server is starting..');

// setting up the server

let express = require('express');
let app = express();
let server = app.listen(3000);

app.use(express.static('public'));

//request engine

let rp= require('request-promise');

// HTTPS get module

const https = require('https');


const sendMessage = (message) => {

    let endpoint = 'https://api.telegram.org/bot';
    let token = '1104751379:AAEzyUvSDRvjXMzyMihVN0RFkR0CO_bHqkA';
    let chatId = '@ruwiki_changes';
    
    let url = endpoint + token + '/sendMessage?chat_id=' + chatId + '&parse_mode=HTML&text=' + message;

    console.log('sending message ' + message);

    https.get(url, (resp) => {
        // console.log(JSON.parse(resp))
        // let response.text
        // console.log(resp);

        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            console.log('Data chunk received from Telegram')
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // let responseText = JSON.parse(data);

            // console.log(responseText);

            console.log('Message received by Telegram');
        });

    }).on('error', (err) => {
        console.log('Error: ' + err.message);
    });


    //     https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
    //   let data = '';

    //   // A chunk of data has been recieved.
    //   resp.on('data', (chunk) => {
    //     data += chunk;
    //   });

    //   // The whole response has been received. Print out the result.
    //   resp.on('end', () => {
    //     console.log(JSON.parse(data).explanation);
    //   });

    // }).on("error", (err) => {
    //   console.log("Error: " + err.message);
    // });


}


// main

// let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
// let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

// let term = 'rainbow';

// let url = searchUrl + term;

// // let url = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Africa/daily/2017042700/2018051700'

// // let url = 'https://ru.wikipedia.org/api/rest_v1/feed/onthisday/deaths/06/17';

// console.log(url);

// let options = {
  
//     method: 'GET',    
//     uri: url,
//     json:true    
// };

// rp(options)
//     .then(function(parseBody) {
//         console.log(parseBody)
//     });


// example code from wiki event streams

var EventSource = require('eventsource');
var url = 'https://stream.wikimedia.org/v2/stream/recentchange';
    
console.log(`Connecting to EventStreams at ${url}`);
var eventSource = new EventSource(url);
    
eventSource.onopen = function(event) {
    console.log('--- Opened connection.');
};
    
eventSource.onerror = function(event) {
    console.error('--- Encountered error', event);
};
    
// eventSource.onmessage = function(event) {
//     // event.data will be a JSON string containing the message event.
//     console.log(JSON.parse(event.data));
// };

var wiki = 'commonswiki';

eventSource.onmessage = function(event) {
    // event.data will be a JSON string containing the message event.
    var change = JSON.parse(event.data);


    let eventFilter = (change) => {
        let changeWiki = change.wiki
        let bot = change.bot
        let namespace = change.namespace
        let type = change.type

        if (changeWiki == 'ruwiki' && bot == false && namespace != ( 1 || 2 || 4 || 14 ) && type == ('edit' || 'new')) {
            return true;
        }    
    }

    if (eventFilter(change) ) {
        console.log('Matching change received: ' + change.title);
        let lenArr = Object.values(change.length);
        let revId = Object.values(change.revision)[1];
        let length = lenArr[1] - lenArr[0];
        let diffUrl = 'https://ru.wikipedia.org/w/index.php?torelative=prev&diff=' + revId;
        let message = `Страница: <b>${change.title}</b>, %0AРазмер изменений: ${length}, %0AКомментарий: ${change.comment} %0A<a href="https://ru.wikipedia.org/w/index.php?torelative=prev%26diff=105917764">Изменения</a>`; 
        // let message = 'test';      

        sendMessage(message);
        console.log(change);
    }
};
