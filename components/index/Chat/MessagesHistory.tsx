import { FlatList, Pressable, StyleSheet } from "react-native";
import MessageBox from "./MessageBox";
import { useEffect, useRef } from "react";
import { useAudioPlayer } from "expo-audio";
import { Signal, useSignal } from "@preact/signals-react";

export interface Message {
  user: "assistant" | "user";
  message: string;
}

interface MessagesHistoryProps {
  messages: Signal<Message[]>
}

function MessagesHistory(props: MessagesHistoryProps) {
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
      data={props.messages.value}
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
