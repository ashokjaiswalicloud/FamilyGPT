import { botHandler } from "..";
import { getContext } from "@/utils/pinecone";
import { getAnswerFromContext } from "@/utils/openai";
import { updateUser } from "@/utils/firebase";
//handleSurvey from inside the message
import axios from "axios";
import { FamilyRestroomOutlined } from "@mui/icons-material";

const { Configuration, OpenAIApi } = require("openai");
const api_key = "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"; //process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: api_key,
});
const openai = new OpenAIApi(configuration);

const lonDocName = "littlelon";

export const LikeDislikeMainMenu = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "👍",
          callback_data: "LikeDislikeMainMenu:Like",
        },
        {
          text: "👎",
          callback_data: "LikeDislikeMainMenu:Dislike",
        },
        {
          text: "🤐",
          callback_data: "LikeDislikeMainMenu:End",
        },
      ],
    ],
  },
};

const trainGpt = async (param) => {
  let lines = param.replace(/(^[ \t]*\n)/gm, ""); //param.trim().split("\n");
  lines = lines.trim().split("\n");
  // Remove empty lines and empty spaces at the beginning and end of each line
  lines = lines.filter((row) => row != "").map((line) => line.trim());

  console.log("----------------------------------");
  console.log(lines);
  console.log("----------------------------------");
  // for (let i = 0; i < lines.length; i++)
  {
    try {
      // Create embeddings for each line
      const r = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: lines,
        // input: lines[i],
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
      return false;
    }
  }
  return true;
};

export const commands = [
  {
    command: "/start",
    func: async (ctx, param, bot) => {
      await bot.sendMessage(
        ctx.from.id,
        `Hi ${ctx.from.first_name} ! My name is Little Lon, do you want to know about my adventures? Just ask anything you like...  `
      );
    },
  },
  {
    command: "/train",
    description: "set the status to paid",
    func: async (ctx, param, bot) => {
      // console.log("Train the bot\n\n", param);
      const ret = trainGpt(param);
      const axios = require("axios");
      let data = " the journey back home, Little Lon couldn't ";

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/api/gpt/train",
        headers: {
          "Content-Type": "text/plain",
        },
        data: data,
      };

      try {
        const res = await axios.request(config);
        console.log(res);
        return await bot.sendMessage(
          ctx.from.id,
          `Thanks ${ctx.from.first_name}, for teaching me this story \n ${res.data?.answer}`
        );
      } catch (error) {
        await bot.sendMessage(
          ctx.from.id,
          `Sorry ${ctx.from.first_name}, I ran into trouble '${error.message}'`
        );
      }
      let res = await axios.get("api/hello");
      console.log(res);
      if (!ret) {
        await bot.sendMessage(
          ctx.from.id,
          `Sorry ${ctx.from.first_name}, I ran into trouble ...`
        );
      }
      await updateUser(
        {
          telegramId: param,
          reward_paid: "yes",
        },
        lonDocName
      );

      await bot.sendMessage(
        ctx.from.id,
        `Thanks ${ctx.from.first_name}, I have taken your training..`
      );
      return true;
    },
  },
  {
    command: "/tutorial",
    description: "Learn to do less and save more 🔮",
    func: async (ctx, param, bot) => {
      const imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/gns-gpt-bot.appspot.com/o/assets%2Fpawlee-2-tutorial.png?alt=media&token=64da5765-8fa9-4dca-bee2-d5fb0f37d77d";
      const a = await bot.sendPhoto(ctx.chat.id, imageUrl);
      const message =
        "Press 👉 /menu to see all the options that I have for you.";
      await bot.sendMessage(ctx.from.id, message);
      return true;
    },
  },
  {
    command: "/unlock",
    description: "Unlock access to save 🔓",
    func: async (ctx, param, bot) => {
      const imageUrl =
        "https://firebasestorage.googleapis.com/v0/b/gns-gpt-bot.appspot.com/o/assets%2Fpawlee2-share-receipt.png?alt=media&token=06f2edda-b1af-4ae3-b104-eac2b31869bb";
      const a = await bot.sendPhoto(ctx.chat.id, imageUrl);
      const message =
        "Now, attach the requested pdf file by clicking the 📎 image on your device.";
      await bot.sendMessage(ctx.from.id, message);
      return true;
    },
  },
];

export const actions = [
  {
    action: "handleFuelCredit",
    func: async (ctx, bot, param) => {
      await bot.sendMessage(ctx.from.id, `Hi ${ctx.from.first_name}`);
      return await bot.sendMessage(
        ctx.from.id,
        `Sure, I will contact you within 24 hours.`,
        MainMenu
      );
    },
  },
];
export const onMessage = async (ctx, bot, lastAnswer) => {
  await bot.sendMessage(
    ctx.from.id,
    `${ctx.from.first_name}, give me second ....`
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    console.log("onMessage", ctx);
    console.log("handleMessage", ctx.text);

    const context = await getContext("little-lon", ctx.text);
    await bot.sendMessage(ctx.from.id, "so I got the following ...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await bot.sendMessage(ctx.from.id, context);
    const answer = await getAnswerFromContext(context, ctx.text);
    let lines = answer.trim().split("\n");
    console.log("------- the answer is ------", lines, lines.length);
    for (let i = 0; i < lines.length; i += 2) {
      lines[i + 1]
        ? await bot.sendMessage(ctx.from.id, lines[i] + "\n" + lines[i + 1])
        : await bot.sendMessage(ctx.from.id, lines[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
    return await bot.sendMessage(
      telegramId,
      "Hit the like button if you liked my answer..",
      LikeDislikeMainMenu
    );
  } catch (error) {
    return await bot.sendMessage(
      ctx.from.id,
      `Sorry ${ctx.from.first_name}!, something went wrong ${error.message}`
    );
  }
};

async function handler(request, response) {
  console.log("Little Lon bot handler received");
  return botHandler(
    request,
    response,
    process.env.LIL_LON_TELEGRAM_API_TOKEN,
    lonDocName,
    commands,
    actions,
    onMessage
  );
}

export default handler;
