import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./AddNewCrypto.styles.ts";

const STORAGE_KEY = "userCryptos";

export default function AddNewCryptoScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const symLower = query.trim().toLowerCase();
  const disabled = loading || !symLower;

  const onAdd = async () => {
    if (disabled) return;
    setLoading(true);

    try {
      const resp = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
          symLower
        )}`
      );
      if (!resp.ok) throw new Error(`Search failed (${resp.status})`);
      const { coins } = (await resp.json()) as {
        coins: Array<{ id: string; symbol: string; name: string }>;
      };

      const match =
        coins.find((c) => c.symbol.toLowerCase() === symLower) ||
        coins.find((c) => c.name.toLowerCase() === symLower);

      if (!match) {
        throw new Error("No matching coin");
      }

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];

      if (list.includes(match.id)) {
        Alert.alert("Already added", `${match.name} is already in your list.`);
      } else {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...list, match.id])
        );
        navigation.goBack();
      }
    } catch (err) {
      console.warn(err);
      Alert.alert(
        "Crypto not found",
        `Could not find "${query.trim()}". Please check the symbol or name and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} hitSlop={50}>
          <View style={styles.inner}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={20} color="#355E8E" />
              <Text style={styles.backText}> Back to list</Text>
            </TouchableOpacity>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Add a Cryptocurrency</Text>

              <TextInput
                style={styles.input}
                placeholder="Use a name or ticker symbol..."
                placeholderTextColor="#C4C4C4"
                autoCapitalize="characters"
                value={query}
                onChangeText={setQuery}
                returnKeyType="done"
                onSubmitEditing={onAdd}
              />

              <TouchableOpacity
                style={[styles.addButton, disabled && styles.addButtonDisabled]}
                disabled={disabled}
                onPress={onAdd}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <>
                    <Icon name="add" size={20} color="#000" />
                    <Text style={styles.addButtonText}> Add</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
