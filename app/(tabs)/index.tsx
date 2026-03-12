import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";


type ClothingItem = {
  id: string;
  name: string;
  category: string;
  color: string;
};

// 2. The mock data
const CLOSET_DATA: ClothingItem[] = [
  {
    id: "1",
    name: "Vintage Denim Jacket",
    category: "Outerwear",
    color: "#4a6984",
  },
  { id: "2", name: "White Linen Shirt", category: "Tops", color: "#f4f4f0" },
  { id: "3", name: "Black Chinos", category: "Bottoms", color: "#1a1a1a" },
  { id: "4", name: "Chelsea Boots", category: "Shoes", color: "#654321" },
  { id: "5", name: "Grey Hoodie", category: "Tops", color: "#808080" },
  { id: "6", name: "Beige Shorts", category: "Bottoms", color: "#d5c4a1" },
];

export default function App() {
  // 3. We tell the function exactly what 'item' is by referencing the blueprint
  const renderItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity style={styles.card}>
      <View
        style={[styles.imagePlaceholder, { backgroundColor: item.color }]}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Closet</Text>
      </View>

      <FlatList
        data={CLOSET_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridList}
        showsVerticalScrollIndicator={false}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#333333" },
  gridList: { padding: 10 },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePlaceholder: { height: 150, width: "100%" },
  infoContainer: { padding: 12 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  itemCategory: { fontSize: 12, color: "#888" },
});
