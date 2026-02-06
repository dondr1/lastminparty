import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatEventDateTime } from "../utils/eventTime";

type AttendingEvent = {
  uuid_id: string;
  title: string;
  image_url: string | null;
  date: string;
  start_time?: string | null;
  location?: string | null;
  is_invite_only: boolean;
  host?: {
    username?: string;
    avatar_url?: string;
  } | null;
};

const EventDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute() as {
    params: {
      event: AttendingEvent;
    };
  };
  const event = route.params?.event;

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
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Image
        source={{
          uri:
            event.image_url ??
            "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png",
        }}
        style={styles.poster}
      />
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.subtitle}>
        {formatEventDateTime(event.date, event.start_time)}
      </Text>
      {event.location ? (
        <Text style={styles.subtitle}>@ {event.location}</Text>
      ) : null}
      <Text style={styles.hostText}>
        Hosted by {event.host?.username ? `@${event.host.username}` : "host"}
      </Text>
    </View>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f8",
    padding: 16,
  },
  backText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 12,
  },
  poster: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 6,
  },
  hostText: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 8,
  },
});
