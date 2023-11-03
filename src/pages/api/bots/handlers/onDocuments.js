import { updateUser } from "@/utils/firebase";
import axios from "axios";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { fireStorage } from "@/utils/fireConfig";

var qrCode = require("qrcode-reader");
var Jimp = require("jimp");
const ashokTelegramId = "1863422087";

export const handleDocuments = async (ctx, bot, docName) => {
  const fileUrl = `https://api.telegram.org/bot${bot.token}/getFile?file_id=${ctx.document.file_id}`;
  const urlRes = await axios.get(fileUrl);
  const { file_path } = urlRes.data.result;
  const url = `https://api.telegram.org/file/bot${bot.token}/${file_path}`;
  const download = await axios.get(url, {
    responseType: "arraybuffer",
  });
  const ext = file_path.split(".").pop();
  const photoUploadPath = `${docName}/${ctx.user.id}/${ctx.document.file_id}.${ext}`;
  const storageRef = ref(fireStorage, photoUploadPath);

  console.log(download.data);
  const buffer = new Uint8Array(download.data);
  await uploadBytes(storageRef, buffer);

  const savedUrl = await getDownloadURL(storageRef);
  return { url, savedUrl, buffer };
};

export default handleDocuments;
