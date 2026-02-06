import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserSwipeCard from "../components/deck/UserSwipeCard";
import {
  addEventParticipant,
  fetchEventAttendees,
  fetchHostDecisionMap,
  fetchWaitlistUsers,
  upsertHostDecision,
} from "../api/events";
import { formatEventDateTime } from "../utils/eventTime";

type HostingEvent = {
  uuid_id: string;
  title: string;
  date: string;
  start_time?: string | null;
  is_invite_only: boolean;
};

type WaitlistUser = {
  user_id: string;
  profile: {
    id?: string;
    username?: string;
    avatar_url?: string;
    bio?: string | null;
    tags?: string[] | null;
  };
};

const EventWaitlistSwipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute() as {
    params: {
      event: HostingEvent;
    };
  };

  const event = route.params?.event;
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const behindScale = useSharedValue(0.9);
  const behindStyle = useAnimatedStyle(() => ({
    transform: [{ scale: behindScale.value }, { translateY: 20 }],
  }));

  useEffect(() => {
    async function load() {
      if (!event?.uuid_id) return;
      const [waitlist, decisions, attendees] = await Promise.all([
        fetchWaitlistUsers(event.uuid_id),
        fetchHostDecisionMap(event.uuid_id),
        fetchEventAttendees(event.uuid_id),
      ]);

      const attendeeIds = new Set(attendees.map((a) => a.user_id));

      const filtered = waitlist.filter(
        (user) =>
          !attendeeIds.has(user.user_id) &&
          decisions[user.user_id] !== "accepted",
      );

      setUsers(filtered);
      setActiveIndex(0);
    }
    load();
  }, [event?.uuid_id]);

  const handleSwipe = async (direction: "left" | "right") => {
    const currentUser = users[activeIndex];
    if (!currentUser || !event?.uuid_id) return;

    if (direction === "right") {
      await upsertHostDecision(event.uuid_id, currentUser.user_id, "accepted");
      await addEventParticipant(event.uuid_id, currentUser.user_id);
      const nextUsers = users.filter((u) => u.user_id !== currentUser.user_id);
      setUsers(nextUsers);
      if (activeIndex >= nextUsers.length) {
        setActiveIndex(0);
      }
    } else {
      await upsertHostDecision(event.uuid_id, currentUser.user_id, "rejected");
      setUsers((prev) => {
        const next = [...prev];
        const [moved] = next.splice(activeIndex, 1);
        next.push(moved);
        return next;
      });
      setActiveIndex((prev) =>
        prev >= users.length - 1 ? 0 : prev + 1,
      );
    }

    behindScale.value = withTiming(1, { duration: 200 }, () => {
      scheduleOnRN(() => {
        behindScale.value = 0.9;
      });
    });
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to Manage Event</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {event.title} • {formatEventDateTime(event.date)}
        </Text>
      </View>

      <View style={styles.cardArea}>
        {users[activeIndex + 1] && (
          <Animated.View style={[styles.behindCard, behindStyle]}>
            <UserSwipeCard
              user={users[activeIndex + 1]}
              onSwipe={() => {}}
            />
          </Animated.View>
        )}

        {users[activeIndex] ? (
          <Animated.View style={styles.frontCard}>
            <UserSwipeCard user={users[activeIndex]} onSwipe={handleSwipe} />
          </Animated.View>
        ) : (
          <Text style={styles.emptyText}>No one is waiting yet.</Text>
        )}
      </View>
    </View>
  );
};

export default EventWaitlistSwipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  backText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 12,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  cardArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  behindCard: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  frontCard: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
  },
});
