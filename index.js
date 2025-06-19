
import express from "express";
import morgan from "morgan";
import cors from 'cors'
import nodemailer from 'nodemailer';
import 'dotenv/config';
import OpenAI from "openai";
import {env} from 'node:process';

const email = env.EMAIL;
const password = env.EMAIL_PASS;
const api_key = env.GPT_KEY;

const client = new OpenAI({apiKey: api_key});

const app = express();



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

    //const question = req.body.question.trim();

    //var cleanedText = question.replace(/\s+/g, '');

    //const charCount = cleanedText.length;

    //console.log(charCount, req.body.question);

    const data = req.body.content[0].question;

    console.log(req.body.content[0])

    res.json({

         success: true,
        payload: data,
        response_id: data
      
        // success: charCount,
        // payload: question,
        // response_id: "55aa"
    });

});


// Email Endpoint
app.post('/email', (req, res) => {

    console.log(req.body);

    const subject = req.body.subject;
    const recipient = req.body.recipient;
    const text = req.body.text;

    console.log(subject, recipient, text);

    if(subject && recipient && text){

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
            text: text

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
app.post('/api', async(req, res) => {

    console.log(req.body);

    const question = req.body.question.trim();

    console.log(req.body);

    // var previous_id;

    // if(req.body.previous_id != null){

    //     previous_id = req.body.previous_id;

    // }else {

    //     previous_id = "";
       
    // }

    console.log(question);

    const response = await client.responses.create({
        model: "gpt-4.1-nano",
        input: question,
        max_output_tokens: 100,
        // previous_response_id: previous_id
    });

    console.log(response);
    console.log(response.output_text);
    console.log(response.id)

    if(response.output_text){

        res.json({
            success: true,
            payload: response.output_text,
            response_id: response.id
        })

    }else {

        res.json({
            success: false,
            payload: "bad request",
            response_id: ""
        })
    }



})



app.listen(3000, () => {
    console.log('server is listening on PORT 3000');
});

