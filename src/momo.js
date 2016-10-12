const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.post('/call', function (request, response, next) {
    console.log(request.body);
    response.json({'result' : 'success'});
});

app.listen(9000, function () {
    console.log("Server Running at http://127.0.0.1:9000");
});