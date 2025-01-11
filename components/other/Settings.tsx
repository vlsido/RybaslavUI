import { MaterialIcons } from "@expo/vector-icons";
import { useSignal } from "@preact/signals-react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import Animated, { FadeIn, FadeOut, runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import StorageData from "../index/StorageData";
import Volume from "../index/Volume/Volume";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useMMKVObject } from "react-native-mmkv";
import { useMemo } from "react";

interface Position {
  x: number;
  y: number;
}

function Settings() {
  const isSettingsVisible = useSignal<boolean>(false);

  const [cachedSettingsPosition, setCachedSettingsPosition] = useMMKVObject<Position>("settings.modal.position");

  const originalPosition = useSharedValue<Position>(cachedSettingsPosition ?? { x: 0, y: 0 });
  const position = useSharedValue<Position>(cachedSettingsPosition ?? { x: 0, y: 0 });

  const dragGesture = useMemo(() =>
    Gesture.Pan()
      .onBegin((event) => {
        position.value = {
          x: originalPosition.value.x + event.translationX,
          y: originalPosition.value.y + event.translationY
        };
      }).onUpdate((event) => {
        position.value = {
          x: originalPosition.value.x + event.translationX,
          y: originalPosition.value.y + event.translationY
        };
      }).onEnd(() => {
        originalPosition.value = position.value;
        runOnJS(setCachedSettingsPosition)(position.value);
      }),
    [position]
  );

  const draggableAnimatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      transform: [
        { translateX: position.value.x },
        { translateY: position.value.y }
      ]
    }
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.container}
        onPress={() => isSettingsVisible.value = !isSettingsVisible.value}
      >
        <MaterialIcons
          name="settings"
          color="white"
          size={32}
        />
      </Pressable>
      {isSettingsVisible.value === true && (
        <Animated.View
          style={[styles.modalContainer, draggableAnimatedStyle]}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <GestureDetector gesture={dragGesture}>
            <View style={[styles.dragBar]} />
          </GestureDetector>
          <View style={styles.modalBody}>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>
                Storage:
              </Text>
              <StorageData />
            </View>
            <View style={styles.itemView}>
              <Volume />
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "2.5%",
    left: "5%",
  },
  modalContainer: {
    position: "absolute",
    top: "25%",
    left: 0,
    backgroundColor: "rgba(100,100,233, 0.5)",
    borderRadius: 10
  },
  modalBody: {
    padding: 10
  },
  itemView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    gap: 10
  },
  itemText: {
    color: "white"
  },
  dragBar: {
    width: "80%",
    height: 10,
    backgroundColor: "white",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: "center"
  }
});
