import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { fireStorage } from "@/utils/fireConfig";

export async function savePhoto(savePath, photoData) {
  const storageRef = ref(fireStorage, savePath);
  await uploadBytes(storageRef, photoData);
  return await getDownloadURL(storageRef);
}
