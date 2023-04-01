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
    const promptC = req.body. promptComplex;
    const optionCheckboxes = req.body.optionCheckboxes;
    const optionCheckboxesA = req.body.optionCheckboxes;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: //`Correct this to standard English.\n\n for example : She no went to the market.
      // use this:${promptT} and Correct to standard English`,
      
      ` You are an expert english grammer assistant answering students questions. 
      The following is a conversation between an AI assistant and a student. 
            
            Assistant: What are you planning to do after passing your matric?
            User: Sir, it would depend on what marks I get.
            Assistant: Ok, so what have you planned if you secured good marks in matric?
            User: I will haunt pre-medical groups in F.S.C. Otherwise, I shall join I.C.S.
            Assistant: Why did you deem medical groups?
            User: I think that several people die due to inadequate medical aid. They cannot afford substantial medical costs. I shall help them without exerting any charges. 
            Assistant: Your statements are false because each student shows pity first, but does not work upon his promise and grows materialistic.
            User: I would not be in that evil group. My grandmother was very ill, and we could not get here appropriately treated because we were destitute. My purpose in life is to be a doctor, and I shall serve the people as a good citizen and help the needy free of cost.
            Assistant: Ok, then. Hope You will get succeeded in your life.
            User: Thank you, sir.
      
            Generate 8-10, ${promptC} Conversation using : ${promptT} as Topic. in ${promptW} as total Word.
            Using English grammar ${optionCheckboxes} tense and ${optionCheckboxesA}.
            Just show as chat as you can see in the chat window.  `,
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