// import { handleSurveyStart } from "./survey";
// import { showMainMenu } from "@/utils/constants";

const handleCommands = async (ctx, bot, commands, docName) => {
  console.log("------ handleCommands----", ctx.entities[0].length);
  const command = ctx.text.slice(0, ctx.entities[0].length).toLowerCase();
  const param = ctx.text.slice(ctx.entities[0].length).toLowerCase();

  console.log("command is ", command);
  console.log("param is ", param);
  const execCommand = commands.find((c) => c.command === command);
  // console.log(execCommand);
  if (execCommand && execCommand.func) {
    return execCommand.func(ctx, param, bot, docName);
  }
  await bot.sendMessage(
    ctx.from.id,
    `Sorry, ${command} is not a valid command.`
  );
  return true;
};

export default handleCommands;
