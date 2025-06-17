
import express from "express";
// import morgan from "morgan";
import cors from 'cors'

// require('dotenv').config();
import 'dotenv/config';

import OpenAI from "openai";

const client = new OpenAI({apiKey: 'My API Key'});

const app = express();

app.use(cors());

app.use(express.json());



app.get('/', (req, res) => {
    res.send('this is the server');
});

app.post('/', (req, res) => {
    console.log(req.body);

    const question = req.body.question.trim();

    var cleanedText = question.replace(/\s+/g, '');

    const charCount = cleanedText.length;

    console.log(charCount, req.body.question);

    res.json({
        "count": charCount, 
        "question": question
    });

})


app.post('api', async(req, res) => {

    const question = req.body.question.trim();

    console.log(question);

    const response = await client.responses.create({
        model: "gpt-4.1-nano",
        input: question
    });

    console.log(response);

})



app.listen(3000, () => {
    console.log('server is listening on PORT 3000');
});

