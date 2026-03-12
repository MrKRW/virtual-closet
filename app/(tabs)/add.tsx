import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AddItemScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digitize Your Wardrobe</Text>
      <Text style={styles.subtitle}>
        Upload a photo to automatically remove the background and tag the item.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>📸 Take a Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.secondaryButtonText}>📁 Upload from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e1e4e8",
    elevation: 0,
    shadowOpacity: 0,
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
