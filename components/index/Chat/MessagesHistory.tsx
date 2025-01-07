import { FlatList, Pressable, StyleSheet } from "react-native";
import MessageBox from "./MessageBox";
import { useAtom } from "jotai";
import { messagesAtom } from "../atoms";
import { useEffect, useRef } from "react";
import { useAudioPlayer } from "expo-audio";

export interface Message {
  user: "assistant" | "user";
  message: string;
}

function MessagesHistory() {
  const [messages] = useAtom<Message[]>(messagesAtom);
  const audioPlayer = useAudioPlayer();

  const flatListRef = useRef<FlatList | null>(null);

  function scrollToEnd() {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 500);
  }

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      style={{ width: "100%" }}
      keyExtractor={(item, index) => `${item.user}_${item.message}_${index}`}
      contentContainerStyle={styles.contentContainer}
      onContentSizeChange={scrollToEnd}
      onLayout={() => console.log("layout")}
      renderItem={({ item }) =>
        <MessageBox audioPlayer={audioPlayer} user={item.user} message={item.message} />
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
