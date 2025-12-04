import { View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileIcon() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Profile")}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 20,
      }}
    >
      <Image
        source={{
          uri: "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png",
        }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    </TouchableOpacity>
  );
}
