import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../supabaseClient";
import { profileCache, checkHasProfile } from "../api/profile";
import { updateProfileState } from "../navigation/RootNavigator";

export default function CreateProfileScreen() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bioImage, setBioImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Check if profile exists on mount
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          console.log("🔍 Checking if profile already exists...");
          const exists = await checkHasProfile(user.id);

          if (exists) {
            console.log("⚠️ Profile exists, redirecting...");
            if (updateProfileState) {
              updateProfileState(true);
            }
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };

    checkExisting();
  }, []);

  async function pickImage(setter: (v: string) => void) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  }

  async function uploadImage(uri: string, folder: string, userId: string) {
    try {
      const res = await fetch(uri);
      const blob = await res.blob();

      const mimeType = blob.type;
      const fileExt = mimeType.split("/")[1] || "jpg";
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log("📤 Uploading:", filePath);

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, {
          upsert: true,
          contentType: mimeType,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    }
  }

  async function handleSave() {
    if (saving) return;

    if (!username.trim()) {
      Alert.alert("Error", "Username is required");
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (tagList.length === 0) {
      Alert.alert("Error", "Please add 2-3 tags");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("👤 Creating profile for:", user.id);

      // Upload images
      const avatarUrl = avatar
        ? await uploadImage(avatar, "avatars", user.id)
        : null;

      const bioImageUrl = bioImage
        ? await uploadImage(bioImage, "bio", user.id)
        : null;

      console.log("💾 Inserting profile...");

      // Insert profile
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        username,
        avatar_url: avatarUrl,
        bio: bio || null,
        bio_image_url: bioImageUrl,
        tags: tagList,
      });

      if (error) {
        console.error("❌ Insert error:", error);
        throw error;
      }

      console.log("✅ Profile created!");

      // Update cache
      profileCache.set(user.id, { exists: true, timestamp: Date.now() });

      // Update navigation state
      if (updateProfileState) {
        updateProfileState(true);
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      Alert.alert("Error", error.message || "Failed to create profile");
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        Create Your Profile
      </Text>
      <Text style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
        Complete your profile to get started
      </Text>

      <Text style={{ marginBottom: 4, fontWeight: "500" }}>Username *</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        editable={!saving}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 16,
          borderRadius: 8,
          backgroundColor: saving ? "#f5f5f5" : "#fff",
        }}
      />

      <Text style={{ marginBottom: 4, fontWeight: "500" }}>Bio (optional)</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        maxLength={150}
        multiline
        numberOfLines={3}
        placeholder="Tell us about yourself..."
        editable={!saving}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 16,
          borderRadius: 8,
          minHeight: 80,
          textAlignVertical: "top",
          backgroundColor: saving ? "#f5f5f5" : "#fff",
        }}
      />

      <Text style={{ marginBottom: 4, fontWeight: "500" }}>
        Interest Tags * (2-3 tags)
      </Text>
      <TextInput
        value={tags}
        onChangeText={setTags}
        placeholder="music, party, drinks"
        editable={!saving}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          backgroundColor: saving ? "#f5f5f5" : "#fff",
        }}
      />

      <View style={{ marginBottom: 12 }}>
        <Button
          title="Pick Avatar (Optional)"
          onPress={() => pickImage(setAvatar)}
          disabled={saving}
        />
      </View>
      {avatar && (
        <Image
          source={{ uri: avatar }}
          style={{
            width: 100,
            height: 100,
            marginBottom: 16,
            borderRadius: 50,
            alignSelf: "center",
          }}
        />
      )}

      <View style={{ marginBottom: 12 }}>
        <Button
          title="Pick Bio Image (Optional)"
          onPress={() => pickImage(setBioImage)}
          disabled={saving}
        />
      </View>
      {bioImage && (
        <Image
          source={{ uri: bioImage }}
          style={{
            width: 200,
            height: 133,
            marginBottom: 20,
            borderRadius: 8,
            alignSelf: "center",
          }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        {saving ? (
          <View
            style={{
              padding: 16,
              backgroundColor: "#f0f0f0",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="small" color="#6A4C93" />
            <Text style={{ marginTop: 8, color: "#666" }}>
              Creating your profile...
            </Text>
          </View>
        ) : (
          <Button
            title="Create Profile"
            onPress={handleSave}
            disabled={saving}
          />
        )}
      </View>
    </ScrollView>
  );
}
