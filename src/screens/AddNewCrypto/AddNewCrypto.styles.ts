import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    justifyContent: "center",
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
