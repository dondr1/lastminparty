import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { fetchHostingEvents, fetchUsersWhoLikedMyEvent } from "../api/events";

const TEST_EVENT_UUID = "7041cc61-a6f7-4191-adab-a020170887d5";

const HostEventsSwipeScreen = () => {
  useEffect(() => {
    async function test() {
      const users = await fetchUsersWhoLikedMyEvent(TEST_EVENT_UUID);
      console.log("Users who liked my event:", users);
    }
    test();
  }, []);

  return (
    <View>
      <Text>YourEventsScreen</Text>
      <Text>Hosted + attending event lists</Text>
    </View>
  );
};
