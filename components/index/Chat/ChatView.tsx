import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useCallback } from "react";
import MessagesHistory, {
  Message
} from "./MessagesHistory";
import {
  messagesAtom,
  textInputAtom
} from "../atoms";
import { ThemedView } from "@/components/other/ThemedView";
import { AnimatedPressable } from "@/components/utils/MiscellaneousUtil";


export default function ChatView() {
  const [messages, setMessages] = useAtom<Message[]>(messagesAtom);
  const [textInput, setTextInput] = useAtom<string>(textInputAtom);

  const pressOpacity = useSharedValue<number>(1);

  const onPress = useCallback(async () => {
    if (textInput === "") return;

    setMessages([...messages, { user: "user", message: textInput }]);

    try {
      const response = await fetch(
        "http://192.168.0.106:8080/completion",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const dataMessage: string = data.message;

      setMessages([...messages, { user: "assistant", message: dataMessage }]);
    } catch (error) {
      console.error("Error fetching completion", error);
    }
  }, [textInput]);

  const handlePress = useCallback(() => {
    "worklet";
    pressOpacity.value = withTiming(0.5, {
      duration: 100,
      reduceMotion: ReduceMotion.System
    }, () => {
      pressOpacity.value = withTiming(1, {
        duration: 100,
        reduceMotion: ReduceMotion.System
      });
    });

    runOnJS(onPress)();
  }, [onPress]);

  function onChangeText(text: string) {
    setTextInput(text);
  }

  const pressAnimatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      opacity: pressOpacity.value,
    }
  });

  return (
    <ThemedView
      style={styles.container}
    >
      <MessagesHistory />
      <ThemedView
        darkColor="rgba(33,34,33, 0.9)"
        lightColor="white"
        style={styles.textField}
      >
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder="Message Rybaslav"
            placeholderTextColor={"rgb(233,234,233, 0.5)"}
            onChangeText={(text: string) => onChangeText(text)}
            multiline={true}
            style={styles.textInput}
          />
        </View>
        <AnimatedPressable
          style={[
            styles.sendMessageContainer,
            pressAnimatedStyle
          ]}
          onPress={handlePress}
        >
          <MaterialIcons
            name="arrow-upward"
            size={32}
            color={"black"}
          />
        </AnimatedPressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "80%",
    maxWidth: 800,
    overflow: "hidden",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 20
  },
  textField: {
    width: "100%",
    borderRadius: 20,
  },
  textInputContainer: {
    minHeight: 100,
    flex: 1,
    width: "100%",
    borderRadius: 20,
  },
  textInput: {
    fontSize: 16,
    padding: 15,
    borderRadius: 20,
    color: "rgb(233,234,233)",
    flex: 1
  },
  sendMessageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 32,
    width: 32,
    alignSelf: "flex-end",
    margin: 8,
    backgroundColor: "white",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center"
  }
});
