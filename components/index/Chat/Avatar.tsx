import { Image, StyleSheet, View } from "react-native";

interface AvatarProps {
  user: "assistant" | "user"
}

function Avatar(props: AvatarProps) {
  return (
    <View style={styles.container}>

      <Image
        style={styles.container}
        source={props.user === "user"
          ? require("../../../assets/images/defaultAvatarImage.png")
          : require("../../../assets/images/defaultAvatarImage.png")}
      />
    </View>
  );
}

export default Avatar;

const styles = StyleSheet.create({
  container: {
    height: 36,
    width: 36,
    borderRadius: 60,
  }
})
