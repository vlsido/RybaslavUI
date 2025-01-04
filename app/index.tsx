import ChatView from "@/components/index/ChatView";
import { ThemedText } from "@/components/other/ThemedText";
import { ThemedView } from "@/components/other/ThemedView";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <ThemedView
      lightColor={Colors.light.background}
      darkColor={Colors.dark.background}
      style={styles.container}
    >
      <ThemedText
        lightColor={Colors.light.text}
        darkColor={Colors.dark.text}
        style={styles.titleText}
      >
        Rybaslav Panel
      </ThemedText>
      <ChatView />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 16,
    position: "absolute",
    top: "5%",
    opacity: 0.5
  }
});
