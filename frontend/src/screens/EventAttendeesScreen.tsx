import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  fetchEventAttendees,
  removeEventParticipant,
  upsertHostDecision,
} from "../api/events";

type HostingEvent = {
  uuid_id: string;
  title: string;
};

type Attendee = {
  user_id: string;
  joined_at: string;
  profile: {
    id?: string;
    username?: string;
    avatar_url?: string;
  };
};

const EventAttendeesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute() as {
    params: {
      event: HostingEvent;
    };
  };
  const event = route.params?.event;
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    async function load() {
      if (!event?.uuid_id) return;
      const data = await fetchEventAttendees(event.uuid_id);
      setAttendees(data ?? []);
    }
    load();
  }, [event?.uuid_id]);

  const handleRemove = (attendee: Attendee) => {
    const username = attendee.profile?.username ?? "user";
    Alert.alert(
      "Remove attendee",
      `Remove @${username} from event?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            if (!event?.uuid_id) return;
            await removeEventParticipant(event.uuid_id, attendee.user_id);
            await upsertHostDecision(
              event.uuid_id,
              attendee.user_id,
              "rejected",
            );
            setAttendees((prev) =>
              prev.filter((item) => item.user_id !== attendee.user_id),
            );
          },
        },
      ],
    );
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
      <Text style={styles.header}>Attendees</Text>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => {
          const joined = item.joined_at
            ? new Date(item.joined_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "";
          return (
            <View style={styles.row}>
              <Image
                source={{
                  uri:
                    item.profile?.avatar_url ??
                    "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png",
                }}
                style={styles.avatar}
              />
              <View style={styles.rowText}>
                <Text style={styles.username}>
                  @{item.profile?.username ?? "user"}
                </Text>
                <Text style={styles.joinedText}>Joined on {joined}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(item)}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No attendees yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

export default EventAttendeesScreen;

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
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  joinedText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 24,
  },
});
