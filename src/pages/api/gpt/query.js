import { PineconeClient } from "@pinecone-database/pinecone";

import axios from "axios";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_GNS,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  // Remove empty spaces at the beginning and end of each line
  let question = req.body.trim();
  console.log(question);
  // Create embeddings for the question
  try {
    const r = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: question,
    });

    // Get the embedding in the vector format that Pinecone expects
    const vector = r.data.data[0].embedding;

    const client = new PineconeClient();
    // Initialize the client
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENV_NAME,
    });

    const index = client.Index(process.env.PINECONE_ENV_INDEX_NAME);

    const namespace = "little-lon";
    // const queryRes = await index
    //   .query({
    //     vector,
    //     namespace,
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     return res.status(200).json({ failed: err.message });
    //   });

    // console.log(queryRes);
    const r2 = await axios({
      method: "post",
      url: `https://${process.env.PINECONE_BASE_URL}/query`,
      headers: {
        "Api-Key": process.env.PINECONE_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        vector,
        topK: 3,
        includeMetadata: true,
        // includeValues: true,
        namespace: namespace,
      },
    });
    // create the context from the top 3 results
    const context = r2.data.matches.map((item) => item.metadata.text).join();
    console.log("Context", context);

    // Create the prompt
    const prompt = `pretend you are 5 years old, answer the question like a poem and emojiis based on the context below.\n\nContext: ${context}\n\nQuestion: ${question}\n\nAnswer:`;

    // Ask OpenAI to complete the prompt
    const r3 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 108,
      temperature: 0.2,
    });
    return res.status(200).json({ answer: r3.data.choices[0].text });
  } catch (error) {
    console.error(error);
  }

  res.status(200).json({ answer: "OK" });
}
