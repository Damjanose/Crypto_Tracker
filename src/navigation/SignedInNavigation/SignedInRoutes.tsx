import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CryptoListScreen from "../../screens/CryptoList/CryptoListScreen";
import AddNewCrypto from "../../screens/AddNewCrypto/AddNewCrypto";

const Stack = createNativeStackNavigator();

const SignedInRoutes = () => (
  <Stack.Navigator
    initialRouteName="CryptoList"
    screenOptions={{ headerShown: false, animation: "fade" }}
  >
    <Stack.Screen name="CryptoList" component={CryptoListScreen} />
    <Stack.Screen name="AddNewCrypto" component={AddNewCrypto} />
  </Stack.Navigator>
);

export default SignedInRoutes;
