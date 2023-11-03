import { ridersDocName } from "@/utils/constants";
import { getQuestionsFromSheet } from "@/utils/gsheet";
import {
  QuestIncentive,
  EditProfile,
  SurgeFee,
  MainMenu,
  IncomeTracker,
  AnswerResponse,
  LikeDislikeMainMenu,
} from "./menus";

import { getAnswer } from "@/utils/openai";
import { updateUser } from "@/utils/firebase";
import { getSurgeData } from "./surge";
import { getQuestData } from "./quest";

const mainMenuButton = {
  reply_markup: {
    resize_keyboard: false,
    inline_keyboard: [
      [
        {
          text: "📋 Back to Main Menu ⬅️",
          callback_data: "handleBackToMainMenu:Talk with PawLee",
        },
      ],
    ],
  },
};
// return await defaultResponse(ctx, "Sorry, I did not understand your request.");

export async function handleBackToMainMenu(ctx, param) {
  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n\n ${msg} \n\n Please choose one of the following to continue... \n\nThanks`,
    MainMenu
  );
}

export const actions = [
  {
    action: "handleTalkToPawlee",
    description: "Chat Pawlee",
    func: async (ctx, bot, param) => {
      console.log("handleTalkToPawlee ------", ctx);
      const keyboard = {
        //   reply_to_message_id: ctx.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🌧️ Tips for riding in rain 🌧️",
                callback_data: "replyFromPawlee:Tips for riding in rain",
              },
            ],
            [
              {
                text: "⛽ How to save fuel? ⛽",
                callback_data: "replyFromPawlee:How to save fuel?",
              },
            ],
            [
              {
                text: "💰 Tips for saving money? 💰",
                callback_data: "replyFromPawlee:Tips for saving money?",
              },
            ],
          ],
        },
      };

      await updateUser(
        {
          telegramId: ctx.from.id,
          lastCommand: "talk",
        },
        ridersDocName
      );

      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      await bot.sendMessage(
        telegramId,
        `Hi ${ctx.from.first_name}! 👋 \nI am PawLee, I'm here to assist you in finding information quickly and easily, making your work more efficient`,
        keyboard
      );
      return await bot.sendMessage(
        telegramId,
        `\n\n Ask me anything work-related, and I'll provide the best answer I can!`
      );
    },
  },
  {
    action: "replyFromPawlee",
    description: "Chat with Pawlee",
    func: async (ctx, bot, param) => {
      console.log("replyFromPawlee ------", param);
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      const answer = await getAnswer(param, bot);
      // const answer = "The answer is coming for " + param;
      return await bot.sendMessage(telegramId, answer, AnswerResponse);
    },
  },
  {
    action: "answerResponse",
    description: "Response to answer",
    func: async (ctx, bot, param) => {
      console.log("answerResponse ------", param);
      await updateUser(
        {
          telegramId: ctx.from.id,
          lastCommand: "none",
        },
        ridersDocName
      );

      return await bot.sendMessage(
        ctx.from.id,
        `It was pleasure talking to you ${ctx?.from?.first_name}, let's talk again soon.`,
        MainMenu
      );
    },
  },
  {
    action: "handleIncomeTracker",
    description: "Send announcements",
    func: async (ctx, bot, param) => {
      await bot.sendMessage(
        ctx.from.id,
        `\n Hey ${ctx?.from?.first_name}, 👋 Juggling multiple sources of income can be a hassle. Let me simplify things for you by putting everything in one place!`
      );
      await bot.sendMessage(
        ctx.from.id,
        `\n Just share your income statements, and we'll provide a summary of your earnings.`
      );
      return await bot.sendMessage(
        ctx.from.id,
        `\n Plus, by sharing, you'll unlock constant access to all PawLee features. Work smarter, not harder. Are you ready?`,
        IncomeTracker
      );
    },
  },

  {
    action: "handleIncomeTrackerGoal",
    description: "Send announcements",
    func: async (ctx, bot, param) => {
      return await bot.sendMessage(ctx.from.id, `\n income goal is ${param}`);
    },
  },
  {
    action: "handleAnnouncements",
    description: "Send announcements",
    func: async (ctx, bot, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `\n You can make extra money 💵 to work during surge hours 🏃‍♂️, Please choose the surge time for extra fee 💰... `,
        SurgeFee
      );
    },
  },
  {
    action: "handleMainMenu",
    description: "Go to main menu",
    func: async (ctx, bot, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `\n Please choose one of the following to continue... `,
        MainMenu
      );
    },
  },

  {
    action: "handleProfile",
    description: "Edit profile",
    func: async (ctx, bot, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `Please choose the profile detail to edit..\n`,
        EditProfile
      );
    },
  },
  {
    action: "handleUpdateProfile",
    description: "Update the  profile",
    func: async (ctx, bot, param) => {
      const keyValue = param.split("\n");
      console.log(`handleUpdateProfile ${keyValue}`);
      await updateUser(
        {
          telegramId: ctx.from.id,
          [keyValue[0]]: keyValue[1],
        },
        ridersDocName
      );

      return await bot.sendMessage(
        ctx.from.id,
        `${keyValue[0]} is now updated to ${keyValue[1]}`,
        MainMenu
      );
    },
  },
  {
    action: "handleEditProfile",
    func: async (ctx, bot, param) => {
      const questions = await getQuestionsFromSheet(
        process.env.GOOGLE_SHEET_RIDER_ONBOARDING_SURVEY,
        ctx.from.language_code
      );

      let EditProfileDetails = {
        reply_markup: {
          resize_keyboard: false,
          inline_keyboard: [
            [
              {
                text: "📋 Back to Main Menu ⬅️",
                callback_data: "handleMainMenu:Company",
              },
            ],
          ],
        },
      };
      const answerButtons = questions[param].answers.map((answerGroup) =>
        answerGroup.map((answer) => ({
          text: answer.text,
          callback_data: `handleUpdateProfile:${questions[param].key}\n${answer.text}`,
        }))
      );

      EditProfileDetails.reply_markup.inline_keyboard.unshift(...answerButtons);

      return await bot.sendMessage(
        ctx.from.id,
        `Please choose from following options to continue ...\n`,
        EditProfileDetails
      );
    },
  },
  {
    action: "handleExtraEarnings",
    description: "Extra Earnings",
    func: async (ctx, bot, param) => {
      console.log("handleExtraEarnings ------", ctx);
      return replyWithId(
        ctx.from.id,

        `⚠️RULES OF THE WEEK⚠️
      
      We are JUST paying for:
      👉Payslips from 11:00 am to 2 pm and
           5:00 pm to 8 pm
      👉Payslips from the 🔟 days before Today
      👉Grab and Deliveroo payslips`
      );
    },
  },
  {
    action: "handleIncentives",
    description: "Handle Incentives",
    func: async (ctx, bot, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `Which week of quest incentive you want to see?\n`,
        QuestIncentive
      );
    },
  },
  {
    action: "LikeDislikeMainMenu",
    description: "Handle Incentives",
    func: async (ctx, bot, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `choose the action below\n`,
        MainMenu
      );
    },
  },
  {
    action: "handleQuestIncentive",
    description: "Handle Quest Incentives",
    func: async (ctx, bot, param) => {
      console.log("---- get quest incentive---", param);
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      const message = await getQuestData(
        ctx.user.company,
        ctx.user.zone,
        ctx.user.vehicle,
        param
      );
      //in the below function, check the param and pull the data for that duration
      //quest incentives and show below
      return await bot.sendMessage(telegramId, message, LikeDislikeMainMenu);
    },
  },
  {
    action: "handleSurgeFee",
    description: "Handle Incentives",

    func: async (ctx, bot, param) => {
      // console.log(ctx, param);
      const announcement = await getSurgeData(
        ctx.user.company,
        ctx.user.zone,
        param.trim()
      );
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;

      return await bot.sendMessage(
        telegramId,
        announcement,
        LikeDislikeMainMenu
      );
    },
  },
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
  {
    action: "handleFuelCredit",
    func: async (ctx, param) => {
      await bot.sendMessage(ctx.from.id, `Hi ${ctx.from.first_name}`);
      return await bot.sendMessage(
        ctx.from.id,
        `Sure, I will contact you within 24 hours.`,
        MainMenu
      );
    },
  },
  {
    action: "handleHelp",
    func: async (ctx, bot, param) => {
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      try {
        console.log("handle the help--------------------------------", ctx);
        const imageUrl =
          "https://firebasestorage.googleapis.com/v0/b/gns-gpt-bot.appspot.com/o/assets%2Fpawlee-2-tutorial.png?alt=media&token=64da5765-8fa9-4dca-bee2-d5fb0f37d77d";
        const a = await bot.sendPhoto(telegramId, imageUrl);
        return await bot.sendMessage(
          telegramId,
          "Did you like this help?",
          LikeDislikeMainMenu
        );
        return true;
      } catch (e) {
        console.log(e);
      }
    },
  },
  {
    action: "handleReceipt",
    func: async (ctx, bot, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `This is receipt send funciton ${param}\n`
      );
    },
  },
];
