const { Configuration, OpenAIApi } = require("openai");
import { AnswerResponse } from "@/utils/constants";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_GNS,
});

export const getPhotoSummary = async (text) => {
  try {
    const openai = new OpenAIApi(configuration);

    const prompt = `Following data is scanned from an image, summarize this data \n
  ${text}
  Answer:`;

    const r3 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1024,
      temperature: 0.2,
    });

    return r3.data.choices[0].text;
  } catch (error) {
    console.log("----- openai error -----", error.message);
    return null;
  }
};

export const textToJson = async (json, text) => {
  const openai = new OpenAIApi(configuration);
  const prompt = `Answer the question in simple english \n\nQuestion: ${question}\n\nAnswer:`;

  const r3 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
    temperature: 0.2,
  });

  return r3.data.choices[0].text;
};

export const getAnswerFromContext = async (context, question) => {
  const openai = new OpenAIApi(configuration);

  console.log("getAnswerFromContext");
  // Create the prompt
  const prompt = `pretend you are 5 years old, answer the question like a poem and emojiis based on the context below.\n\nContext: ${context}\n\nQuestion: ${question}\n\nAnswer:`;

  // Ask OpenAI to complete the prompt
  const r3 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 1024,
    temperature: 0.2,
  });
  return r3.data.choices[0].text;
};

export const getAnswer = async (question, bot) => {
  console.log("get the answer", question);
  const openai = new OpenAIApi(configuration);
  const prompt = `answer the question in simple english for a delivery boy for food delivery platform\n\nQuestion: ${question}\n\nAnswer:`;

  const r3 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
    temperature: 0.2,
  });

  return r3.data.choices[0].text;
};

export const getVector = async (text) => {
  console.log("getVector", text);
  const openai = new OpenAIApi(configuration);
  const r = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });
  // Get the embedding in the vector format that Pinecone expects
  return r.data.data[0].embedding;
};
export const getReceiptData = async (scannedData) => {
  try {
    const openai = new OpenAIApi(configuration);

    const prompt = `Find time, date, startLocation, endLocation, stops, distance, payment,Method, netEarnings, deliveryFee, earningAdjustment, totalEarnings, tips and other important information in following data and convert it into a json key value pair \n
  ${scannedData}
  Answer:`;

    const r3 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1024,
      temperature: 0.2,
    });

    return JSON.parse(r3.data.choices[0].text);
  } catch (error) {
    console.log("----- openai error -----", error.message);
    return null;
  }
};

export const getReceiptData1 = async (scannedData) => {
  try {
    const openai = new OpenAIApi(configuration);

    const prompt = `Convert the following scanned OCR data from food delivery company rider's earning receipt into a JSON structured data:

  ${scannedData}

  {
    userId: "insert userId here",
    downloadUrl: "insert downloadUrl here",,
    user: {
      telegramId: "insert telegramId here",
      company: "insert company name here",
      vehicle: "insert vehicle type here",
      name: "insert name here",
      zone: "insert zone here"
    },
    time: "insert time here",
    date: "insert date here",
    location: {
      start: "insert start location here",
      end: "insert end location here",
      stops: "insert stops here"
    },
    distance: "insert distance here",
    payment: {
      method: "insert payment method here",
      netEarnings: "insert net earnings here",
      deliveryFee: "insert delivery fee here",
      earningAdjustment: "insert earning adjustment here",
      totalEarning: "insert total earning here",
      tip: "insert tip here"
    },
    status: "added",
    basket: "1.0",
    week: 88,
  }

  Answer:`;

    const r3 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1024,
      temperature: 0.2,
    });

    console.log(r3.data.choices);
    const jsonString = r3.data.choices[0].text;
    const jsonObject = JSON.parse(jsonString);
    console.log(jsonObject, typeof jsonObject);
    return jsonObject;
  } catch (error) {
    console.log("----- openai error -----", error.message);
    return null;
  }
};

export const handleQuestion = async (ctx, bot) => {
  console.log("handleQuestion------", ctx);
  const answer = await getAnswer(ctx.text);
  console.log("handleQuestion------", ctx);
  const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
  // const answer = "The answer is coming for " + param;
  return await bot.sendMessage(telegramId, answer, AnswerResponse);
};
