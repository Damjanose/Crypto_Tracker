// screens/CryptoListScreen.tsx
import React from "react";
import {
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

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: number;
  iconUri: string;
}

const DATA: Crypto[] = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    price: "$7,215.68",
    change: 1.82,
    iconUri: "https://cryptoicons.org/api/icon/btc/200",
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    price: "$146.83",
    change: 1.46,
    iconUri: "https://cryptoicons.org/api/icon/eth/200",
  },
  {
    id: "3",
    name: "XRP",
    symbol: "XRP",
    price: "$0.220568",
    change: -2.47,
    iconUri: "https://cryptoicons.org/api/icon/xrp/200",
  },
  {
    id: "4",
    name: "Litecoin",
    symbol: "LTC",
    price: "$45.94",
    change: 1.47,
    iconUri: "https://cryptoicons.org/api/icon/ltc/200",
  },
];

export default function CryptoListScreen() {
  const navigation = useNavigation();

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CryptoTracker Pro</Text>
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={styles.profile}
        />
      </View>

      <FlatList
        data={DATA}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  title: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FFF",
  },

  listContent: {
    paddingVertical: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  symbol: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  right: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  change: {
    fontSize: 12,
    marginTop: 4,
  },
  up: {
    color: "#34C759",
  },
  down: {
    color: "#FF3B30",
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E0E0E0",
    marginLeft: 60,
  },

  footer: {
    marginTop: 32,
    marginBottom: 40,
    alignItems: "center",
  },
  footerText: {
    color: "#355E8E",
    fontSize: 16,
    fontWeight: "500",
  },
});
