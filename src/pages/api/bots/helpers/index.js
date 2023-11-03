import { handleSurvey } from "../handlers/survey";
import { helpersDocName } from "@/utils/constants";
import { botHandler } from "..";
import { commands, handleSurveyEnd } from "./commands";
import { handleQuestion } from "@/utils/openai";
import { photoToText, docToText } from "@/utils/parser";
import { getPhotoSummary } from "@/utils/openai";
//handleSurvey from inside the message

export const actions = [
  {
    action: "SaveEditDelete",
    func: async (ctx, bot, param) => {
      console.log("SaveEditDelete", ctx, param);
    },
    keyboard: {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "💾 Save",
              callback_data: "SaveEditDelete:Save",
            },
            {
              text: "✍️ Edit",
              callback_data: "SaveEditDelete:Edit",
            },
            {
              text: "🗑️ Delete",
              callback_data: "SaveEditDelete:Delete",
            },
          ],
        ],
      },
    },
  },
];

const onMessage = async (ctx, bot, lastAnswer) => {
  console.log("onMessage", ctx);
  if (ctx.user?.lastCommand === "talk") {
    await handleQuestion(ctx, bot);
    return response.send("OK");
  }

  if (ctx.user?.lastCommand === "/start") {
    return await handleSurvey(
      ctx,
      bot,
      helpersDocName,
      process.env.GOOGLE_SHEET_HELPER_ONBOARDING_SURVEY,
      handleSurveyEnd
    );
  }
  return await bot.sendMessage(
    ctx.chat.id,
    `\n Sorry I don't understand this message\n. Please choose one of the following to continue`
  );
};

async function handler(request, response) {
  console.log("Helpers bot handler received");
  return botHandler(
    request,
    response,
    process.env.HELPER_TELEGRAM_API_TOKEN,
    helpersDocName,
    commands,
    actions,
    onMessage,
    onDocument,
    onPhoto,
    onVoice
  );
}
//https://youtu.be/1xQ7Xj6cEOw
//https://pipedream.com/apps/ibm-cloud-speech-to-text/integrations/telegram-bot-api
//https://betterprogramming.pub/whisper-gpt3-5-telegram-bot-j-a-r-v-i-s-794e19da6ee3
const onVoice = async (ctx, bot, docName, voiceToText) => {
  console.log(`onVoice ${voiceToText}`);
  await bot.sendMessage(
    ctx.from.id,
    `${ctx.from.first_name}! I found following data in the image`
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await bot.sendMessage(ctx.from.id, voiceToText);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await bot.sendMessage(
    ctx.from.id,
    "What would you like to do?",
    actions[0].keyboard
  );
};
const onDocument = async (ctx, bot, docName, buffer) => {
  console.log("onDocument");
  const lines = await docToText(buffer);
  // const summary = await getPhotoSummary(text);
  await bot.sendMessage(
    ctx.from.id,
    `${ctx.from.first_name}! I found following data in the image`
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // const lines = text.split("\n").map((line) => line.trim());
  for (let i = 0; i < lines.length; i += 5) {
    await bot.sendMessage(
      ctx.from.id,
      lines[i] + lines[i + 1] + lines[i + 2] + lines[i + 3] + lines[i + 4]
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  // await bot.sendMessage(ctx.from.id, summary);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await bot.sendMessage(
    ctx.from.id,
    "What would you like to do?",
    actions[0].keyboard
  );
};
const onPhoto = async (ctx, bot, docName, buffer) => {
  const text = await photoToText(buffer);
  const summary = await getPhotoSummary(text);
  await bot.sendMessage(
    ctx.from.id,
    `${ctx.from.first_name}! I found following data in the image`
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await bot.sendMessage(ctx.from.id, summary);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await bot.sendMessage(
    ctx.from.id,
    "What would you like to do?",
    actions[0].keyboard
  );
};

export default handler;
