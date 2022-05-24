# Lab3 - Word length calculator

## Launch
### Server
Write commands in terminal:
- npm i
- node server.js

### Client
Write commands in terminal:
- node client.cjs

### Other
Else if you have Linux OS you can launch 2 scripts that start above codes
- ./server.sh
- ./client.sh

## Intro
I have modified the server little bit, to make it return promise and little bit sanitize the input.
The calculation process itself happens inside method called getWords() which return a Promise\<String> object,
containing formatted output.

## Calculations
In order to calculate length frequency, I was using collect.js library because it gives usefull filtering methods. 
```js
import collect from 'collect.js';
```
1. Split input into array of strings
```js
const collection = collect(data.split(' '));
```
2. Filter array so it contains only words with length below 10 charactes (inclusive)
```js
const MAX_LENGTH_WORD = 10;
//...
collection.filter(word => word.length <= MAX_LENGTH_WORD)
```
3. Then grab only lengths of those words (and count frequency of length) into separate collection. The resulting collection will contain key-value pairs that correspond to {length: frequency} format. The Key is that length and the value is the number of words with such length.
```js
collection.countBy(word => word.length)
```
4. Then for each key (length) in resulting colelction I will grab words with this length and construct an object with a key value pair again. The object Key will be length of words, and Value will be array of words of such length.
```js
collection.keys().each((key) => {
    result[key] = collection.filter((word) => word.length == key).all();
});
```
5. Finally, work is done now its time to format result nicely.

```js
Object.entries(result).forEach((pair, i, arr) => {
    resultStr += `${pair[1].length} words with length ${pair[0]} (${pair[1]})\n`; 
});
// Output: 
// 2 words with length 1 (O,a)
// 1 words with length 2 (Hi)
// 3 words with length 3 (Car,Car,and)
// 4 words with length 4 (this,test,Deer,Bear)
// 1 words with length 5 (River)
```
Resulting function for calculating word length and combining words with same length:
```js
function getWords(data, log = false) {
    return new Promise((resolve, reject) => {
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
```
Its a good idea to wrap the result in promise since calculation might be heavy and reouter shall not wait (blocking call) for the calculation part, but go to next request (maybe there are several clients requesting calculation) and process next input string. The call will be awaited and returned when promise resolves calculations and formatting. Safe.


