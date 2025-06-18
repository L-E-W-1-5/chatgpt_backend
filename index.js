
import express from "express";
import morgan from "morgan";
import cors from 'cors'
import nodemailer from 'nodemailer';
import 'dotenv/config';
import OpenAI from "openai";
import {env} from 'node:process';

const client = new OpenAI({apiKey: 'My API Key'});

const app = express();

const email = env.EMAIL;
const password = env.EMAIL_PASS;

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());


// Test GET Endpoint - may need a get feature in the future.
app.get('/', (req, res) => {
    res.send('this is the server');
});


// Test POST endpoint - may need a standard post feature in the future.
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

});


// Email Endpoint
app.post('/email', (req, res) => {

    console.log(req.body);

    const subject = req.body.subject;
    const recipient = req.body.recipient;
    const content = req.body.content;

    console.log(subject, recipient, content);

    if(subject && recipient && content){

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            },
        });

        transporter.sendMail({

            from: `email from`,
            to: recipient,
            subject: subject,
            text: content

        }, function(error, info){

            if(error){

                console.log(error);

                res.send({
                    success: false,
                    payload: error,
                });

            } else{

                console.log(info);

                res.send({
                    success: true,
                    payload: info,
                });
            }
        })
    } else {

        res.send({
            success: false,
            payload: "Necessary fields not completed."
        })
    }
})


// API Endpoint 
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

