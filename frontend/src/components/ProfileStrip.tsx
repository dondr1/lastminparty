import { useRef } from "react";
import { View, FlatList, Image, TouchableOpacity, Text } from "react-native";

type Profile = {
  id: string;
  username: string;
  avatar_url: string;
};

type ProfileStripProps = {
  profiles: Profile[];
  activeIndex: number;
  decisions: Record<number, "liked" | "rejected">;
  onProfilePress: (index: number) => void;
};

function truncateUsername(name: string, max = 8) {
  return name.length > max ? name.slice(0, max) + "…" : name;
}

export default function ProfileStrip({
  profiles,
  activeIndex,
  decisions,
  onProfilePress,
}: ProfileStripProps) {
  const flatListRef = useRef<FlatList>(null);

  function handlePress(index: number) {
    onProfilePress(index);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  }

  return (
    <View
      style={{
        height: 190,
        paddingTop: 30,
        paddingBottom: 10,
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      <FlatList
        data={profiles}
        horizontal
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 25, overflow: "visible" }}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          const decision = decisions[index];

          let borderColor = "#ccc";
          let borderWidth = 1;
          let scale = 1;

          if (decision === "liked") {
            borderColor = "rgba(3, 99, 0, 0.93)";
            borderWidth = 3.6;
          }

          if (decision === "rejected") {
            borderColor = "rgba(255, 0, 0, 1)";
            borderWidth = 3.6;
          }

          if (isActive) {
            borderColor = "#b637ffff"; // purple
            borderWidth = 3.6;
            scale = 1.15;
          }

          return (
            <TouchableOpacity
              onPress={() => handlePress(index)}
              style={{
                marginRight: 20,
                alignItems: "center",
                paddingVertical: 10,
                transform: [{ scale }],
              }}
            >
              <Image
                source={{ uri: item.avatar_url }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth,
                  borderColor,
                }}
              />

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "#333",
                }}
              >
                {truncateUsername(item.username)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
