import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddItemScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ⚠️ REPLACE THIS WITH YOUR PC'S IPv4 ADDRESS
  const BACKEND_URL = "https://f08ec506d39a6f.lhr.life";

  // 1. Open the Gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Lets the user crop the photo
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) uploadToAI(result.assets[0].uri);
  };

  // 2. Open the Camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "You need to allow camera access to take photos."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) uploadToAI(result.assets[0].uri);
  };

  // 3. Send the photo to your Python server
  const uploadToAI = async (uri: string) => {
    setImageUri(uri); // Show the raw image immediately
    setIsProcessing(true);

    try {
      // Package the image file for the internet
      let formData = new FormData();
      formData.append("file", {
        uri: uri,
        name: "clothing.jpg",
        type: "image/jpeg",
      } as any);

      // Send it to the FastAPI endpoint
      const response = await fetch(`${BACKEND_URL}/remove-background/`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.json();

      if (data.status === "success") {
        // Swap the raw image with the new AI-processed transparent image
        setImageUri(`${BACKEND_URL}${data.url}`);
      } else {
        Alert.alert("AI Error", "Could not remove background.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Network Error",
        "Make sure your Python server is running and the IP is correct!"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ... (keep all your camera and upload functions the same)

  return (
    // Changed <View> to <ScrollView>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Digitize Your Wardrobe</Text>

      <View style={styles.previewContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}

        {isProcessing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>AI is removing background...</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={takePhoto}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>📸 Take a Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={pickImage}
        disabled={isProcessing}
      >
        <Text style={styles.secondaryButtonText}>📁 Upload from Gallery</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Changed from flex: 1 so it can scroll
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 30,
    paddingTop: 40,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  previewContainer: {
    width: "100%",
    height: 280, // Shrunk slightly so it fits better on Android
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
  // ... (keep the rest of your styles the same)

  imagePreview: { width: "100%", height: "100%", resizeMode: "contain" },
  placeholderText: { color: "#888" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#fff", marginTop: 10, fontWeight: "600" },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e1e4e8",
    elevation: 0,
  },
  secondaryButtonText: { color: "#333", fontSize: 16, fontWeight: "600" },
});
