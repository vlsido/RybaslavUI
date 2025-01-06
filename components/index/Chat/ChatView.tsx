import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  View,
  ViewStyle
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { atom, useAtom } from "jotai";
import {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useCallback, useEffect, useRef } from "react";
import MessagesHistory, {
  Message
} from "./MessagesHistory";
import {
  isShiftPressedAtom,
  messagesAtom,
  textInputAtom
} from "../atoms";
import { ThemedView } from "@/components/other/ThemedView";
import { AnimatedPressable } from "@/components/utils/MiscellaneousUtil";

const newlines_re = new RegExp("\n+");

const isMessageSendActiveAtom = atom<boolean>((get) => {
  const newText = get(textInputAtom).replace(newlines_re, "");

  if (newText.length > 0) {
    return true;
  } else {
    return false;
  }
});

const isResponseProcessingAtom = atom<boolean>(false);

export default function ChatView() {
  const [isShiftPressed, setIsShiftPressed] = useAtom<boolean>(isShiftPressedAtom);
  const [isMessageSendActive] = useAtom<boolean>(isMessageSendActiveAtom);
  const [isResponseProcessing, setIsResponseProcessing] = useAtom<boolean>(isResponseProcessingAtom);
  const [messages, setMessages] = useAtom<Message[]>(messagesAtom);
  const [textInput, setTextInput] = useAtom<string>(textInputAtom);

  const textInputRef = useRef<TextInput | null>(null);

  const pressOpacity = useSharedValue<number>(0.5);

  const onPress = useCallback(async () => {
    const formattedTextInput = textInput.trim().replace(newlines_re, " ");

    if (formattedTextInput === "") return;

    const newMessages: Message[] = [...messages, { user: "user", message: textInput }];

    setMessages(newMessages);

    setTextInput("");

    textInputRef.current?.clear();

    try {
      setIsResponseProcessing(true);
      const body = {
        message: formattedTextInput
      }

      console.log("Stringified body", JSON.stringify(body));

      const response = await fetch(
        "http://192.168.0.106:8080/completion",
        {
          body: JSON.stringify(body),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      const dataMessage: string = data.message;

      setMessages([...newMessages, { user: "assistant", message: dataMessage }]);

    } catch (error) {
      console.error("Error fetching completion", error);
    } finally {
      setIsResponseProcessing(false);
    }
  }, [
    textInput,
    messages,
    textInputRef
  ]);

  // [!] keydown is catched by TextInput
  function keyUpHandler({ key }) {
    if (key === "Shift") {
      setIsShiftPressed(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keyup", keyUpHandler);
    }
  }, []);

  useEffect(() => {
    if (isMessageSendActive === true && isResponseProcessing === false) {
      pressOpacity.value = withTiming(1, { duration: 150, reduceMotion: ReduceMotion.System });
    } else {
      pressOpacity.value = withTiming(0.5, { duration: 150, reduceMotion: ReduceMotion.System });

    }
  }, [
    isMessageSendActive,
    isResponseProcessing
  ]);

  function keyDownHandler(keyPressData: NativeSyntheticEvent<TextInputKeyPressEventData>) {
    if (keyPressData.nativeEvent.key === "Shift") {
      setIsShiftPressed(true);
    }

    if (isShiftPressed === true
      && keyPressData.nativeEvent.key === "Enter") {
      setTextInput(textInput + "\n");
      return;
    }

    if (isShiftPressed === false
      && keyPressData.nativeEvent.key === "Enter") {
      if (
        textInput.trim().replace(newlines_re, "").length === 0
        || isResponseProcessing === true
      ) {
        return;
      }
      onPress();
    }
  }

  function onChange(textChangeData: NativeSyntheticEvent<TextInputChangeEventData>) {
    // @ts-ignore works on web
    if (textChangeData.nativeEvent.data === null
      // @ts-ignore
      && textChangeData.nativeEvent.inputType !== "deleteContentBackward") {
      return;
    }

    setTextInput(textChangeData.nativeEvent.text);
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
            ref={textInputRef}
            placeholder="Message Rybaslav"
            placeholderTextColor={"rgb(233,234,233, 0.5)"}
            onChange={(textChangeData: NativeSyntheticEvent<TextInputChangeEventData>) =>
              onChange(textChangeData)}
            value={textInput}
            multiline={true}
            style={styles.textInput}
            onKeyPress={(keyPressData) => keyDownHandler(keyPressData)}
          />
        </View>
        <AnimatedPressable
          style={[
            styles.sendMessageContainer,
            pressAnimatedStyle
          ]}
          onPress={onPress}
          disabled={
            isMessageSendActive === false
            || isResponseProcessing === true
          }
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
    gap: 20,
    marginBottom: 15
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
    flex: 1,
    // Works on web
    // @ts-ignore
    outlineStyle: "none"
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
