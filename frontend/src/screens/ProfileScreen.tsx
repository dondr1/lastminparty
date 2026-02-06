import React from "react";
import { View, Button } from "react-native";
import { supabase } from "../../supabaseClient";

export default function ProfileScreen() {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <View style={{ padding: 20 }}>
      <Button title="Log out" onPress={handleLogout} />
    </View>
  );
}
