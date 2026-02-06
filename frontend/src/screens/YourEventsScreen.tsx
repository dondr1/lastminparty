import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const YourEventsScreen = () => {
  const TABS = ["attending", "hosting"] as const;
  type Tab = (typeof TABS)[number];
  const [tab, setTab] = useState<Tab>("attending");

  return (
    <View style={{ flexDirection: "row" }}>
      {TABS.map((t) => (
        <Pressable
          key={t}
          onPress={() => setTab(t)}
          style={{
            flex: 1,
            padding: 12,
            borderBottomWidth: tab === t ? 2 : 0,
          }}
        >
          <Text style={{ textAlign: "center" }}>
            {t === "attending" ? "Attending" : "Hosting"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default YourEventsScreen;
