import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { createEvent } from "../api/events";
import { supabase } from "../../supabaseClient";

export default function AddEventScreen() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [inviteOnly, setInviteOnly] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  async function handleCreate() {
    if (submitting) return; // 🔒 BLOCK double submit
    setSubmitting(true);

    try {
      await createEvent({
        title,
        date,
        location,
        image_url: imageUrl,
        isInviteOnly: inviteOnly,
      });

      alert("Event created!");
    } catch (e) {
      console.error(e);
      alert("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} />

      <Text>Date (YYYY-MM-DD)</Text>
      <TextInput value={date} onChangeText={setDate} />

      <Text>Location</Text>
      <TextInput value={location} onChangeText={setLocation} />

      <Text>Image URL</Text>
      <TextInput value={imageUrl} onChangeText={setImageUrl} />

      <Button
        title={inviteOnly ? "Invite Only: ON" : "Invite Only: OFF"}
        onPress={() => setInviteOnly((v) => !v)}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title={submitting ? "Creating..." : "Create Event"}
          disabled={submitting}
          onPress={handleCreate}
        />
      </View>
    </ScrollView>
  );
}
