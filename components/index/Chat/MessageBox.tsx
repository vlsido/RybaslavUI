import { ThemedText } from "@/components/other/ThemedText";
import { ThemedView } from "@/components/other/ThemedView";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Avatar from "./Avatar";
import { AnimatedPressable } from "@/components/utils/MiscellaneousUtil";
import { MaterialIcons } from "@expo/vector-icons";
import {
  AudioPlayer,
  useAudioPlayerStatus
} from "expo-audio";
import { useEffect, useMemo } from "react";
import Animated, { FadeIn, SlideInLeft, SlideInRight } from "react-native-reanimated";
import { useSignal } from "@preact/signals-react";
import FloatyLoading from "@/components/other/FloatyLoading";

interface MessageBoxProps {
  user: "assistant" | "user";
  message: string;
  audioPlayer: AudioPlayer;
}

function MessageBox(props: MessageBoxProps) {
  const status = useAudioPlayerStatus(props.audioPlayer);
  const isAudioPlaying = useSignal<boolean>(false);

  useEffect(() => {
    if (status.playing === false) {
      isAudioPlaying.value = false;
    }
  }, [status.playing]);

  async function fetchVoiceOver() {
    try {
      isAudioPlaying.value = true;
      const body = {
        message: props.message
      }
      const response = await fetch(
        "http://192.168.0.106:8080/voiceOver",
        {
          body: JSON.stringify(body),
          method: "POST",
          headers: {
            "Content-Type": "audio/wav",
          },
        }
      );

      const data = await response.blob();

      const audioUri = URL.createObjectURL(data);

      props.audioPlayer.replace({ uri: audioUri });

      props.audioPlayer.play();

    } catch (error) {
      console.error("Error fetching voice over", error);
      isAudioPlaying.value = false;
    }
  }

  function pauseVoice() {
    props.audioPlayer.pause();
  }

  return (
    <Animated.View
      style={[styles.container, {
        flexDirection: props.user === "assistant"
          ? "row"
          : "row-reverse",
        alignItems: "center",
        backgroundColor: props.user === "assistant"
          ? "rgb(33,34,33)"
          : "rgb(50, 34, 60)"
      }]}
      entering={FadeIn.duration(300)}
    >
      {
        props.user === "assistant" && (
          <Pressable
            onPress={fetchVoiceOver}
            style={styles.playButtonContainer}
            disabled={isAudioPlaying.value === true}
          >
            {isAudioPlaying.value === true ? (
              <Pressable
                onPress={pauseVoice}
                style={styles.playButtonContainer}
              >
                <MaterialIcons
                  name="stop-circle"
                  size={28}
                  color={"white"}
                />
              </Pressable>
            ) : (
              <MaterialIcons
                name="play-arrow"
                size={28}
                color={"white"}
              />

            )}

          </Pressable>
        )
      }
      <Avatar user={props.user} />
      <View style={styles.messageContainer}>
        <ThemedText
          darkColor="rgb(233,234,233)"
          lightColor="rgb(233,234,233)"
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
    </Animated.View >
  );
}

export default MessageBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 10
  },
  playButtonContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start"
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
