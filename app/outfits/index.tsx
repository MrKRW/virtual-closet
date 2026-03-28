import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import OutfitSlot from '../../components/OutfitSlot';
import ClothingCard from '../../components/ClothingCard';
import SaveOutfitModal from '../../components/SaveOutfitModal';
import { ClothingItem, OutfitSlots, SLOT_LABELS, CATEGORIES } from '../../constants/outfitTypes';
import { useOutfits } from '../../hooks/useOutfits';
import { useCloset } from '../../hooks/useCloset';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

export default function OutfitBuilderScreen() {
  const router = useRouter();
  const { saveOutfit } = useOutfits();
  const { items: closetItems } = useCloset();

  const [slots, setSlots] = useState<OutfitSlots>({
    headwear: null,
    top: null,
    outerwear: null,
    bottom: null,
    footwear: null,
    accessory: null,
  });

  const [activeSlot, setActiveSlot] = useState<keyof OutfitSlots | null>('top');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  // Filter closet items for the picker grid
  const filteredItems = closetItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSlotPress = useCallback((slot: keyof OutfitSlots) => {
    setActiveSlot(slot);
    // Auto-set category filter based on slot
    const slotCategoryMap: Record<keyof OutfitSlots, string> = {
      headwear: 'Headwear',
      top: 'Tops',
      outerwear: 'Outerwear',
      bottom: 'Bottoms',
      footwear: 'Footwear',
      accessory: 'Accessories',
    };
    setActiveCategory(slotCategoryMap[slot] || 'All');
  }, []);

  const handleItemSelect = useCallback(
    (item: ClothingItem) => {
      if (!activeSlot) return;
      setSlots((prev) => ({
        ...prev,
        [activeSlot]: prev[activeSlot]?.id === item.id ? null : item,
      }));
    },
    [activeSlot]
  );

  const handleRemoveFromSlot = useCallback((slot: keyof OutfitSlots) => {
    setSlots((prev) => ({ ...prev, [slot]: null }));
  }, []);

  const handleClearAll = useCallback(() => {
    Alert.alert('Clear outfit', 'Remove all items from this outfit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () =>
          setSlots({
            headwear: null,
            top: null,
            outerwear: null,
            bottom: null,
            footwear: null,
            accessory: null,
          }),
      },
    ]);
  }, []);

  const filledCount = Object.values(slots).filter(Boolean).length;

  const handleSave = useCallback(
    async (name: string, occasion: string, notes: string) => {
      if (filledCount === 0) {
        Alert.alert('Empty outfit', 'Add at least one item before saving.');
        return;
      }
      await saveOutfit({ name, occasion, notes, slots });
      setSaveModalVisible(false);
      Alert.alert('Saved!', `"${name}" has been added to your outfits.`, [
        { text: 'View outfits', onPress: () => router.push('/outfits') },
        { text: 'Keep building', style: 'cancel' },
      ]);
    },
    [slots, filledCount, saveOutfit, router]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.title}>Outfit Builder</Text>
        <View style={styles.headerRight}>
          {filledCount > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
              <Ionicons name="trash-outline" size={20} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.saveBtn, filledCount === 0 && styles.saveBtnDisabled]}
            onPress={() => filledCount > 0 && setSaveModalVisible(true)}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Outfit canvas — the 6 slots */}
        <View style={styles.canvas}>
          <View style={styles.slotsGrid}>
            {(Object.keys(slots) as Array<keyof OutfitSlots>).map((slot) => (
              <OutfitSlot
                key={slot}
                slot={slot}
                label={SLOT_LABELS[slot]}
                item={slots[slot]}
                isActive={activeSlot === slot}
                onPress={() => handleSlotPress(slot)}
                onRemove={() => handleRemoveFromSlot(slot)}
              />
            ))}
          </View>

          {filledCount > 0 && (
            <Text style={styles.filledCount}>
              {filledCount} item{filledCount !== 1 ? 's' : ''} added
            </Text>
          )}
        </View>

        {/* Sticky picker header */}
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerTitle}>
            {activeSlot
              ? `Pick ${SLOT_LABELS[activeSlot]}`
              : 'Select a slot above'}
          </Text>

          {/* Search */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color="#999" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your closet..."
              placeholderTextColor="#bbb"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>

          {/* Category pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {['All', ...CATEGORIES].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  activeCategory === cat && styles.categoryPillActive,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    activeCategory === cat && styles.categoryPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Clothing grid */}
        <View style={styles.gridContainer}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="shirt-outline" size={40} color="#ddd" />
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubtext}>
                Try a different category or add items to your closet
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredItems.map((item) => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  isSelected={
                    activeSlot ? slots[activeSlot]?.id === item.id : false
                  }
                  isUsedElsewhere={Object.entries(slots).some(
                    ([slot, slotItem]) =>
                      slotItem?.id === item.id && slot !== activeSlot
                  )}
                  onPress={() => handleItemSelect(item)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <SaveOutfitModal
        visible={saveModalVisible}
        slots={slots}
        onSave={handleSave}
        onClose={() => setSaveModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scroll: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearBtn: {
    padding: 6,
  },
  saveBtn: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnDisabled: {
    backgroundColor: '#e0e0e0',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Canvas
  canvas: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  filledCount: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    color: '#999',
  },

  // Picker header (sticky)
  pickerHeader: {
    backgroundColor: '#fafafa',
    paddingTop: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ececec',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  categoryScroll: {
    marginBottom: 10,
  },
  categoryContent: {
    gap: 6,
    paddingRight: 4,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  categoryPillActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  categoryPillText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: '#fff',
  },

  // Grid
  gridContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});