import express, { json, urlencoded } from 'express';
import collect from 'collect.js';
import bodyParser from 'body-parser';

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

const SERVER_PORT = process.env.PORT || 3000;
const MAX_LENGTH_WORD = 10;

/**
* @param {String} data Input string
* @param {Boolean} log If resultStr shall be logged to console
* @return {Promise<String>} values that represents formatted output
*/
function getWords(data, log = false) {
    return new Promise((resolve, reject) => {
        const data = 'O Hi this a test Car River Deer Car Bear and 0123456789A';
        const collection = collect(data.split(' '));
        const result = {};
        
        collection.filter(word => word.length <= MAX_LENGTH_WORD)
            .countBy(word => word.length)
            .keys()
            .each((key) => {
                result[key] = collection.filter((word) => word.length == key).all();
            });
        
        let resultStr = '';
        Object.entries(result).forEach((pair, i, arr) => {
            resultStr += `${pair[1].length} words with length ${pair[0]} (${pair[1]})\n`; 
        });

        if(log) {
            console.log(resultStr); 
        }

        resolve(resultStr);
    });
}

app.post('/getWordLengthFrequency', sanitize, async (req, res) => {
    const { data } = req.body;
	console.log("post requested received with data: " + data);

    const resultStr = await getWords(data);
  
    console.log("sending response");
    res.status(200).end(resultStr);
});

app.get('/', (req, res) => {
    res.status(200).write('Hello from nodejs app. Now start sending post requests with client or send get request with query specified.');
});

const server = app.listen(SERVER_PORT, () => {
	console.log("Server listening on port: " + SERVER_PORT);
});

/**
* Small checker for proper input, since we dont manipulate over scripts its enough to check for string
* @param {Response} res The response
* @param {Request} req The request to sanitize
* @return next middleware
*/
function sanitize(req, res, next) {
    if(req.body.data == undefined || String(req.body.data).length == 0
    ) {
        console.log('Did not pass');
        res.status(400).write('Body must contain field \'data\' and be a string');
    }
    req.body.data = String(req.body.data);
    console.log('Got request');
    next();
}
