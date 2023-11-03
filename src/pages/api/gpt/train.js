import axios from "axios";
const { Configuration, OpenAIApi } = require("openai");
const api_key = "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"; //process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: api_key,
});
const openai = new OpenAIApi(configuration);

const paras = [
  `One sunny afternoon, while playing in their backyard, Little Lon stumbled upon a map buried under a pile of leaves. The map was old and worn, but Little Lon knew that it was something special. Excited by the discovery, Little Lon called their two best friends, Zuri and Nova, to join them on an adventure deep into the jungle.`,
  `As they ventured further, the dense jungle trees towered above them, casting a dappled shadow on the ground. Little Lon's heart raced with both excitement and trepidation. The thrill of the unknown, mixed with the possibility of danger, made every step of their journey exhilarating.`,
  `Their journey was not without its challenges, and they encountered a deep ravine that seemed impossible to cross. Zuri questioned how they would overcome this obstacle, but Nova quickly pulled out a rope from her backpack, and with quick thinking, they used it to swing across the ravine.`,
  `Further down the path, they faced an even greater challenge, a tall mountain that towered above them. It looked like a daunting climb, and Little Lon could feel the doubt creeping in. However, Zuri's encouragement pushed them forward, and with determined grit, they conquered the rocky peak.`,
  `ust when they thought they'd overcome their biggest obstacle yet, they encountered a raging river that they could not cross. They took a moment to collect their thoughts and come up with a solution. Little Lon proposed building a raft, and with their combined efforts, they quickly built a sturdy raft, which they used to cross the river safely.`,
  `As they continued their journey, the sun began to set, and they set up camp for the night. They fell asleep, dreaming of the treasure that awaited them.`,
  `In the morning, The friends continued their journey, and soon they heard the sound of rushing water. They knew they were close to the treasure. The sound grew louder and louder until they came to a large waterfall. As they approached, they saw something magical in the crystal-clear water below. It was a group of friendly mermaids, splashing and playing in the pool.`,
  `Little Lon, Zuri, and Nova couldn't believe their eyes. They had never seen mermaids before! The mermaids swam over to the friends and welcomed them to the pool. They even helped the friends retrieve the treasure chest from the bottom of the pool.`,
  `When they opened the chest, they found an old journal filled with stories and drawings of the previous adventurers who had found the treasure. Little Lon was fascinated by the stories and drawings and turned to their friends. "We should add our own adventure to this journal, so others can enjoy it too," they said`,
  `The friends decided to leave their own mark on the journal and add their own stories and drawings to inspire others to go on their own adventures. They buried the journal back in the jungle, hoping it would be found by another group of adventurers.`,
  `On the journey back home, Little Lon couldn't stop thinking about their adventure and the journal. "I can't wait to add more stories to the journal," Little Lon said, looking at their friends. "Me too!" said Zuri and Nova, grinning.`,
  `As they reached home, they felt exhausted but exhilarated. They had gone on an incredible adventure, met friendly mermaids, and left their mark on the world. Little Lon couldn't wait to see what their next adventure would be and what stories they would add to the journal.`,
  `Now it’s your turn, what adventures would you like to go on and what stories would you like to write in your own journal? Let your imagination take you on a journey!`,
];
export default async function handler(req, res) {
  // console.log(req.body);
  // Split the whole text by new line
  let lines = req.body.trim().split("\n");
  // Remove empty lines and empty spaces at the beginning and end of each line
  lines = lines.filter((row) => row != "").map((line) => line.trim());

  // return res.status(200).json({ answer: lines });
  // for (let i = 0; i < lines.length; i++)
  {
    try {
      // Create embeddings for each line
      const r = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: lines,
      });

      console.log("created embedding");
      // Create the array of vectors in the format that Pinecone expects
      const vectors = r.data.data.map((item) => ({
        id: item.index.toString(),
        values: item.embedding,
        metadata: { text: lines[item.index] },
      }));

      console.log("got the vectors", vectors.length);
      // Upsert the vectors into Pinecone
      await axios({
        method: "post",
        url: `https://little-lon-a1b9d7c.svc.us-east1-gcp.pinecone.io/vectors/upsert`,
        headers: {
          "Api-Key": "bb6de713-094e-4c9e-b0e6-31aa40aecbfa",
          "Content-Type": "application/json",
        },
        data: { vectors, namespace: "little-lon" },
      });

      console.log("inserting the vectors");
      console.log("Upserted", vectors.length, "vectors");
    } catch (e) {
      console.log("error ", e, e.message);
    }
  }
  res.status(200).json({ answer: "data" });
}
