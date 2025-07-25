import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
