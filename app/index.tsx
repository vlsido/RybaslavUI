import ChatView from "@/components/index/Chat/ChatView";
import StorageData from "@/components/index/StorageData";
import Temperature from "@/components/index/Temperature";
import { ThemedText } from "@/components/other/ThemedText";
import { ThemedView } from "@/components/other/ThemedView";
import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <ThemedView
      lightColor={Colors.light.background}
      darkColor={Colors.dark.background}
      style={styles.container}
    >
      <View style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginVertical: 10
      }}>

        <StorageData />
        <ThemedText
          lightColor={Colors.light.text}
          darkColor={Colors.dark.text}
          style={styles.titleText}
        >
          Rybaslav Panel
        </ThemedText>
        <Temperature />
      </View>
      <ChatView />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  titleText: {
    fontSize: 16,
    opacity: 0.5
  }
});
