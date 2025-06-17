const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('this is the server');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send(req.body.question);
})

app.listen(3000, () => {
    console.log('server is listening on http://localhost:3000');
});

