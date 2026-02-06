import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Event } from "../../types/Event";
type SwipeCardProps = {
  event: Event;
  onSwipe: (direction: "left" | "right") => void;
};

export default function SwipeCard({ event, onSwipe }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const detailsOpen = useSharedValue(0); // 0 closed, 1 open

  //  Reset when card changes
  useEffect(() => {
    translateX.value = 0;
    detailsOpen.value = 0;
  }, [event.id]);

  /* ------------------ GESTURE ------------------ */
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (detailsOpen.value === 1) return;
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (detailsOpen.value === 1) return;

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

  /* ------------------ SWIPE ANIMATION ------------------ */
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

  /* ------------------ DETAILS PANEL ------------------ */
  const detailsStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(detailsOpen.value, [0, 1], [500, 0]),
      },
    ],
  }));

  /* 🔽 Collapse arrow fades in */
  const collapseArrowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(detailsOpen.value, [0, 1], [0, 1]),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardContainer, swipeStyle]}>
        {/* MAIN CARD */}
        <View style={styles.card}>
          <Text style={styles.titleText}>{event.title}</Text>
          <Text style={styles.subText}>{event.location}</Text>
          <Text style={styles.subText}>{event.date}</Text>
          <Animated.View style={[styles.likeBadge, likeStyle]}>
            <Text style={styles.likeText}>💖</Text>
          </Animated.View>

          <Animated.View style={[styles.nopeBadge, nopeStyle]}>
            <Text style={styles.nopeText}>💔</Text>
          </Animated.View>

          {/* MORE BUTTON */}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => {
              detailsOpen.value = withTiming(1, { duration: 300 });
            }}
          >
            <Text style={styles.moreText}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* DETAILS OVERLAY */}
        <Animated.View style={[styles.detailsPanel, detailsStyle]}>
          {/* 🔽 Collapse Arrow */}
          <Animated.View style={[styles.collapseButton, collapseArrowStyle]}>
            <TouchableOpacity
              onPress={() => {
                detailsOpen.value = withTiming(0, { duration: 300 });
              }}
            >
              <Text style={styles.collapseIcon}>⌄</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.detailsTitle}>Event Details</Text>
          <Text style={styles.detailsText}>
            Description, date, location, capacity, rules, etc.
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

/* ------------------ STYLES ------------------ */
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
    justifyContent: "space-between",
  },

  titleText: {
    fontSize: 28,
    fontWeight: "700",
  },

  subText: {
    fontSize: 20,
    fontWeight: "500",
  },

  likeBadge: {
    position: "absolute",
    top: 20,
    right: 20,
  },

  likeText: {
    fontSize: 36,
    color: "#568d66",
  },

  nopeBadge: {
    position: "absolute",
    top: 20,
    left: 20,
  },

  nopeText: {
    fontSize: 36,
    color: "#cb0b0a",
  },

  moreButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },

  moreText: {
    fontSize: 28,
    color: "#333",
  },

  detailsPanel: {
    position: "absolute",
    width: "80%",
    height: "80%",
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  collapseButton: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
  },

  collapseIcon: {
    fontSize: 28,
    opacity: 0.7,
  },

  detailsTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },

  detailsText: {
    fontSize: 16,
    color: "#444",
  },
});
