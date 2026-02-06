import { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

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

type UserSwipeCardProps = {
  user: WaitlistUser;
  onSwipe: (direction: "left" | "right") => void;
};

export default function UserSwipeCard({ user, onSwipe }: UserSwipeCardProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
  }, [user.user_id]);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value > 120) {
        scheduleOnRN(() => onSwipe("right"));
        translateX.value = withSpring(0);
        return;
      }
      if (translateX.value < -120) {
        scheduleOnRN(() => onSwipe("left"));
        translateX.value = withSpring(0);
        return;
      }
      translateX.value = withSpring(0);
    });

  const swipeStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-200, 0, 200], [-10, 0, 10]);
    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }],
    };
  });

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 100], [0, 1]),
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-100, 0], [1, 0]),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardContainer, swipeStyle]}>
        <View style={styles.card}>
          <Image
            source={{
              uri:
                user.profile?.avatar_url ??
                "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.nameText}>
            {user.profile?.username ? `@${user.profile.username}` : "User"}
          </Text>
          {user.profile?.bio ? (
            <Text style={styles.bioText}>{user.profile.bio}</Text>
          ) : null}
          <View style={styles.tagsRow}>
            {(user.profile?.tags ?? []).slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Animated.View style={[styles.likeBadge, likeStyle]}>
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.nopeBadge, nopeStyle]}>
            <Text style={styles.nopeText}>NOPE</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "85%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e7dbc2ff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
  },
  bioText: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#111827",
  },
  likeBadge: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  likeText: {
    fontSize: 18,
    color: "#568d66",
    fontWeight: "700",
  },
  nopeBadge: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  nopeText: {
    fontSize: 18,
    color: "#cb0b0a",
    fontWeight: "700",
  },
});
