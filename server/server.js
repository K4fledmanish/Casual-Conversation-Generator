import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'THIS IS SERVER SIDE !!!!!'
  })
})

app.post('/', async (req, res) => {
  try {
    const promptT = req.body.promptTopic;
    const promptW = req.body.promptWord;
    const promptC = req.body.promptComplex;
    const optionCheckboxes = req.body.optionCheckboxes;
    const optionCheckboxesA = req.body.optionCheckboxesA;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: ` 
      
      Write a casual conversation between two random people. The conversation should be in ${promptW} words, and the topic is ${promptT}. And using ${optionCheckboxes} and ${optionCheckboxesA} at a ${promptC} level.
      
      Suggestions:

      Start with a friendly greeting to break the ice.
      1. Use open-ended questions to encourage the conversation to flow naturally and explore different topics.
      2. Include pauses, interruptions, and other natural elements to make the conversation feel authentic.
      3. Use dialogue tags and descriptive language to create a vivid and engaging conversation.

      
   
      `,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 2048, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });



    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))