import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClothingItem } from '../constants/outfitTypes';

const STORAGE_KEY = '@virtual_closet_items';

// ── Seed data so the outfit builder has items to pick ─────────────────────────
// Replace these URIs with your actual photo upload URIs in production
const SEED_ITEMS: ClothingItem[] = [
  {
    id: 'item_1',
    name: 'White Oxford Shirt',
    brand: 'Uniqlo',
    category: 'Tops',
    color: 'White',
    imageUri: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item_2',
    name: 'Navy Chinos',
    brand: 'H&M',
    category: 'Bottoms',
    color: 'Navy',
    imageUri: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item_3',
    name: 'Black Leather Jacket',
    brand: 'Zara',
    category: 'Outerwear',
    color: 'Black',
    imageUri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item_4',
    name: 'White Sneakers',
    brand: 'Nike',
    category: 'Footwear',
    color: 'White',
    imageUri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item_5',
    name: 'Denim Jacket',
    brand: 'Levi\'s',
    category: 'Outerwear',
    color: 'Blue',
    imageUri: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item_6',
    name: 'Black Jeans',
    brand: 'Levi\'s',
    category: 'Bottoms',
    color: 'Black',
    imageUri: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item_7',
    name: 'Grey Hoodie',
    brand: 'Champion',
    category: 'Tops',
    color: 'Grey',
    imageUri: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item_8',
    name: 'Baseball Cap',
    brand: 'New Era',
    category: 'Headwear',
    color: 'Black',
    imageUri: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'item_9',
    name: 'Silver Watch',
    brand: 'Casio',
    category: 'Accessories',
    color: 'Silver',
    imageUri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    wearCount: 0,
    createdAt: new Date().toISOString(),
  },
];

export function useCloset() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        // First launch — seed with sample data
        setItems(SEED_ITEMS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ITEMS));
      }
    } catch (e) {
      console.error('Failed to load closet items:', e);
      setItems(SEED_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const addItem = useCallback(
    async (item: Omit<ClothingItem, 'id' | 'createdAt' | 'wearCount'>) => {
      const newItem: ClothingItem = {
        ...item,
        id: `item_${Date.now()}`,
        createdAt: new Date().toISOString(),
        wearCount: 0,
      };
      const updated = [newItem, ...items];
      setItems(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return newItem;
    },
    [items]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      const updated = items.filter((i) => i.id !== id);
      setItems(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [items]
  );

  const incrementWear = useCallback(
    async (id: string) => {
      const updated = items.map((i) =>
        i.id === id ? { ...i, wearCount: (i.wearCount ?? 0) + 1 } : i
      );
      setItems(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [items]
  );

  return { items, loading, addItem, deleteItem, incrementWear, reload: loadItems };
}