import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { styles } from "./CryptoListScreen.styles";
import { useCryptoMarkets } from "../../hooks/useCryptoMarkets";
import { Crypto } from "../../services/cryptoService";

const STORAGE_KEY = "userCryptos";

export default function CryptoListScreen() {
  const navigation = useNavigation();
  const [coinIds, setCoinIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Crypto | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && JSON.parse(raw))
      .then((ids: string[]) => setCoinIds(ids || []))
      .catch((e) => console.warn("Failed to load IDs", e));
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      AsyncStorage.getItem(STORAGE_KEY)
        .then((raw) => raw && JSON.parse(raw))
        .then((ids: string[]) => {
          if (active) setCoinIds(ids || []);
        })
        .catch((e) => console.warn("Failed to reload IDs", e));
      return () => {
        active = false;
      };
    }, [])
  );

  const { coins, loading, error, reload } = useCryptoMarkets(coinIds);

  const handleRemove = async () => {
    if (!selectedCoin) return;
    try {
      const updated = coinIds.filter((id) => id !== selectedCoin.id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setCoinIds(updated);
      setModalVisible(false);
    } catch (e) {
      console.warn("Failed to remove coin", e);
      Alert.alert("Error", "Could not remove coin.");
    }
  };

  const renderItem = ({ item }: { item: Crypto }) => {
    const up = item.change24h >= 0;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedCoin(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.item}>
          <View style={styles.left}>
            <Image source={{ uri: item.iconUri }} style={styles.icon} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.symbol}>{item.symbol}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={[styles.change, up ? styles.up : styles.down]}>
              {up ? "↑ " : "↓ "}
              {Math.abs(item.change24h).toFixed(2)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retry}
          onPress={() => {
            reload();
            Alert.alert("Retrying…");
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.headerSafe} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>CryptoTracker Pro</Text>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.profile}
          />
        </View>

        <FlatList
          data={coins}
          keyExtractor={(c) => c.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.footer}
              onPress={() => navigation.navigate("AddNewCrypto" as never)}
            >
              <Text style={styles.footerText}>+ Add a Cryptocurrency</Text>
            </TouchableOpacity>
          }
        />

        <Modal
          visible={modalVisible}
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Remove {selectedCoin ? selectedCoin.name : "this coin"}?
              </Text>
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="Remove" onPress={handleRemove} />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}
