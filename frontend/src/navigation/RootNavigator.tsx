import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { supabase } from "../../supabaseClient";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import AddEventScreen from "../screens/AddEventScreen";
import YourEventsScreen from "../screens/YourEventsScreen";
import InboxScreen from "../screens/InboxScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateProfileScreen from "../screens/CreateProfileScreen";
import ManageEventScreen from "../screens/ManageEventScreen";
import EventWaitlistSwipeScreen from "../screens/EventWaitlistSwipeScreen";
import EventAttendeesScreen from "../screens/EventAttendeesScreen";
import EditEventScreen from "../screens/EditEventScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import { checkHasProfile, profileCache } from "../api/profile";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  CreateProfile: undefined;
  MainTabs: undefined;
  Profile: undefined;
  ManageEvent: { event: any };
  EventWaitlistSwipe: { event: any };
  EventAttendees: { event: any };
  EditEvent: { event: any };
  EventDetails: { event: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddEvent" component={AddEventScreen} />
      <Tab.Screen name="YourEvents" component={YourEventsScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
    </Tab.Navigator>
  );
}

// Expose function to force profile state update
export let updateProfileState: ((hasProfile: boolean) => void) | null = null;

export default function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  // Expose the setter
  useEffect(() => {
    updateProfileState = (profileExists: boolean) => {
      console.log("🔄 Updating profile state:", profileExists);
      setHasProfile(profileExists);
    };
    return () => {
      updateProfileState = null;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log("🔵 Initializing...");

        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log(
          "📱 Session:",
          session ? `User ${session.user.id}` : "No session"
        );

        if (!mounted) {
          console.log("⚠️ Component unmounted, aborting init");
          return;
        }

        if (session?.user) {
          console.log("👤 User found:", session.user.id);
          setUser(session.user);

          // Clear cache and check profile
          console.log("🗑️ Clearing cache before check");
          profileCache.delete(session.user.id);

          console.log("🔍 Starting profile check...");
          const profileExists = await checkHasProfile(session.user.id);
          console.log("✅ Profile check complete:", profileExists);

          if (mounted) {
            console.log("💾 Setting hasProfile:", profileExists);
            setHasProfile(profileExists);
          } else {
            console.log("⚠️ Component unmounted after profile check");
          }
        } else {
          console.log("❌ No session");
          setUser(null);
          setHasProfile(false);
        }
      } catch (error) {
        console.error("❌ Initialize error:", error);
        setUser(null);
        setHasProfile(false);
      } finally {
        if (mounted) {
          console.log("✅ Setting isReady to true");
          setIsReady(true);
        } else {
          console.log("⚠️ Component unmounted, not setting isReady");
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔁 Auth event:", event);

      if (!mounted) {
        console.log("⚠️ Component unmounted, ignoring auth event");
        return;
      }

      if (event === "SIGNED_OUT") {
        console.log("👋 Signed out");
        setUser(null);
        setHasProfile(false);
        setIsReady(true);
        return;
      }

      if (session?.user) {
        console.log("👤 Session user:", session.user.id);
        setUser(session.user);

        if (event === "SIGNED_IN") {
          console.log("🔐 SIGNED_IN event - checking profile");
          // Clear cache on sign in
          profileCache.delete(session.user.id);

          console.log("🔍 Starting profile check for SIGNED_IN...");
          const profileExists = await checkHasProfile(session.user.id);
          console.log(
            "✅ Profile check complete for SIGNED_IN:",
            profileExists
          );

          if (mounted) {
            console.log(
              "💾 Setting hasProfile:",
              profileExists,
              "and isReady: true"
            );
            setHasProfile(profileExists);
            setIsReady(true);
          } else {
            console.log("⚠️ Component unmounted after profile check");
          }
        } else {
          console.log("ℹ️ Non-SIGNED_IN event, just setting isReady");
          setIsReady(true);
        }
      } else {
        console.log("❌ No user in session");
        setUser(null);
        setHasProfile(false);
        setIsReady(true);
      }
    });

    initialize();

    return () => {
      console.log("🧹 Cleanup");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  console.log("🧭 State:", { isReady, userId: user?.id, hasProfile });

  if (!isReady) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : !hasProfile ? (
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ManageEvent" component={ManageEventScreen} />
            <Stack.Screen
              name="EventWaitlistSwipe"
              component={EventWaitlistSwipeScreen}
            />
            <Stack.Screen
              name="EventAttendees"
              component={EventAttendeesScreen}
            />
            <Stack.Screen name="EditEvent" component={EditEventScreen} />
            <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
