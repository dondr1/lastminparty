import React from "react";
import { View } from "react-native";
import ProfileIcon from "../components/ProfileIcon";
import ProfileStrip from "../components/ProfileStrip";
import DeckSwiper from "../components/DeckSwiper";
import BottomNavBar from "../components/BottomNavBar";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ProfileIcon />

      <ProfileStrip />

      <DeckSwiper />

      <BottomNavBar />
    </View>
  );
}
