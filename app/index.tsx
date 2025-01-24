import {
  StyleSheet,
  View
} from "react-native";
import ChatView from "@/components/index/Chat/ChatView";
import ResetMemory from "@/components/index/ResetMemory";
import Temperature from "@/components/index/Temperature";
import { ThemedText } from "@/components/other/ThemedText";
import { ThemedView } from "@/components/other/ThemedView";
import AudioContextProvider from "@/components/storage/AudioContext";
import { Colors } from "@/constants/Colors";
import Settings from "@/components/other/Settings";

export default function Index() {
  return (
    <AudioContextProvider>
      <ThemedView
        lightColor={Colors.dark.background}
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

          <ThemedText
            lightColor={Colors.dark.text}
            darkColor={Colors.dark.text}
            style={styles.titleText}
          >
            Rybaslav Panel
          </ThemedText>
        </View>
        <ResetMemory />
        <ChatView />
        <Temperature />

        <Settings />
      </ThemedView>
    </AudioContextProvider>
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
