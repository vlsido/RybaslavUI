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
import { ThemedView } from "@/components/other/ThemedView";
import { AnimatedPressable } from "@/components/utils/MiscellaneousUtil";
import { Colors } from "@/constants/Colors";
import { untracked, useSignal, useSignalEffect } from "@preact/signals-react";

const newlines_re = new RegExp("\\r?\\n|\\r", "g");

export default function ChatView() {
  const isShiftPressed = useSignal<boolean>(false);
  const isMessageSendActive = useSignal<boolean>(false);
  const isResponseProcessing = useSignal<boolean>(false);
  const messages = useSignal<Message[]>([]);
  const textInput = useSignal<string>("");

  useSignalEffect(() => {
    const textInputFormatted = textInput.value.replace(newlines_re, "");

    if (textInputFormatted.length > 0) {
      isMessageSendActive.value = untracked(() => true);
    } else {
      isMessageSendActive.value = untracked(() => false);
    }
  });

  const textInputRef = useRef<TextInput | null>(null);

  const pressOpacity = useSharedValue<number>(0.5);

  const onPress = useCallback(async () => {
    const formattedTextInput = textInput.value.trim().replace(newlines_re, " ");

    if (formattedTextInput === "") return;

    const newMessages: Message[] = [...messages.value, { user: "user", message: textInput.value }];

    messages.value = newMessages;

    textInput.value = "";

    textInputRef.current?.clear();

    try {
      isResponseProcessing.value = true;
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

      messages.value = ([...newMessages, { user: "assistant", message: dataMessage }]);

    } catch (error) {
      console.error("Error fetching completion", error);
    } finally {
      isResponseProcessing.value = false;
    }
  }, [
    textInput,
    messages,
    textInputRef
  ]);

  // [!] keydown is catched by TextInput
  function keyUpHandler({ key }) {
    if (key === "Shift") {
      isShiftPressed.value = false;
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keyup", keyUpHandler);
    }
  }, []);

  useSignalEffect(() => {
    if (isMessageSendActive.value === true && isResponseProcessing.value === false) {
      pressOpacity.value = withTiming(1, { duration: 150, reduceMotion: ReduceMotion.System });
    } else {
      pressOpacity.value = withTiming(0.5, { duration: 150, reduceMotion: ReduceMotion.System });

    }

  });


  function keyDownHandler(keyPressData: NativeSyntheticEvent<TextInputKeyPressEventData>) {
    if (keyPressData.nativeEvent.key === "Shift") {
      isShiftPressed.value = (true);
    }

    if (isShiftPressed.value === true
      && keyPressData.nativeEvent.key === "Enter") {
      textInput.value = (textInput + "\n");
      return;
    }

    if (isShiftPressed.value === false
      && keyPressData.nativeEvent.key === "Enter") {
      if (
        textInput.value.trim().replace(newlines_re, "").length === 0
        || isResponseProcessing.value === true
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

    textInput.value = (textChangeData.nativeEvent.text);
  }

  const pressAnimatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      opacity: pressOpacity.value,
    }
  });

  return (
    <ThemedView
      style={styles.container}
      darkColor={Colors.dark.background}
      lightColor={Colors.dark.background}
    >
      <MessagesHistory messages={messages} />
      <ThemedView
        darkColor="rgba(33,34,33, 0.9)"
        lightColor="rgba(33,34,33, 0.9)"
        style={styles.textField}
      >
        <View style={styles.textInputContainer}>
          <TextInput
            ref={textInputRef}
            placeholder="Message Rybaslav"
            placeholderTextColor={"rgb(233,234,233, 0.5)"}
            onChange={(textChangeData: NativeSyntheticEvent<TextInputChangeEventData>) =>
              onChange(textChangeData)}
            value={textInput.value}
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
            isMessageSendActive.value === false
            || isResponseProcessing.value === true
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
    width: "100%",
    overflow: "hidden",
    maxWidth: 800,
    paddingHorizontal: 15,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 30,
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
