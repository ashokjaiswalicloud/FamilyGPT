import { showMainMenu } from "@/utils/constants";

import { updateUser } from "@/utils/firebase";
import { getQuestionsFromSheet } from "@/utils/gsheet";

const handleQuestion = async (
  ctx,
  bot,
  question,
  msg = "",
  show_keyboard = false
) => {
  let { question: text, answers } = question;
  // text = msg ? msg + "\n" + text : text;
  //   reply_to_message_id: ctx.message_id,
  if (msg) await bot.sendMessage(ctx.chat.id, msg);

  return await bot.sendMessage(ctx.chat.id, text, {
    reply_markup: {
      // force_reply: true,
      resize_keyboard: true,
      one_time_keyboard: show_keyboard,
      keyboard: answers,
    },
  });
};

export async function handleSurvey(
  ctx,
  bot,
  docName,
  sheetId,
  handleSurveyEnd
) {
  let qIndex = ctx.user.questionIndex ? Number(ctx.user.questionIndex) : 0;
  console.log("handleSurvey", sheetId, docName, ctx, qIndex);

  const questions = await getQuestionsFromSheet(
    sheetId,
    ctx.from.language_code
  );

  //its the let's go message, nothing to be done
  if (qIndex === 0) {
    console.log("update user la");
    await updateUser(
      {
        telegramId: ctx.from.id,
        questionIndex: qIndex + 1,
      },
      docName
    );
    return handleQuestion(
      ctx,
      bot,
      questions[qIndex],
      "",
      qIndex >= questions.length - 1
    );
  }
  console.log("Handling question", questions.length, qIndex);

  console.log(
    "surveyResponse question is ",
    [questions[qIndex - 1].key],
    " answer is ",
    ctx.text
  );
  const isAnswerCorrect = questions[qIndex - 1].answers.some((answerGroup) =>
    answerGroup.some((answer) => answer.text === ctx.text)
  );

  if (!isAnswerCorrect) {
    return handleQuestion(
      ctx,
      bot,
      questions[qIndex - 1],
      `"${ctx.text}" is invalid answer, please choose one of the following... \n\n`,
      qIndex >= questions.length - 1
    );
  }

  console.log(`--- update ${questions[qIndex - 1].key}: ${ctx.text}`);
  await updateUser(
    {
      telegramId: ctx.from.id,
      questionIndex: qIndex + 1,
      [questions[qIndex - 1].key]: ctx.text,
    },
    docName
  );

  if (qIndex >= questions.length) {
    if (handleSurveyEnd) return handleSurveyEnd(ctx, bot, ctx.text);
  }
  return handleQuestion(
    ctx,
    bot,
    questions[qIndex],
    "",
    qIndex >= questions.length - 1
  );
}
