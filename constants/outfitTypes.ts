// ── Clothing item shape ──────────────────────────────────────────────────────
export interface ClothingItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  color?: string;
  imageUri: string;
  tags?: string[];
  wearCount?: number;
  createdAt?: string;
}

// ── Outfit slots ─────────────────────────────────────────────────────────────
export type OutfitSlots = {
  headwear: ClothingItem | null;
  top: ClothingItem | null;
  outerwear: ClothingItem | null;
  bottom: ClothingItem | null;
  footwear: ClothingItem | null;
  accessory: ClothingItem | null;
};

export const SLOT_LABELS: Record<keyof OutfitSlots, string> = {
  headwear: 'Hat / Cap',
  top: 'Top',
  outerwear: 'Jacket',
  bottom: 'Bottom',
  footwear: 'Shoes',
  accessory: 'Accessory',
};

// ── Saved outfit ─────────────────────────────────────────────────────────────
export interface SavedOutfit {
  id: string;
  name: string;
  occasion: string;
  notes: string;
  slots: OutfitSlots;
  createdAt: string;
  wornCount: number;
  lastWorn?: string;
}

// ── Categories ────────────────────────────────────────────────────────────────
export const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Outerwear',
  'Footwear',
  'Headwear',
  'Accessories',
  'Dresses',
  'Activewear',
];