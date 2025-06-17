//const express = require('express');
import express from "express";
// import morgan from "morgan";
import cors from 'cors'

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('this is the server');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.json(req.body.question);
})

app.listen(3000, () => {
    console.log('server is listening on http://localhost:3000');
});

