import { ThemedText } from "@/components/other/ThemedText";
import { ThemedView } from "@/components/other/ThemedView";
import { StyleSheet, View } from "react-native";
import Avatar from "./Avatar";

interface MessageBoxProps {
  user: "assistant" | "user";
  message: string;
}

function MessageBox(props: MessageBoxProps) {

  return (
    <ThemedView
      style={[styles.container, {
        flexDirection: props.user === "assistant"
          ? "row"
          : "row-reverse",
        alignItems: "center"
      }]}
    >
      <Avatar user={props.user} />
      <View style={styles.messageContainer}>
        <ThemedText
          style={[styles.messageText, {
            textAlign: props.user === "assistant"
              ? "left"
              : "right",
            textAlignVertical: "center"
          }]}
        >
          {props.message}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

export default MessageBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgb(33,34,33)",
    borderRadius: 10
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
  },
  messageText: {
    fontSize: 16
  }
});
