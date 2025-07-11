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
   Shows each coin’s name, symbol, logo, current USD price and 24 h % change.
2. **Add a new cryptocurrency**  
   Validates the symbol against Messari before saving.
3. **Remove a cryptocurrency**  
   Tap “Remove” on any item to delete it.
4. **Live updates**  
   Prices and % changes auto-refresh every minute.
5. **Persistence**  
   Your list is stored in AsyncStorage and reloaded on each app launch or screen focus.

---

## 📦 Prerequisites

- **Node.js** ≥ 18
- **Yarn** or **npm**
- **Java JDK** & **Android Studio** (for Android)
- **Xcode** & **CocoaPods** (for iOS)
- **React Native CLI** installed globally
  ```sh
  npm install -g react-native-cli
  ```

---

## 🚩 How to Run

1. **Clone the repo**
   ```sh
   git clone https://github.com/yourusername/cryptotracker-pro.git
   cd cryptotracker-pro
   ```  
2. **Install dependencies**
   ```sh
   yarn install
   # or
   npm install
   ```  
3. **Set up your environment file**
   ```sh
   cp .env.example .env
   # then open `.env` and add your MESSARI_API_KEY (or COINGECKO settings)
   ```  
4. **iOS setup** (macOS only)
   ```sh
   cd ios
   pod install
   cd ..
   ```  
5. **Run on Android**
   ```sh
   npx react-native run-android
   ```  
6. **Run on iOS**
   ```sh
   npx react-native run-ios
   ```

---

## 📖 Usage

- **Auto-refresh**: The app polls the API every minute.
- **Add/Remove**: Use the “+” button on the header to add a new coin, and swipe left on any list item to reveal “Remove.”
- **Persistence**: Your coin list is saved automatically—no extra steps needed.

---

## 🔧 Troubleshooting

- If you see **“Unable to load script”**, run `npx react-native start --reset-cache`.
- If pods fail on iOS, delete `ios/Pods` and `ios/Podfile.lock`, then `pod install` again.
- For Android build errors, run `cd android && ./gradlew clean`.
