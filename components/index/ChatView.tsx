import { StyleSheet } from "react-native";
import { ThemedView } from "../other/ThemedView";

export default function ChatView() {
  return (
    <ThemedView
      darkColor="black"
      lightColor="white"
      style={styles.container}
    >
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.25,
    width: "80%",
    maxWidth: 800,
    maxHeight: 600,

  }
});
