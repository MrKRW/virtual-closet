import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClothingItem } from '../constants/outfitTypes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

interface ClothingCardProps {
  item: ClothingItem;
  isSelected: boolean;
  isUsedElsewhere: boolean;
  onPress: () => void;
}

export default function ClothingCard({
  item,
  isSelected,
  isUsedElsewhere,
  onPress,
}: ClothingCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        isUsedElsewhere && styles.cardUsed,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.imageUri }} style={styles.image} />

      {/* Selected checkmark */}
      {isSelected && (
        <View style={styles.selectedBadge}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      )}

      {/* Used elsewhere badge */}
      {isUsedElsewhere && !isSelected && (
        <View style={styles.usedBadge}>
          <Ionicons name="repeat" size={10} color="#fff" />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {item.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {item.brand}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#1a1a1a',
    borderWidth: 2,
  },
  cardUsed: {
    opacity: 0.65,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    resizeMode: 'cover',
    backgroundColor: '#f5f5f5',
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  brand: {
    fontSize: 10,
    color: '#999',
    marginTop: 1,
  },
});