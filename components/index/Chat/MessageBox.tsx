import { ThemedText } from "@/components/other/ThemedText";
import {
  Pressable,
  StyleSheet,
  View
} from "react-native";
import Avatar from "./Avatar";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useAudioPlayerStatus
} from "expo-audio";
import { useEffect } from "react";
import Animated, {
  FadeIn
} from "react-native-reanimated";
import { useSignal } from "@preact/signals-react";
import useAudio from "@/components/hooks/useAudio";
import { serverAddress } from "@/constants/Server";

interface MessageBoxProps {
  user: "assistant" | "user";
  message: string;
}

function MessageBox(props: MessageBoxProps) {
  const {
    audioPlayer,
    playAudio
  } = useAudio();

  const status = useAudioPlayerStatus(audioPlayer);
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
        `http://${serverAddress}/voiceOver`,
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

      playAudio(audioUri);

    } catch (error) {
      console.error("Error fetching voice over", error);
    } finally {
      isAudioPlaying.value = false;
    }
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
                onPress={() => audioPlayer.pause()}
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
