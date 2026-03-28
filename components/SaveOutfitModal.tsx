import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OutfitSlots } from "../constants/outfitTypes";

const { width } = Dimensions.get("window");

const OCCASIONS = [
  "Casual",
  "Work",
  "Formal",
  "Date night",
  "Sport",
  "Travel",
  "Party",
  "Beach",
];

interface SaveOutfitModalProps {
  visible: boolean;
  slots: OutfitSlots;
  onSave: (name: string, occasion: string, notes: string) => void;
  onClose: () => void;
}

export default function SaveOutfitModal({
  visible,
  slots,
  onSave,
  onClose,
}: SaveOutfitModalProps) {
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (visible) {
      setName("");
      setOccasion("");
      setNotes("");
    }
  }, [visible]);

  const filledItems = Object.values(slots).filter(Boolean);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Handle bar */}
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#666" />
            </TouchableOpacity>
            <Text style={styles.title}>Save outfit</Text>
            <View style={{ width: 30 }} />
          </View>

          {/* Outfit preview strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.previewScroll}
            contentContainerStyle={styles.previewContent}
          >
            {filledItems.map((item) =>
              item ? (
                <View key={item.id} style={styles.previewItem}>
                  <Image
                    source={{ uri: item.imageUri }}
                    style={styles.previewImage}
                  />
                  <Text style={styles.previewName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              ) : null
            )}
          </ScrollView>

          <View style={styles.form}>
            {/* Name field */}
            <View style={styles.field}>
              <Text style={styles.label}>Outfit name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sunday brunch look"
                placeholderTextColor="#bbb"
                value={name}
                onChangeText={setName}
                maxLength={60}
                returnKeyType="next"
              />
            </View>

            {/* Occasion pills */}
            <View style={styles.field}>
              <Text style={styles.label}>Occasion</Text>
              <View style={styles.occasionGrid}>
                {OCCASIONS.map((occ) => (
                  <TouchableOpacity
                    key={occ}
                    style={[
                      styles.occasionPill,
                      occasion === occ && styles.occasionPillActive,
                    ]}
                    onPress={() => setOccasion(occasion === occ ? "" : occ)}
                  >
                    <Text
                      style={[
                        styles.occasionText,
                        occasion === occ && styles.occasionTextActive,
                      ]}
                    >
                      {occ}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={styles.field}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="When did you wear this? Any tips..."
                placeholderTextColor="#bbb"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>
          </View>
        </ScrollView>

        {/* Save button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
            onPress={() =>
              name.trim() && onSave(name.trim(), occasion, notes.trim())
            }
          >
            <Ionicons
              name="bookmark"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.saveBtnText}>Save outfit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  closeBtn: { padding: 4 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  // Preview strip
  previewScroll: {
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  previewContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  previewItem: {
    alignItems: "center",
    width: 64,
  },
  previewImage: {
    width: 64,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    resizeMode: "cover",
  },
  previewName: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },

  // Form
  form: {
    padding: 16,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
  },
  notesInput: {
    height: 88,
    textAlignVertical: "top",
  },
  occasionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  occasionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    backgroundColor: "#fafafa",
  },
  occasionPillActive: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  occasionText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  occasionTextActive: {
    color: "#fff",
  },

  // Footer
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  saveBtn: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnDisabled: {
    backgroundColor: "#ddd",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
