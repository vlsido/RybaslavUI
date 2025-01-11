import { MaterialIcons } from "@expo/vector-icons";
import {
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useSharedValue
} from "react-native-reanimated";
import { useSignal } from "@preact/signals-react";
import { useMMKVNumber } from "react-native-mmkv";
import { useCallback, useEffect } from "react";
import useAudio from "@/components/hooks/useAudio";
import { AnimatedPressable } from "@/components/utils/MiscellaneousUtil";
import VolumeSlider from "./VolumeSlider";
import AnimateableText from "react-native-animateable-text";
import { AnimateableTextProps } from "react-native-animateable-text/lib/typescript/src/TextProps";

function Volume() {
  const { changeVolume } = useAudio();

  const [cachedVolumeLevel] = useMMKVNumber("audio.volume.level");

  const volumeLevel = useSharedValue<number>(cachedVolumeLevel ?? 100);

  const isVolumeHintVisible = useSignal<boolean>(false);

  const hintTimeout = useSignal<NodeJS.Timeout | null>(null);

  const onSlideStart = useCallback(() => {
    if (hintTimeout.value !== null) {
      clearTimeout(hintTimeout.value);
    }
    isVolumeHintVisible.value = true;
  }, [
    isVolumeHintVisible,
    hintTimeout
  ]);

  const onSlideEnd = useCallback((value: number) => {
    changeVolume(value);
    hintTimeout.value = setTimeout(() => {
      isVolumeHintVisible.value = false;
    }, 1000);
  }, [
    changeVolume,
    hintTimeout,
    isVolumeHintVisible
  ]);

  const textAnimatedProps = useAnimatedProps<AnimateableTextProps>(() => {
    return {
      text: volumeLevel.value.toString(),
      defaultValue: volumeLevel.value.toString(),
    };
  });

  return (
    <>
      <View style={styles.container}>
        <AnimatedPressable
        >
          <MaterialIcons
            name={"volume-up"}
            size={36}
            color={"white"}
          />
        </AnimatedPressable>
        <VolumeSlider
          volumeLevel={volumeLevel}
          onSlideStart={onSlideStart}
          onSlideEnd={onSlideEnd}
        />
      </View>
      {isVolumeHintVisible.value === true && (
        <Animated.View style={{
          position: "absolute",
          backgroundColor: "white",
          paddingHorizontal: 30,
          borderRadius: 5,
          top: "-50%"
        }}
          entering={FadeIn}
          exiting={FadeOut}
        >

          <AnimateableText
            style={[
              { textAlign: "center", fontSize: 16, color: "black" }
            ]}
            animatedProps={textAnimatedProps}
          />
        </Animated.View>
      )}
    </>
  );
}


export default Volume;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
