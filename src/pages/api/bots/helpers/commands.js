import { helpersDocName } from "@/utils/constants";
import { updateUser } from "@/utils/firebase/";
import { getQuestionsFromSheet } from "@/utils/gsheet";

export const handleSurveyEnd = async (ctx, bot, lastAnswer) => {
  await updateUser(
    {
      telegramId: ctx.from.id,
      lastCommand: "none",
    },
    helpersDocName
  );
  bot.sendMessage(
    ctx.chat.id,
    `Congratulations 🎉👏 ${ctx.from.first_name}!! You successfully completed the Survey.`
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return bot.sendMessage(
    ctx.chat.id,
    `Please send QR code of your ${lastAnswer} account and we will send your $10 reward within 24 hours.`
  );

  return true; //showMainMenu(ctx, bot, "");
};

export async function handleSurveyStart(ctx, bot) {
  console.log("handleStartSurvey");
  let qIndex = ctx.user.questionIndex ? Number(ctx.user.questionIndex) : 0;

  const questions = await getQuestionsFromSheet(
    process.env.GOOGLE_SHEET_RIDER_ONBOARDING_SURVEY,
    ctx.from.language_code
  );

  console.log("handleStartSurvey 1", qIndex, questions.length);
  if (qIndex >= questions.length) return true;

  try {
    console.log("start the survey ", ctx.from.id);
    const userData = {
      telegramId: ctx.from.id,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
      language_code: ctx.from.language_code,
      questionIndex: 0,
    };

    console.log("update user in handleStartSurvey");
    const user = await updateUser(userData, helpersDocName);
    //   reply_to_message_id: ctx.message_id,
    await bot.sendMessage(ctx.chat.id, `👋 Hey ${ctx.from.first_name}!`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await bot.sendMessage(
      ctx.chat.id,
      `🤖 My name is Money Maid and I want to help make your life easier! My job is to help you keep track of your expenses and find ways to save money. 😃`
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await bot.sendMessage(
      ctx.chat.id,
      `If you help me answer few simple questions, you can earn $10. 💰💰`
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await bot.sendMessage(
      ctx.chat.id,
      `🏁 Tap on the Let's Go button below to get started 🏁`,
      {
        reply_markup: {
          force_reply: true,
          resize_keyboard: true,
          one_time_keyboard: false,
          keyboard: [[{ text: "🏁 " }, { text: "Let's Go " }, { text: "🏁 " }]],
        },
      }
    );
  } catch (e) {
    console.log("handleStartSurvey", e);
  }
}

export const commands = [
  {
    command: "/start",
    func: async (ctx, param, bot) => {
      console.log("handle the start command");
      const questions = await getQuestionsFromSheet(
        process.env.GOOGLE_SHEET_RIDER_ONBOARDING_SURVEY,
        ctx.from.language_code
      );

      if (ctx.user.questionIndex >= questions.length) {
        // return await showMainMenu(
        //   ctx,
        //   bot,
        //   "You already finished the survey, thank you!"
        // );
      }
      return await handleSurveyStart(ctx, bot);
    },
  },
  {
    command: "/paid",
    description: "set the status to paid",
    func: async (ctx, param, bot) => {
      console.log("pay the user");
      await updateUser(
        {
          telegramId: param,
          reward_paid: "yes",
        },
        helpersDocName
      );

      await bot.sendMessage(ctx.from.id, `User is paid`);
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
