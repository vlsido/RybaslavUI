import {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import Ring from "./Ring";
import {
  StyleProp,
  ViewStyle
} from "react-native";

export interface ThumbProps {
  thumbColor: string;
  thumbRingColor?: string;
  thumbShape?: "circle" | "square" | "ring";
  thumbSize: number;
  handleStyle?: StyleProp<ViewStyle>;
  vertical?: boolean;
  channel?: "h" | "s" | "v" | "a";
}

function Thumb(props: ThumbProps) {
  const { width, height, borderRadius } = {
    width: props.thumbSize,
    height: props.thumbSize,
    borderRadius: props.thumbSize / 2,
  };

  const resultColor = useSharedValue<string>(props.thumbColor);
  const backgroundStyle = useAnimatedStyle<ViewStyle>(() => { return { backgroundColor: resultColor.value } });

  // When the values of channels change
  return <Ring
    thumbRingColor={props.thumbRingColor ?? "white"}
    width={width}
    height={height}
    borderRadius={borderRadius}
    backgroundStyle={backgroundStyle}
    handleStyle={props.handleStyle}
  />;
}

export default Thumb;
