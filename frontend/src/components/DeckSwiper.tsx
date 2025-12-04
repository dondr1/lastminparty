import { View, Text } from "react-native";

export default function DeckSwiper() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <View
        style={{
          width: "90%",
          height: "70%",
          backgroundColor: "#e5e7eb",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Deck Card Placeholder</Text>
      </View>
    </View>
  );
}
