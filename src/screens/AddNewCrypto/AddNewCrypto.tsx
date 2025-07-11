import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const STORAGE_KEY = "userCryptos";

export default function AddNewCryptoScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const sym = query.trim().toUpperCase();
  const disabled = loading || !sym;

  const onAdd = async () => {
    if (!sym) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://data.messari.io/api/v1/assets/${sym.toLowerCase()}/metrics`
      );
      if (!res.ok) throw new Error("Not found");

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (list.includes(sym)) {
        Alert.alert("Already added");
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...list, sym]));
        navigation.goBack();
      }
    } catch {
      Alert.alert("Crypto not found", "Please check the symbol and try again.");
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
              />

              <TouchableOpacity
                style={[styles.addButton, disabled && styles.addButtonDisabled]}
                disabled={disabled}
                onPress={onAdd}
              >
                <Icon name="add" size={20} color="#000" />
                <Text style={styles.addButtonText}>
                  {" "}
                  {loading ? "Adding…" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inner: {
    flex: 1,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  backText: {
    color: "#355E8E",
    fontSize: 14,
  },

  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111",
  },
  addButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: 16,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#FFD400",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
