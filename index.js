import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('this is the server');
});

app.listen(3000, () => {
    console.log('server is listening on http://localhost:3000');
});

