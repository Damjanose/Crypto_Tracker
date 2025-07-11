import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import { MESSARI_API_KEY } from "@env";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: number;
  iconUri: string;
}

const noImage = "../../assets/images/no_image.png";

export default function CryptoListScreen() {
  const navigation = useNavigation();
  const [coins, setCoins] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api.messari.io/metrics/v2/assets/details?slugs=bitcoin%2Cethereum",

        {
          headers: {
            accept: "application/json",
            "x-messari-api-key": MESSARI_API_KEY,
          },
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { data } = await res.json();

      const list: Crypto[] = (data as any[]).map((a) => ({
        id: a.symbol,
        name: a.name,
        symbol: a.symbol,
        price: `$${a.marketData.price_usd}`,
        change: a.returnOnInvestment.priceChange24h,
        iconUri: a.profile ? a.profile.general.logoImage : noImage,
      }));
      setCoins(list);
    } catch (e) {
      console.error("Fetch assets failed", e);
      setError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

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
            fetchCoins();
            Alert.alert("Retrying…");
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Crypto }) => {
    const up = item.change >= 0;
    return (
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
            {Math.abs(item.change).toFixed(2)}%
          </Text>
        </View>
      </View>
    );
  };

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
          keyExtractor={(i) => i.id}
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: "#355E8E",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#355E8E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { color: "#FFF", fontSize: 20, fontWeight: "700" },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FFF",
  },

  listContent: { paddingVertical: 16 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: { flexDirection: "row", alignItems: "center" },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  name: { fontSize: 16, fontWeight: "600", color: "#111" },
  symbol: { fontSize: 12, color: "#666", marginTop: 2 },

  right: { alignItems: "flex-end" },
  price: { fontSize: 16, fontWeight: "600", color: "#111" },
  change: { fontSize: 12, marginTop: 4 },
  up: { color: "#34C759" },
  down: { color: "#FF3B30" },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E0E0E0",
    marginLeft: 60,
  },

  footer: { marginTop: 32, marginBottom: 40, alignItems: "center" },
  footerText: {
    color: "#355E8E",
    fontSize: 16,
    fontWeight: "500",
  },

  errorText: {
    marginTop: 50,
    textAlign: "center",
    color: "#FF3B30",
    fontSize: 16,
  },
  retry: {
    marginTop: 16,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#355E8E",
    borderRadius: 4,
  },
  retryText: { color: "#FFF", fontSize: 14 },
});
