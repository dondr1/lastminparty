import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { acceptInvite, fetchMyInvites } from "../api/invites";
import { InviteItem } from "../types/Invite";
import { updateInviteStatus } from "../api/invites";
export default function InboxScreen() {
  const [invites, setInvites] = useState<InviteItem[]>([]);

  useEffect(() => {
    async function loadInvites() {
      const data = await fetchMyInvites();
      setInvites(data);
    }
    loadInvites();
  }, []);
  async function handleAccept(inviteId: number, eventUuid: string) {
    try {
      await updateInviteStatus(inviteId, "accepted");
      setInvites((prev) =>
        prev.map((i) => (i.id === inviteId ? { ...i, status: "accepted" } : i))
      );
      await acceptInvite(eventUuid);
    } catch (e) {
      alert("Failed to accept invite");
    }
  }

  async function handleReject(inviteId: number) {
    try {
      await updateInviteStatus(inviteId, "rejected");
      setInvites((prev) =>
        prev.map((i) => (i.id === inviteId ? { ...i, status: "rejected" } : i))
      );
    } catch (e) {
      alert("Failed to reject invite");
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20 }}>Inbox</Text>
      <FlatList
        data={invites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          if (!item?.event?.host) return null;
          console.log("item:", item);
          const { host, title } = item.event;
          console.log(host, title);
          return (
            <View
              style={{
                flexDirection: "row",
                padding: 16,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: host.avatar_url }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginRight: 12,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", fontSize: 14 }}>
                  @{host.username} invited you
                </Text>

                <Text style={{ color: "#666", marginTop: 4 }}>
                  {title.length > 30 ? title.slice(0, 30) + "…" : title}
                </Text>

                {item.status === "pending" && (
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={() => handleAccept(item.id, item.event.uuid_id)}
                      style={{
                        backgroundColor: "#4CAF50",
                        padding: 8,
                        borderRadius: 6,
                        marginRight: 10,
                      }}
                    >
                      <Text style={{ color: "white" }}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleReject(item.id)}
                      style={{
                        backgroundColor: "#E53935",
                        padding: 8,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ color: "white" }}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === "accepted" && (
                  <Text style={{ color: "green", marginTop: 8 }}>
                    ✔ Accepted
                  </Text>
                )}

                {item.status === "rejected" && (
                  <Text style={{ color: "red", marginTop: 8 }}>✖ Rejected</Text>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
