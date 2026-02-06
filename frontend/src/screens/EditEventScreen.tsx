import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { updateEvent } from "../api/events";

type HostingEvent = {
  uuid_id: string;
  title: string;
  image_url: string | null;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
};

const EditEventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute() as {
    params: {
      event: HostingEvent;
    };
  };
  const event = route.params?.event;

  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? "");
  const [startTime, setStartTime] = useState(event?.start_time ?? "");
  const [endTime, setEndTime] = useState(event?.end_time ?? "");
  const [imageUrl, setImageUrl] = useState(event?.image_url ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!event?.uuid_id || saving) return;
    setSaving(true);
    try {
      await updateEvent(event.uuid_id, {
        title,
        date,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        image_url: imageUrl || undefined,
      });
      navigation.goBack();
    } catch (e) {
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
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

      <Text style={styles.header}>Edit Event</Text>

      <Text style={styles.label}>Event name</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Event date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} />

      <Text style={styles.label}>Event time (HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={startTime ?? ""}
        onChangeText={setStartTime}
      />

      <Text style={styles.label}>Close time (HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={endTime ?? ""}
        onChangeText={setEndTime}
      />

      <Text style={styles.label}>Event poster URL</Text>
      <TextInput
        style={styles.input}
        value={imageUrl ?? ""}
        onChangeText={setImageUrl}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EditEventScreen;

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
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveText: {
    color: "white",
    fontWeight: "700",
  },
});
