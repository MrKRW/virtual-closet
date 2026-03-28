import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedOutfit, OutfitSlots } from '../constants/outfitTypes';

const STORAGE_KEY = '@virtual_closet_outfits';

interface CreateOutfitInput {
  name: string;
  occasion: string;
  notes: string;
  slots: OutfitSlots;
}

export function useOutfits() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setOutfits(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load outfits:', e);
    } finally {
      setLoading(false);
    }
  };

  const persistOutfits = async (updated: SavedOutfit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save outfits:', e);
    }
  };

  const saveOutfit = useCallback(
    async ({ name, occasion, notes, slots }: CreateOutfitInput) => {
      const newOutfit: SavedOutfit = {
        id: `outfit_${Date.now()}`,
        name,
        occasion,
        notes,
        slots,
        createdAt: new Date().toISOString(),
        wornCount: 0,
      };
      const updated = [newOutfit, ...outfits];
      setOutfits(updated);
      await persistOutfits(updated);
      return newOutfit;
    },
    [outfits]
  );

  const deleteOutfit = useCallback(
    async (id: string) => {
      const updated = outfits.filter((o) => o.id !== id);
      setOutfits(updated);
      await persistOutfits(updated);
    },
    [outfits]
  );

  const markWorn = useCallback(
    async (id: string) => {
      const updated = outfits.map((o) =>
        o.id === id
          ? {
              ...o,
              wornCount: o.wornCount + 1,
              lastWorn: new Date().toISOString(),
            }
          : o
      );
      setOutfits(updated);
      await persistOutfits(updated);
    },
    [outfits]
  );

  const updateOutfit = useCallback(
    async (id: string, changes: Partial<SavedOutfit>) => {
      const updated = outfits.map((o) =>
        o.id === id ? { ...o, ...changes } : o
      );
      setOutfits(updated);
      await persistOutfits(updated);
    },
    [outfits]
  );

  return {
    outfits,
    loading,
    saveOutfit,
    deleteOutfit,
    markWorn,
    updateOutfit,
    reload: loadOutfits,
  };
}