import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useOutfits } from '../../hooks/useOutfits';
import { SavedOutfit, OutfitSlots } from '../../constants/outfitTypes';

function OutfitPreviewStrip({ slots }: { slots: OutfitSlots }) {
  const filled = Object.values(slots).filter(Boolean);
  return (
    <View style={styles.strip}>
      {filled.slice(0, 4).map((item) =>
        item ? (
          <Image
            key={item.id}
            source={{ uri: item.imageUri }}
            style={styles.stripImage}
          />
        ) : null
      )}
      {filled.length > 4 && (
        <View style={styles.moreChip}>
          <Text style={styles.moreText}>+{filled.length - 4}</Text>
        </View>
      )}
    </View>
  );
}

function OutfitCard({
  outfit,
  onWorn,
  onDelete,
}: {
  outfit: SavedOutfit;
  onWorn: () => void;
  onDelete: () => void;
}) {
  const daysSince = outfit.lastWorn
    ? Math.floor(
        (Date.now() - new Date(outfit.lastWorn).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <View style={styles.card}>
      <OutfitPreviewStrip slots={outfit.slots} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.outfitName}>{outfit.name}</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Delete outfit', `Remove "${outfit.name}"?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: onDelete },
              ])
            }
          >
            <Ionicons name="trash-outline" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardMeta}>
          {outfit.occasion ? (
            <View style={styles.occasionBadge}>
              <Text style={styles.occasionBadgeText}>{outfit.occasion}</Text>
            </View>
          ) : null}
          <Text style={styles.metaText}>
            Worn {outfit.wornCount}×
            {daysSince !== null
              ? ` · ${daysSince === 0 ? 'today' : `${daysSince}d ago`}`
              : ''}
          </Text>
        </View>

        {outfit.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {outfit.notes}
          </Text>
        ) : null}

        <TouchableOpacity style={styles.wornBtn} onPress={onWorn}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#1a1a1a" />
          <Text style={styles.wornBtnText}>Mark as worn today</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function OutfitsScreen() {
  const router = useRouter();
  const { outfits, loading, deleteOutfit, markWorn } = useOutfits();

  if (!loading && outfits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Outfits</Text>
          <TouchableOpacity
            style={styles.buildBtn}
            onPress={() => router.push('/outfit-builder')}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.buildBtnText}>Build</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="body-outline" size={56} color="#e0e0e0" />
          <Text style={styles.emptyTitle}>No outfits yet</Text>
          <Text style={styles.emptySubtitle}>
            Build your first outfit from your closet items
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/outfit-builder')}
          >
            <Text style={styles.emptyBtnText}>Build an outfit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Outfits</Text>
        <TouchableOpacity
          style={styles.buildBtn}
          onPress={() => router.push('/outfit-builder')}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.buildBtnText}>Build</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={outfits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <OutfitCard
            outfit={item}
            onWorn={() => markWorn(item.id)}
            onDelete={() => deleteOutfit(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', letterSpacing: -0.4 },
  buildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  buildBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  list: { padding: 16, gap: 14 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  strip: {
    flexDirection: 'row',
    height: 110,
    backgroundColor: '#f8f8f8',
  },
  stripImage: {
    flex: 1,
    height: 110,
    resizeMode: 'cover',
  },
  moreChip: {
    width: 44,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efefef',
  },
  moreText: { fontSize: 12, color: '#999', fontWeight: '600' },

  cardBody: { padding: 14, gap: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  outfitName: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', letterSpacing: -0.2 },

  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  occasionBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  occasionBadgeText: { fontSize: 11, color: '#666', fontWeight: '500' },
  metaText: { fontSize: 12, color: '#bbb' },

  notes: { fontSize: 13, color: '#888', lineHeight: 18 },

  wornBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  wornBtnText: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },

  // Empty
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#ccc' },
  emptySubtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', paddingHorizontal: 40 },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});