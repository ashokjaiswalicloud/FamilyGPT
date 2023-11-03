const handleActions = async (ctx, bot, actions) => {
  const actionData = ctx.data.split(":");
  for (const action of actions) {
    // console.log("Find the action and call it", actionData[0], action.action);
    if (action.action === actionData[0]) {
      return await action.func(ctx, bot, actionData[1]);
    }
  }
};

export default handleActions;
