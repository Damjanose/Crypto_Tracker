import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SignedInRoutes from "./SignedInNavigation/SignedInRoutes";

const RootStack = createNativeStackNavigator<{
  Login: undefined;
  SignedIn: undefined;
  LoginSplash: undefined;
}>();

export default () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="SignedIn" component={SignedInRoutes} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
