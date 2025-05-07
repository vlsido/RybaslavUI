import {
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ReadonlySignal } from "@preact/signals-react";

interface TTSButtonProps {
  isAudioPlaying: ReadonlySignal<boolean>;
  isVoiceFetching: ReadonlySignal<boolean>;
  onPause: () => void;
}

function TTSButton(props: TTSButtonProps) {


  if (props.isVoiceFetching.value === true) {
    return <ActivityIndicator size={28} color={"white"} />
  }

  switch (props.isAudioPlaying.value) {
    case true:
      return (<Pressable
        onPress={props.onPause}
        style={styles.playButtonContainer}
      >
        <MaterialIcons
          name="stop-circle"
          size={28}
          color={"white"}
        />
      </Pressable>
      )
    case false:
      return (
        <MaterialIcons
          name="play-arrow"
          size={28}
          color={"white"}
        />
      );
  }
}

export default TTSButton;

const styles = StyleSheet.create({
  playButtonContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start"
  },
})
