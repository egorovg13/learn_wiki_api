const https = require('https');

let endpoint = 'https://ru.wikipedia.org/w/api.php';
let params = '?action=compare&format=json&torelative=prev&prop=diff&fromrev=';
let revId = '107795867';

let url = endpoint + params + revId;


https.get(url, (resp) => {

    console.log('Sending GET to ' + url);

    let data = '';

    resp.on('data', (chunk) => {
        console.log('Data chunk received from Wiki');
        data += chunk;
    });

    resp.on('end', () => {

        console.log('Diff received');
        
        let responseText = JSON.parse(data);

        let diff = responseText.compare;

        let diffHtml = Object.values(diff)[0];

        console.log(diffHtml);

    });

}).on('error', (err) => {
    console.log('Error: ' + err.message);
});