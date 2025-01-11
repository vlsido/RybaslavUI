import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ReduceMotion,
  SharedValue,
  runOnJS,
} from "react-native-reanimated";
import { useCallback, useMemo } from "react";
import Thumb from "./Thumb";

interface SliderProps {
  value: SharedValue<number>;
  thumbShape?: "circle" | "square" | "ring";
  thumbSize: number;
  thumbColor?: string;
  thumbRingColor?: string;
  trackColor?: string;
  boundedThumb: boolean;
  sliderThickness?: number;
  vertical?: boolean;
  reverse?: boolean;
  onStart?: () => void;
  onEnd?: (value: number) => void;
}

function Slider(props: SliderProps) {

  function clamp(
    v: number, max: number
  ) {
    "worklet";
    return Math.min(
      Math.max(
        v,
        0
      ),
      max
    );
  }

  const width = useSharedValue<number>(props.vertical === true ? props.sliderThickness ?? 0 : 40);

  const height = useSharedValue<number>(props.vertical === false ? props.sliderThickness ?? 0 : 10);

  const handleScale = useSharedValue<number>(1);

  const handleStyle = useAnimatedStyle<ViewStyle>(
    () => {
      const length =
        (props.vertical
          ? height.value
          : width.value) -
        (props.boundedThumb
          ? props.thumbSize
          : 0);

      const percent = (props.value.value / 100) * length;
      const pos =
        (props.reverse
          ? length - percent
          : percent) -
        (props.boundedThumb
          ? 0
          : props.thumbSize / 2);
      const posY = props.vertical
        ? pos
        : (height.value / 2) - (props.thumbSize / 2);
      const posX = props.vertical
        ? (width.value / 2) - (props.thumbSize / 2)
        : pos;

      return {
        transform: [
          { translateY: posY },
          { translateX: posX },
          { scale: handleScale.value },
        ],
      };
    },
    [
      props.vertical,
      props.reverse,
      props.boundedThumb,
      props.thumbSize,
      height,
      width,
      props.value,
      handleScale,
    ]
  );
  const onGestureUpdate = ({ x, y }: PanGestureHandlerEventPayload) => {
    "worklet";

    const length =
      (props.vertical
        ? height.value
        : width.value) -
      (props.boundedThumb
        ? props.thumbSize
        : 0);
    const pos = clamp(
      (props.vertical
        ? y
        : x) -
      (props.boundedThumb
        ? props.thumbSize / 2
        : 0),
      length,
    );
    const value = Math.round((pos / length) * 100);
    let newValue = props.reverse === true
      ? 100 - value
      : value;

    if (props.value.value === newValue)
      return;

    if (newValue < 1) {
      newValue = 1;
    }

    props.value.value = newValue;

  };

  const onGestureBegin = (event: PanGestureHandlerEventPayload) => {
    "worklet";
    if (props.onStart) {
      runOnJS(props.onStart)();
    }
    handleScale.value = withTiming(
      1.25,
      { duration: 100 }
    );
    onGestureUpdate(event);
  };

  const onGestureFinish = () => {
    "worklet";

    handleScale.value = withTiming(
      1,
      { duration: 100 }
    );

    if (props.onEnd) {
      runOnJS(props.onEnd)(props.value.value);
    }
  };

  const pan = useMemo(
    () => Gesture.Pan().
      onBegin(onGestureBegin).
      onUpdate(onGestureUpdate).
      onEnd(onGestureFinish),
    [
      onGestureBegin,
      onGestureUpdate,
      onGestureFinish,
      props.value
    ]
  );
  const tap = useMemo(
    () => Gesture.Tap().onTouchesUp(onGestureFinish),
    [
      onGestureFinish
    ]
  );

  const composed = Gesture.Exclusive(
    pan,
    tap,
  );

  const onLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      if (props.vertical === true) {
        height.value = withTiming(
          layout.height,
          {
            duration: 5,
            reduceMotion: ReduceMotion.System,
          }
        );
      } else {
        width.value = withTiming(
          layout.width,
          {
            duration: 5,
            reduceMotion: ReduceMotion.System,
          }
        );
      }
    },
    [
      props.vertical
    ]
  );

  const thicknessStyle = props.vertical
    ? { width: props.sliderThickness }
    : { height: props.sliderThickness };

  return (
    <GestureDetector gesture={composed}>
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          onLayout={onLayout}
          style={[
            { borderRadius: 5 },
            {
              position: "relative",
              borderWidth: 0,
              padding: 0,
              backgroundColor: props.trackColor,
            },
            props.vertical === true
              ? { height: "100%" }
              : { width: "100%" },
            thicknessStyle,
          ]}
        >
          <Thumb
            channel="v"
            thumbShape={props.thumbShape ?? "ring"}
            thumbSize={props.thumbSize}
            thumbColor={props.thumbColor ?? "white"}
            thumbRingColor={props.thumbRingColor ?? "yellow"}
            handleStyle={handleStyle}
            vertical={props.vertical ?? false}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

export default Slider;
