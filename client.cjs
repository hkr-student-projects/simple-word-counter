const { post } = require('axios');

const data = {
    data: 'O Hi this a test Car River Deer Car Bear and'
};

post('http://127.0.0.1:3000/getWordLengthFrequency', data)
    .then((res) => {
        console.log("Sent data: " + data.data + "\n\n-----|Received data|-----\n" + res.data);
    }).catch((err) => {
        console.error(err);
    });



