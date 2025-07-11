import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { styles } from "./CryptoListScreen.styles.ts";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: number;
  iconUri: string;
}

const NO_IMAGE = require("../../assets/images/no_image.png");
const STORAGE_KEY = "userCryptos";

export default function CryptoListScreen() {
  const navigation = useNavigation();
  const [coinIds, setCoinIds] = useState<string[]>([]);
  const [coins, setCoins] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const readIds = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: string[] = raw ? JSON.parse(raw) : [];
        setCoinIds(parsed);
      } catch (e) {
        console.warn("Failed to load IDs", e);
      }
    };
    readIds();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const readIds = async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          const parsed: string[] = raw ? JSON.parse(raw) : [];
          if (isActive) setCoinIds(parsed);
        } catch (e) {
          console.warn("Failed to reload IDs", e);
        }
      };
      readIds();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const fetchMarkets = useCallback(async () => {
    if (coinIds.length === 0) {
      setCoins([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url =
        `https://api.coingecko.com/api/v3/coins/markets` +
        `?vs_currency=usd` +
        `&ids=${coinIds.join(",")}` +
        `&order=market_cap_desc` +
        `&per_page=100&page=1` +
        `&sparkline=false` +
        `&price_change_percentage=24h`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      const list: Crypto[] = data.map((d: any) => ({
        id: d.id,
        name: d.name,
        symbol: d.symbol.toUpperCase(),
        price: `$${d.current_price.toFixed(2)}`,
        change24h: d.price_change_percentage_24h ?? 0,
        iconUri: d.image,
      }));

      setCoins(list);
    } catch (e) {
      console.error("Fetch markets error", e);
      setError("Unable to load prices.");
    } finally {
      setLoading(false);
    }
  }, [coinIds]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

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
            fetchMarkets();
            Alert.alert("Retrying…");
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Crypto }) => {
    const up = item.change24h >= 0;
    return (
      <View style={styles.item}>
        <View style={styles.left}>
          <Image
            source={item.iconUri ? { uri: item.iconUri } : NO_IMAGE}
            style={styles.icon}
          />
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
      </SafeAreaView>
    </>
  );
}
