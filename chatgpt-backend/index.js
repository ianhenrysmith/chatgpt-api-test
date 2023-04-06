const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { userMessage } = req.body;

  const systemPrompt = "You are an expert bookkeeper and love to extract payroll information from emails your clients send you. Please take these client emails and return valid JSON of hours worked for a payroll."

  const trainingMessage1 = `
Raw text content:  
Here are the hours worked by employees during the pay period from 2023-04-01 to 2023-04-15:

David Sherman: 36 hours
Catherine Martin: 52 hours
Michelle Fernandez: 58 hours
Jessica Bailey: 42 hours
Sandra Diaz: 50 hours

-------------
ID mappings:
David Sherman: b8d9635c113ec31e
Catherine Martin: 8c3d846e2abe7d84
Michelle Fernandez: f5fc745ff055b136
Jessica Bailey: 25c19e9c1f1da42b
Sandra Diaz: fd4513f7f2053880
`
  const trainingAnswer1 = `{"b8d9635c113ec31e": 36, "8c3d846e2abe7d84": 52, "f5fc745ff055b136": 58, "25c19e9c1f1da42b": 42, "fd4513f7f2053880": 50}`

  const questionText = `
Raw text content:
Here are the hours worked by employees during the pay period from 2023-04-01 to 2023-04-15:

Joshua Jones: 32 hours
Michelle Cruz: 32 hours
Ryan Rollins MD: 55 hours
Melanie Jones: 52 hours
Michael Rice: 22 hours
-----------------
ID mappings:
Joshua Jones: 45c7e22e594a24e0
Michelle Cruz: 789852dfc500c1a3
Ryan Rollins MD: bb9897bc051e158c
Melanie Jones: a4ec45b62cebded3
Michael Rice: 52994827de25cd8e
`
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: trainingMessage1 },
    { role: "assistant", content: trainingAnswer1 },
    { role: "user", content: questionText }
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const assistantMessage = response.data.choices[0].message.content.trim();
    res.json({ assistantMessage });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch response from ChatGPT API" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
