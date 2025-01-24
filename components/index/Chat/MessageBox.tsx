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

  switch (props.user) {
    case "assistant":
      return (
        <Animated.View
          style={[styles.container]}
          entering={FadeIn.duration(300)}
        >
          <View style={[styles.messageBox, {
            backgroundColor: "rgb(33,34,33)",
            flexDirection: "row",
            alignSelf: "flex-start",
          }]}>
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
            <Avatar user={props.user} />
            <View style={styles.messageTextContainer}>
              <ThemedText
                darkColor="rgb(233,234,233)"
                lightColor="rgb(233,234,233)"
                style={[styles.messageText, {
                  textAlign: "left",
                  textAlignVertical: "center"
                }]}
              >
                {props.message}
              </ThemedText>
            </View>
          </View>
        </Animated.View >
      );
    case "user":
      return (
        <Animated.View
          style={[styles.container]}
          entering={FadeIn.duration(300)}
        >
          <View style={[
            styles.messageBox,
            {
              backgroundColor: "rgb(50, 34, 60)",
              flexDirection: "row-reverse",
              alignSelf: "flex-end",
            }
          ]}>
            <Avatar user={props.user} />
            <View style={styles.messageTextContainer}>
              <ThemedText
                darkColor="rgb(233,234,233)"
                lightColor="rgb(233,234,233)"
                style={[styles.messageText, {
                  textAlign: "right",
                  textAlignVertical: "center"
                }]}
              >
                {props.message}
              </ThemedText>
            </View>
          </View>
        </Animated.View >
      );
  }

}

export default MessageBox;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10
  },
  playButtonContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  messageBox: {
    borderRadius: 10,
    padding: 8,
  },
  messageTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    flex: 1
  },
  messageText: {
    fontSize: 16
  }
});
