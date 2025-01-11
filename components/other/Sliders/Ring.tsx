import Animated from "react-native-reanimated";

import { I18nManager, Platform, StyleProp, StyleSheet, ViewStyle } from "react-native";

const enableAndroidHardwareTextures =
  Platform.OS === "android" && Platform.Version >= 24 && Platform.Version <= 28;

interface RingProps {
  width: number;
  height: number;
  borderRadius: number;
  thumbRingColor?: string;
  thumbColor?: string;
  handleStyle?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export default function Ring(props: RingProps) {
  const thumb_Color = props.thumbColor ?? undefined;

  const computedStyle = {
    width: props.width,
    height: props.height,
    borderRadius: props.borderRadius,
    backgroundColor: (thumb_Color || "#ffffff") + 50,
    borderColor: props.thumbColor,
    borderWidth: 1,
  };

  return (
    <Animated.View
      style={[
        styles.handle,
        props.style,
        computedStyle,
        props.handleStyle,
        { backgroundColor: props.thumbRingColor },
      ]}
      renderToHardwareTextureAndroid={enableAndroidHardwareTextures}
    >
      <Animated.View
        style={[
          styles.shadow,
          {
            borderRadius: props.borderRadius,
            zIndex: 100,
            width: Math.round(props.width * 0.75),
            height: Math.round(props.width * 0.75),
          },
          props.backgroundStyle,
          props.innerStyle,
        ]}
      />
    </Animated.View>
  );
}

const isRtl = I18nManager.isRTL;

// Thumb
const styles = StyleSheet.create({
  handle: {
    position: "absolute",
    ...(isRtl ? { right: 0 } : { left: 0 }),
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});

