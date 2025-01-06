import { atom } from "jotai";
import { Message } from "./Chat/MessagesHistory";

export const textInputAtom = atom<string>("");
export const messagesAtom = atom<Message[]>([]);
export const isShiftPressedAtom = atom<boolean>(false);
