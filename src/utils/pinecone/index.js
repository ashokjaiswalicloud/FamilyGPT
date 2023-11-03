import axios from "axios";
import { getVector } from "@/utils/openai";
import { PineconeClient } from "@pinecone-database/pinecone";

export const getContext = async (namespace, question) => {
  console.log("getContext", namespace);
  const vector = await getVector(question);
  console.log(vector);
  const client = new PineconeClient();
  // Initialize the client
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENV_NAME,
  });

  const index = client.Index(process.env.PINECONE_ENV_INDEX_NAME);
  // const namespace = "little-lon";
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
  return context;
};
