import { PineconeClient } from "@pinecone-database/pinecone";
const { Configuration, OpenAIApi } = require("openai");

const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_GNS,
});

const openai = new OpenAIApi(openAiConfig);

export default async function handler(req, res) {
  // console.log(req.body);
  // Split the whole text by new line
  let lines = req.body.trim().split("\n");
  // Remove empty lines and empty spaces at the beginning and end of each line
  lines = lines.filter((row) => row != "").map((line) => line.trim());

  try {
    const client = new PineconeClient();
    // Initialize the client
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENV_NAME,
    });

    const index = client.Index(process.env.PINECONE_ENV_INDEX_NAME);

    const embeddings = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: lines,
    });

    const vectors = embeddings.data.data.map((item) => ({
      id: item.index.toString(),
      values: item.embedding,
      metadata: { text: lines[item.index] },
    }));
    console.log("vectors created ", vectors.length);

    const namespace = "little-lon";
    const upsertRes = await index
      .upsert({
        vectors,
        namespace,
      })
      .catch((err) => {
        console.error(err);
        return res.status(200).json({ failed: err.message });
      });
  } catch (error) {
    console.error(error, error.message);
  }
  res.status(200).json({ answer: "data" });
}

// export default async function handler(req, res) {
//   // console.log(req.body);
//   // Split the whole text by new line
//   let lines = req.body.trim().split("\n");
//   // Remove empty lines and empty spaces at the beginning and end of each line
//   lines = lines.filter((row) => row != "").map((line) => line.trim());

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i].trim();
//     console.log(line);
//     try {
//       const client = new PineconeClient();
//       // Initialize the client
//       await client.init({
//         apiKey: process.env.PINECONE_API_KEY,
//         environment: process.env.PINECONE_ENV_NAME,
//       });

//       const index = client.Index(process.env.PINECONE_ENV_INDEX_NAME);

//       const embeddings = await openai.createEmbedding({
//         model: "text-embedding-ada-002",
//         input: [line],
//       });

//       const vectors = embeddings.data.data.map((item) => ({
//         id: item.index.toString(),
//         values: item.embedding,
//         metadata: { text: line },
//       }));
//       console.log("vectors created ", vectors.length);

//       const namespace = "little-lon";
//       const upsertRes = await index
//         .upsert({
//           vectors,
//           namespace,
//         })
//         .catch((err) => {
//           console.error(err);
//           return res.status(200).json({ failed: err.message });
//         });
//     } catch (error) {
//       console.error(error, error.message);
//     }
//   }
//   res.status(200).json({ answer: "data" });
// }
