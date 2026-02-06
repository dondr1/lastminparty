import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatEventDateTime } from "../utils/eventTime";

type HostingEvent = {
  uuid_id: string;
  title: string;
  image_url: string | null;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  is_invite_only: boolean;
};

const ManageEventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute() as {
    params: {
      event: HostingEvent;
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

      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.subtitle}>
            {formatEventDateTime(event.date, event.start_time)}
            {event.location ? ` @ ${event.location}` : ""}
          </Text>
          <Text style={styles.hostedBy}>Hosted by you</Text>
        </View>
        <Image
          source={{
            uri:
              event.image_url ??
              "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png",
          }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.options}>
        {event.is_invite_only && (
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() =>
              navigation.navigate("EventWaitlistSwipe", { event })
            }
          >
            <Text style={styles.optionText}>Waitlist (Swipe)</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("EventAttendees", { event })}
        >
          <Text style={styles.optionText}>Attendees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("EditEvent", { event })}
        >
          <Text style={styles.optionText}>Edit Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageEventScreen;

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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  hostedBy: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  options: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
