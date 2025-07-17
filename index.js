
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

//app.options('*', cors());
//TODO: is this the problem?

//Dev
app.use(cors());




app.use(morgan('dev'));

app.use(express.json());


// Test GET Endpoint - may need a get feature in the future.
app.get('/', (req, res) => {
    res.send('server is ready');
});


// Test POST endpoint - may need a standard post feature in the future.
app.post('/', (req, res) => {   

    console.log(req.body);

    const question = req.body.data.question.trim();

    var cleanedText = question.replace(/\s+/g, '');

    const charCount = cleanedText.length;

    console.log(charCount, question);

    //const data = req.body.question;


    res.json({
      
        success: charCount,
        payload: question,
        response_id: Math.floor(Math.random() * 100)
    });

});


// Email Endpoint
app.post('/email', (req, res) => {

    console.log(req.body);

    const subject = req.body.subject;
    const recipient = req.body.recipient;
    const text = req.body.text;

    console.log(subject, recipient, text);

try {

    if(subject && recipient && text){

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            },
        });

        transporter.sendMail({

            from: email,
            to: recipient,
            subject: subject,
            text: text

        }, function(error, info){

            if(error){

                console.log(error);

                res.status(500).send({
                    success: false,
                    payload: error,
                });

            } else{

                console.log(info);

                res.status(200).send({
                    success: true,
                    payload: info,
                });
            }
        })
    
    } else {

        res.status(400).send({
            success: false,
            payload: "Necessary fields not completed."
        });
    }

}catch{
    res.status(500).send({
        success: false,
        payload: "email send failed."
    });

}

})


// API Endpoint 
app.post('/api', async(req, res) => {

console.log(req.body.data);
    const request = req.body.data.question.trim();

    

    var previous_id;

    try{

        if(req.body.data.previous_id != null){

            previous_id = req.body.data.previous_id;

        }else {

            previous_id = null;
       
        }

        console.log(previous_id);

        const response = await client.responses.create({
            model: "gpt-4.1-nano",
            input: request,
            max_output_tokens: 800,
            previous_response_id: previous_id
        });

        console.log(response);
        console.log(response.output_text);
        console.log(response.id)

        if(response.output_text){

            res.status(200).send({
                success: true,
                payload: response.output_text,
                response_id: response.id
            })

        }else {

            res.status(400).send({
                success: false,
                payload: "bad request",
                response_id: ""
            })
        }

    }catch(err){

        console.log(err)

        res.status(500).send({
            success: false,
            payload: "message send failed",
            response_id: ""
        });
    }
})


app.post('/image', async(req, res) => {
    console.log(req.body.data);

    const request = req.body.data.question;

    var previous_id;

    if(req.body.data.previous_id != null){

        previous_id = req.body.data.previous_id;

    }else{

        previous_id = null;
    }


    try{

        const response = await client.images.generate({
            model: "dall-e-3",
            prompt: request,
            n: 1,
            size: "1024x1024"
        });

        console.log('226', response);

        if(response.data[0].url){

            const imageUrl = response.data[0].url;

            res.status(200).send({
                success: true,
                payload: imageUrl,
                response_id: null
            })

        }else{

            res.status(500).send({
                success: false,
                payload: "bad request",
                response_id: null
            })
        }

    }catch(err){

        console.log('249', err);

        res.status(400).send({
            success: false,
            payload: err.message || JSON.stringify(err),
            response_id: null
        })
    }



})



app.listen(3000, () => {
    console.log('server is listening on PORT 3000');
});

