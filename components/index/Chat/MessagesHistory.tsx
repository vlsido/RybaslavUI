import { FlatList, StyleSheet } from "react-native";
import MessageBox from "./MessageBox";
import { useAtom } from "jotai";
import { messagesAtom } from "../atoms";

export interface Message {
  user: "assistant" | "user";
  message: string;
}

function MessagesHistory() {
  const [messages] = useAtom<Message[]>(messagesAtom);

  return (
    <FlatList
      data={messages}
      style={{ width: "100%" }}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }) =>
        <MessageBox user={item.user} message={item.message} />
      }
    />
  );
}

export default MessagesHistory;

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10
  }
})
