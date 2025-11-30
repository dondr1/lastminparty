import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // TEMP: always go to Login after 1s
    const timer = setTimeout(() => {
      navigation.navigate("Login" as never);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Splash Screen</Text>
      <Text>Loading user session...</Text>
    </View>
  );
};

export default SplashScreen;
