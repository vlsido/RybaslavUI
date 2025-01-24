import { useMMKVNumber } from "react-native-mmkv";
import { ThemedView } from "../other/ThemedView";
import { useEffect } from "react";
import {
  StyleSheet,
  TextStyle,
} from "react-native";
import {
  useSignal,
  useSignalEffect
} from "@preact/signals-react";
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import { serverAddress } from "@/constants/Server";


function Temperature() {
  const socket = new WebSocket(`ws://${serverAddress}/temperature`);

  const [cachedTemperature, setCachedTemperature] = useMMKVNumber("temperature");
  const temperature = useSignal<number>(cachedTemperature ?? 0);
  const temperatureColor = useSharedValue<string>(getTemperatureColor());

  function getTemperatureColor() {
    if (temperature.value <= 45)
      return "green"
    else if (temperature.value > 45 && temperature.value <= 55)
      return "rgba(200, 153, 100, 1)"
    else if (temperature.value > 55 && temperature.value <= 60)
      return "orange"
    else
      return "red"
  }

  useSignalEffect(() => {
    if (temperature.value) {
      setCachedTemperature(temperature.value);
    }
  });

  function handleSocketOpen() {
    console.log("Socket opened");
  }

  function handleSocketMessage(event: MessageEvent<any>) {
    console.log("Socket message", typeof event.data);
    temperature.value = parseFloat(event.data);
  }

  function handleSocketClose() {
    console.log("Socket closed");
    removeSocketListeners();
  }

  function handleSocketError() {
    console.log("Socket error");
    removeSocketListeners();
  }

  function removeSocketListeners() {
    socket.removeEventListener("open", handleSocketOpen);
    socket.removeEventListener("message", (event) => handleSocketMessage(event));
    socket.removeEventListener("error", handleSocketError);
    socket.removeEventListener("close", handleSocketClose);

  }



  useEffect(() => {
    socket.addEventListener("open", handleSocketOpen);
    socket.addEventListener("message", (event) => handleSocketMessage(event));
    socket.addEventListener("error", handleSocketError);
    socket.addEventListener("close", handleSocketClose);

    return () => {
      removeSocketListeners();
    }
  }, []);

  const temperatureTextAnimatedStyle = useAnimatedStyle<TextStyle>(() => {
    return {
      color: temperatureColor.value
    }
  });

  return (
    <ThemedView
      style={styles.container}
      darkColor="rgba(20, 5, 10, 1)"
      lightColor="rgba(20, 5, 10, 1)"
    >
      <Animated.Text
        style={[
          {
            fontSize: 14
          },
          temperatureTextAnimatedStyle
        ]}
      >
        {temperature.value.toFixed(2)} °C
      </Animated.Text>
    </ThemedView>
  );
}

export default Temperature;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "2.5%",
    right: "5%",
    borderRadius: 5,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)"
  }
});
