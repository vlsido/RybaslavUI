import Animated, { FadeIn, FadeOut, SharedValue } from "react-native-reanimated";
import { ReadonlySignal } from "@preact/signals-react"
import { StyleSheet } from "react-native";
import Slider from "@/components/other/Sliders/Slider";

interface VolumeSliderProps {
  volumeLevel: SharedValue<number>;
  onSlideStart: () => void;
  onSlideEnd: (value: number) => void;
}

const SLIDER_THICKNESS = 10;

function VolumeSlider(props: VolumeSliderProps) {
  return (
    <Animated.View
      style={[styles.sliderContainer]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Slider
        value={props.volumeLevel}
        sliderThickness={SLIDER_THICKNESS}
        thumbSize={24}
        boundedThumb={true}
        thumbColor="white"
        thumbRingColor="black"
        onStart={props.onSlideStart}
        onEnd={(value: number) => props.onSlideEnd(value)}
      />
    </Animated.View>
  );
}

export default VolumeSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    height: SLIDER_THICKNESS,
    width: 100,
    backgroundColor: "rgba(243,244,243,0.5)",
    borderRadius: 10,
    margin: 5
  }
});
