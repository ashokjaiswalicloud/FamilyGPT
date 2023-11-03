import axios from "axios";
const TelegramBot = require("node-telegram-bot-api");
import { getUser, updateUser } from "@/utils/firebase/";

import {
  handleCommand,
  handleAction,
  handleDocuments,
  handlePhotos,
  handleVoice,
} from "./handlers";

const botCommands = [
  {
    command: "/reset",
    func: async (ctx, param, bot, docName) => {
      console.log("reset the survey");
      await updateUser(
        {
          telegramId: ctx.from.id,
          lastCommand: "none",
          questionIndex: "1",
        },
        docName
      );
      await bot.sendMessage(
        ctx.from.id,
        `${ctx.from.first_name}, Your survey has been reset, /start to take the survey again!!`
      );
      return true;
    },
  },
];

export async function botHandler(
  request,
  response,
  botId,
  docName,
  commands,
  actions,
  onMessage,
  onDocument,
  onPhoto,
  onVoice
) {
  try {
    let ctx = request.body.callback_query || request.body.message;
    ctx.user = await getUser(
      {
        telegramId: ctx.from.id,
      },
      docName
    );

    const bot = new TelegramBot(botId);
    let result = false;
    if (request.body.callback_query)
      return response.send(await handleAction(ctx, bot, actions));

    if (ctx.photo) {
      const photo = await handlePhotos(ctx, bot, docName);

      if (onPhoto)
        return response.send(await onPhoto(ctx, bot, docName, photo.buffer));

      return response.send(`Photos saved successfully ${photo.savedUrl}`);
    }

    if (ctx.document) {
      console.log(ctx.document);
      const doc = await handleDocuments(ctx, bot, docName);
      console.log(doc);

      if (onDocument)
        return response.send(await onDocument(ctx, bot, docName, doc.buffer));

      return response.send(`Document saved successfully ${ctx.document}`);
    }

    if (ctx.voice) {
      const voice = await handleVoice(ctx, bot, docName);

      if (onVoice)
        return response.send(await onVoice(ctx, bot, docName, voice));

      return response.send(`Photos saved successfully ${photo.savedUrl}`);
    }

    if (ctx.entities && ctx.entities[0].type === "bot_command") {
      await updateUser(
        {
          telegramId: ctx.from.id,
          lastCommand: ctx.text,
        },
        docName
      );
      return response.send(
        await handleCommand(ctx, bot, botCommands.concat(commands), docName)
      );
    }

    if (onMessage) return response.send(await onMessage(ctx, bot));
    await bot.sendMessage(
      ctx.chat.id,
      `Thanks for your message ${ctx.chat.first_name}! Let me get back to you asap...`
    );
    return response.send("OK");
  } catch (error) {
    // await bot.sendMessage(
    //   ctx.chat.id,
    //   `huh!! Something went wrong, please try again later...`
    // );
    console.error("--------------------------------");
    console.log(error.message);
    return response.send("OK");
  }
}
