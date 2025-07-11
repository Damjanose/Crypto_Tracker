// screens/AddNewCryptoScreen.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import { MESSARI_API_KEY } from "@env";

const STORAGE_KEY = "userCryptos";

interface Asset {
  id: string; // we'll use the symbol as our key
  name: string;
  symbol: string;
  price: number;
  changePct: number;
}

export default function AddNewCryptoScreen() {
  const navigation = useNavigation();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://api.messari.io/metrics/v2/assets?hasDiligence=true&hasIntel=true&hasMarketData=true&hasNews=true&limit=10",
        {
          headers: {
            accept: "application/json",
            "x-messari-api-key": MESSARI_API_KEY,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // The endpoint may nest the array under data or data.data
      const rawList: any[] = Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.data?.data)
        ? json.data.data
        : [];

      const list: Asset[] = rawList.map((a) => {
        // asset metadata could live under `a.asset` or top-level
        const assetInfo = a.asset ?? a;
        const metrics = a.metrics ?? {};

        const symbol: string = assetInfo.symbol;
        const name: string = assetInfo.name;
        const price: number = metrics.market_data?.price_usd ?? 0;
        const changePct: number =
          metrics.market_data?.percent_change_usd_last_24_hours ?? 0;

        return {
          id: symbol,
          symbol,
          name,
          price,
          changePct,
        };
      });

      console.log(list);

      setAssets(list);
    } catch (err: any) {
      console.error("Fetch assets failed", err);
      setError("Could not load assets. Pull to retry.");
    } finally {
      setLoading(false);
    }
  }

  async function onAdd(symbol: string) {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (list.includes(symbol)) {
        Alert.alert("Already added", `${symbol} is already in your list.`);
      } else {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...list, symbol])
        );
        navigation.goBack();
      }
    } catch (err) {
      console.error("Add failed", err);
      Alert.alert("Error", "Could not save. Try again.");
    }
  }

  const renderItem = ({ item }: { item: Asset }) => {
    const up = item.changePct >= 0;
    const iconUri = `https://cryptoicons.org/api/icon/${item.symbol.toLowerCase()}/200`;

    return (
      <TouchableOpacity style={styles.item} onPress={() => onAdd(item.symbol)}>
        <View style={styles.left}>
          <Image source={{ uri: iconUri }} style={styles.icon} />
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.symbol}>{item.symbol}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={[styles.change, up ? styles.up : styles.down]}>
            {up ? "↑" : "↓"} {Math.abs(item.changePct).toFixed(2)}%
          </Text>
          <Text style={styles.tapToAdd}>Tap to add</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retry} onPress={fetchAssets}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Add a Cryptocurrency</Text>
      </View>

      <FlatList
        data={assets}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },

  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  title: { fontSize: 22, fontWeight: "600", color: "#111" },

  listContent: { paddingVertical: 8 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: { flexDirection: "row", alignItems: "center" },
  icon: { width: 32, height: 32, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#111" },
  symbol: { fontSize: 12, color: "#666", marginTop: 2 },

  right: { alignItems: "flex-end" },
  price: { fontSize: 16, fontWeight: "600", color: "#111" },
  change: { fontSize: 12, marginTop: 4 },
  up: { color: "#34C759" },
  down: { color: "#FF3B30" },
  tapToAdd: { fontSize: 10, color: "#355E8E", marginTop: 4 },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E0E0E0",
    marginLeft: 60,
  },

  errorText: {
    marginTop: 50,
    textAlign: "center",
    color: "#FF3B30",
    fontSize: 16,
  },
  retry: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#355E8E",
    borderRadius: 4,
  },
  retryText: { color: "#FFF", fontSize: 14 },
});
