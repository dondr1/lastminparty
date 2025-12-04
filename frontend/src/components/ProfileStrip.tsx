import { useState, useRef } from "react";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { PROFILES } from "../data/profiles";

export default function ProfileStrip() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  function handlePress(index: any) {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: 0.5,
    });
  }
  return (
    <View style={{ height: 110, paddingTop: 40 }}>
      <FlatList
        data={PROFILES}
        horizontal
        ref={flatListRef}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 25 }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => handlePress(index)}
              style={{ marginRight: 20 }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: index === activeIndex ? 3 : 1,
                  borderColor: index === activeIndex ? "#568d66" : "#ccc",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
