import { View, Text } from "react-native";

export default function BottomNavBar() {
  return (
    <View
      style={{
        height: 75,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <Text> Search</Text>
      <Text> Events</Text>
      <Text>Home</Text>
      <Text>Inbox</Text>
      <Text> Add</Text>
    </View>
  );
}
