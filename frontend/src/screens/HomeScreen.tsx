import React, { useEffect } from "react";
import { View } from "react-native";
import ProfileIcon from "../components/ProfileIcon";
import ProfileStrip from "../components/ProfileStrip";
import DeckSwiper from "../components/deck/DeckSwiper";
import BottomNavBar from "../components/BottomNavBar";
import { fetchEvents } from "../services/events";

export default function HomeScreen() {
  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ProfileIcon />

      <DeckSwiper />
    </View>
  );
}
