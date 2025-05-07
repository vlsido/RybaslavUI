import {
  useCallback,
  useEffect,
  useRef
} from "react";
import {
  Pressable,
  StyleSheet,
  View
} from "react-native";
import { ThemedText } from "@/components/other/ThemedText";
import Avatar from "./Avatar";
import {
  useAudioPlayerStatus
} from "expo-audio";
import Animated, {
  FadeIn
} from "react-native-reanimated";
import { useSignal } from "@preact/signals-react";
import useAudio from "@/components/hooks/useAudio";
import { serverAddress } from "@/constants/Server";
import TTSButton from "./TTSButton";

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
  const isVoiceFetching = useSignal<boolean>(false);
  const audioUri = useRef<string>("");
  const isCurrentMessageBoxVoiceActive = useRef<boolean>(false);

  useEffect(() => {
    if (isCurrentMessageBoxVoiceActive.current === false) return;

    console.log(status);
    switch (status.playing) {
      case true:
        isAudioPlaying.value = true;
        isVoiceFetching.value = false;
        break;
      case false:
        isAudioPlaying.value = false;
        isCurrentMessageBoxVoiceActive.current = false;
        break;
    }
  }, [status.playing]);

  const fetchVoiceOver = useCallback(async () => {
    try {

      if (isAudioPlaying.value === true) return;

      isCurrentMessageBoxVoiceActive.current = true;

      if (audioUri.current !== "") {
        playAudio(audioUri.current);
        return;
      }

      isVoiceFetching.value = true;
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

      audioUri.current = URL.createObjectURL(data);

      playAudio(audioUri.current);

    } catch (error) {
      console.error("Error fetching voice over", error);
      isCurrentMessageBoxVoiceActive.current = false;
      isVoiceFetching.value = false;
    }
  }, [isAudioPlaying]);

  const pauseAudio = useCallback(() => {
    audioPlayer.pause();
    audioPlayer.seekTo(0);
  }, []);

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
              <TTSButton
                isAudioPlaying={isAudioPlaying}
                isVoiceFetching={isVoiceFetching}
                onPause={pauseAudio}
              />
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
