import { fireDb } from "../fireConfig";
import { chatDocName } from "../constants";

// import { doc, getDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

export const saveMessage = async (message, answer, docName) => {
  const user = await getUser({
    telegramId: message.from.id,
    firstName: message.from.first_name,
    lastName: message.from.last_name,
    language: message.from.language_code,
  });

  const chatRef = doc(
    fireDb,
    `${docName}/${user.id}/${chatDocName}`,
    `${message.date}`
  );
  await setDoc(chatRef, {
    question: message.text,
    answer,
  });
};

export const getUser = async (user, docName) => {
  const q = query(
    collection(fireDb, docName),
    where("telegramId", "==", user.telegramId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return addUser(user, docName);
  }
  return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
};

export const updateUser = async (user, docName) => {
  console.log("Updating user", user);
  const q = query(
    collection(fireDb, docName),
    where("telegramId", "==", user.telegramId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return addUser(user, docName);
  }

  const docRef = querySnapshot.docs[0].ref;
  await updateDoc(docRef, user);
  const docSnapshot = await getDoc(docRef);
  return { id: docSnapshot.id, ...docSnapshot.data() };
};

export const addUser = async (user, docName) => {
  const docRef = await addDoc(collection(fireDb, docName), user);
  const docSnapshot = await getDoc(docRef);
  return { id: docSnapshot.id, ...docSnapshot.data() };
};

export const getUsers = async (docName) => {
  const q = query(collection(fireDb, docName));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
