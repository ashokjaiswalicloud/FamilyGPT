import { updateUser } from "@/utils/firebase";
import axios from "axios";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { fireStorage } from "@/utils/fireConfig";

var qrCode = require("qrcode-reader");
var Jimp = require("jimp");
const ashokTelegramId = "1863422087";

export const handlePhotos = async (ctx, bot, docName) => {
  const photos = ctx.photo;
  const photo = ctx.photo[photos.length - 1];
  const url = `https://api.telegram.org/bot${bot.token}/getFile?file_id=${photo.file_id}`;
  const urlRes = await axios.get(url);
  const { file_path } = urlRes.data.result;
  const photoUrl = `https://api.telegram.org/file/bot${bot.token}/${file_path}`;
  const download = await axios.get(photoUrl, {
    responseType: "arraybuffer",
  });
  const photoExtension = file_path.split(".").pop();
  const photoUploadPath = `${docName}/${ctx.user.id}/${photo.file_id}.${photoExtension}`;
  const storageRef = ref(fireStorage, photoUploadPath);

  const buffer = new Uint8Array(download.data);
  await uploadBytes(storageRef, buffer);

  const savedUrl = await getDownloadURL(storageRef);
  return { photoUrl, savedUrl, buffer };
};

export const handlePhotos1 = async (ctx, bot, docName) => {
  console.log("handlePhotos", ctx);
  if (ctx.user.wallet_qr_code) {
    await bot.sendMessage(
      ctx.from.id,
      `${ctx.from.first_name} ! Your ${ctx.user.wallet_type} QR is already received, your reward will soon arrive. [photo]`
    );
    return true;
  }
  const photos = ctx.photo;

  const walletQrCode = await handleQrCode(ctx, photos[photos.length - 1], bot);
  if (walletQrCode === undefined) {
    return await bot.sendMessage(
      ctx.from.id,
      `${ctx.from.first_name}! I can't read your QR code, please try again...`
    );
  }
  await updateUser(
    {
      telegramId: ctx.from.id,
      wallet_qr_code: walletQrCode,
      reward_paid: "no",
      lastCommand: "none",
    },
    docName
  );
  await bot.sendMessage(
    ctx.from.id,
    `🎉Thank you ${ctx.from.first_name}, Your reward is on its way. 🤑`
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await bot.sendMessage(
    ctx.from.id,
    `💭Don't forget, this reward is for the first 💯 responses, so act fast! You'll receive your $10 within 24 hours.🤔`
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));
  await bot.sendPhoto(
    ctx.from.id,
    "https://firebasestorage.googleapis.com/v0/b/gns-gpt-bot.appspot.com/o/maids%2FScreenshot%202023-04-01%20at%201.10.44%20PM.png?alt=media&token=ef25de53-ed23-4254-be33-ea8a8598f422"
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));
  bot.sendMessage(
    ctx.chat.id,
    `Sharing is caring! Share my QR code or this link https://t.me/MoneyMaidBot with your friends so they can save time and win a reward too. 🤝`
  );

  return true;
};

const payQrCode = async (ctx, photo, qrUrl, bot) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  bot.sendMessage(
    ashokTelegramId,
    `New survey completed ${JSON.stringify(ctx.user)}`
  );
  bot.sendPhoto(ashokTelegramId, photo);

  bot.sendMessage(ashokTelegramId, `Pay respondent \n ${qrUrl}`);
};

const handleQrCode = async (ctx, photo, bot) => {
  if (ctx.user.wallet_qr_code) {
    return await bot.sendMessage(
      ctx.from.id,
      `${ctx.from.first_name}! Your ${ctx.user.wallet_type} QR is already received, your reward will soon arrive.`
    );
  }
  try {
    console.log(photo);
    const fileUrl = `https://api.telegram.org/bot${bot.token}/getFile?file_id=${photo.file_id}`;
    const urlRes = await axios.get(fileUrl);
    const { file_path } = urlRes.data.result;
    const photoUrl = `https://api.telegram.org/file/bot${bot.token}/${file_path}`;
    console.log(photoUrl);
    const img = await Jimp.read(photoUrl);
    const qr = new qrCode();
    const value = await new Promise((resolve, reject) => {
      qr.callback = (err, val) => (err != null ? reject(err) : resolve(val));
      qr.decode(img.bitmap);
    });

    await payQrCode(ctx, photoUrl, value.result, bot);
    return value.result;
  } catch (e) {
    console.log("Handle survey end", e.message);
  }
};
export default handlePhotos;
