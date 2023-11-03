import { handleSurvey } from "../handlers/survey";
import { ridersDocName } from "@/utils/constants";
import { botHandler } from "..";
import { MainMenu } from "./menus";
import { commands, handleSurveyEnd } from "./commands";
import { actions } from "./actions";
import { handleQuestion } from "@/utils/openai";
//handleSurvey from inside the message

export const onMessage = async (ctx, bot, lastAnswer) => {
  console.log("onMessage", ctx);
  if (ctx.user?.lastCommand === "talk") {
    return await handleQuestion(ctx, bot);
  }

  if (ctx.user?.lastCommand === "/start") {
    return await handleSurvey(
      ctx,
      bot,
      ridersDocName,
      process.env.GOOGLE_SHEET_RIDER_ONBOARDING_SURVEY,
      handleSurveyEnd
    );
  }
  console.log("onMessage - send default message");
  bot.sendMessage(
    ctx.chat.id,
    `Please choose one of the following to continue`,
    MainMenu
  );
};

async function handler(request, response) {
  console.log("Riders bot handler received");
  return botHandler(
    request,
    response,
    process.env.RIDERS_TELEGRAM_API_TOKEN,
    ridersDocName,
    commands,
    actions,
    onMessage
  );
}

export default handler;
