# CryptoTracker Pro

A simple React Native app to track your favorite cryptocurrencies—view live prices, 24 h % changes, add new coins, and remove existing ones. Built with:

- **React Native CLI** (no Expo)
- **React Navigation** (Stack)
- **TanStack React Query** for data fetching & caching
- **AsyncStorage** for persisting your coin list
- **Messari API** (or swap in CoinGecko) for live metrics
- **react-native-vector-icons** (Material “baseline”)
- **.env** (via `react-native-dotenv`) for your API key

> ⚙️ **See [How to Run](#-how-to-run) below for instructions on launching the app.**

---

## 🚀 Features

1. **List your coins**  
   – Shows each coin’s name, symbol, logo, current USD price and 24 h % change.
2. **Add a new cryptocurrency**  
   – Validates the symbol against Messari before saving.
3. **Remove a cryptocurrency**  
   – Tap “Remove” on any item to delete it.
4. **Live updates**  
   – Prices and % changes auto-refresh every minute.
5. **Persistence**  
   – Your list is stored in AsyncStorage and reloaded on each app launch or screen focus.

---

## 📦 Prerequisites

- **Node.js** ≥ 14
- **Yarn** or **npm**
- **Java JDK** & **Android Studio** (for Android)
- **Xcode** & **CocoaPods** (for iOS)
- **React Native CLI** installed globally
  ```sh
  npm install -g react-native-cli
