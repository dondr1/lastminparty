import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import SwipeCard from "./SwipeCard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { insertEventDecision } from "../../api/decisions";
import { fetchEvents } from "../../api/events";
import { createInvite } from "../../api/invites";
import { EventItem } from "../../types/Event";
import ProfileStrip from "../ProfileStrip";
import { supabase } from "../../../supabaseClient";

export default function DeckSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [decisions, setDecisions] = useState<
    Record<number, "liked" | "rejected">
  >({});

  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function loadEvents() {
      const data = await fetchEvents();
      setEvents(data);
    }
    loadEvents();
  }, []);
  const profiles = events.map((event) => event.creator).filter(Boolean);

  const behindScale = useSharedValue(0.9);

  const behindStyle = useAnimatedStyle(() => ({
    transform: [{ scale: behindScale.value }, { translateY: 20 }],
  }));

  async function handleSwipe(direction: "left" | "right") {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      alert("Please log in to interact with events");
      return;
    }
    const currentEvent = events[activeIndex];
    if (!currentEvent) return;
    // 1️⃣ store decision for current card
    setDecisions((prev) => ({
      ...prev,
      [activeIndex]: direction === "right" ? "liked" : "rejected",
    }));

    insertEventDecision(
      currentEvent.id,
      direction == "right" ? "liked" : "rejected"
    );

    if (direction === "right") {
      try {
        await createInvite(currentEvent.uuid_id);
      } catch (err) {
        console.error("Failed to create invite:", err);
      }
    }

    // 2️⃣ animate + move forward
    behindScale.value = withTiming(1, { duration: 200 }, () => {
      scheduleOnRN(() => {
        setActiveIndex((prev) => prev + 1);
        behindScale.value = 0.9;
      });
    });
  }

  if (events.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "#6b7280" }}>
          No events available right now.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* PROFILE STRIP */}

      <ProfileStrip
        decisions={decisions}
        profiles={profiles}
        activeIndex={activeIndex}
        onProfilePress={(index) => setActiveIndex(index)}
      />

      {/* CARD AREA */}

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 20, // keeps card away from tab bar
        }}
      >
        {events[activeIndex + 1] && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "100%",
                alignItems: "center",
              },
              behindStyle,
            ]}
          >
            <SwipeCard event={events[activeIndex + 1]} onSwipe={() => {}} />
          </Animated.View>
        )}

        {events[activeIndex] && (
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              alignItems: "center",
            }}
          >
            <SwipeCard event={events[activeIndex]} onSwipe={handleSwipe} />
          </Animated.View>
        )}
      </View>
    </View>
  );
}
