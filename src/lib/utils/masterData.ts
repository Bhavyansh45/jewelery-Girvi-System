// Master data utilities for jewelry management

export interface JewelryCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface MasterJewelryName {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
}

export interface PurityStandard {
  id: string;
  name: string;
  value: number;
  description: string;
  category: string;
  isActive: boolean;
}

// Default jewelry categories
export const defaultJewelryCategories: JewelryCategory[] = [
  { id: '1', name: 'Gold', isActive: true },
  { id: '2', name: 'Silver', isActive: true },
  { id: '3', name: 'Diamond', isActive: true },
  { id: '4', name: 'Platinum', isActive: true }
];

// Default master jewelry names
export const defaultMasterJewelryNames: MasterJewelryName[] = [
  { id: '1', name: 'Ring', category: 'Gold', isActive: true },
  { id: '2', name: 'Necklace', category: 'Gold', isActive: true },
  { id: '3', name: 'Bracelet', category: 'Gold', isActive: true },
  { id: '4', name: 'Earrings', category: 'Gold', isActive: true },
  { id: '5', name: 'Chain', category: 'Gold', isActive: true },
  { id: '6', name: 'Silver Ring', category: 'Silver', isActive: true },
  { id: '7', name: 'Silver Necklace', category: 'Silver', isActive: true },
  { id: '8', name: 'Diamond Ring', category: 'Diamond', isActive: true },
  { id: '9', name: 'Diamond Necklace', category: 'Diamond', isActive: true },
  { id: '10', name: 'Platinum Ring', category: 'Platinum', isActive: true },
  { id: '11', name: 'Platinum Necklace', category: 'Platinum', isActive: true }
];

// Default purity standards
export const defaultPurityStandards: PurityStandard[] = [
  { id: '1', name: '24K', value: 24, description: 'Pure gold (99.9% pure)', category: 'Gold', isActive: true },
  { id: '2', name: '22K', value: 22, description: '22 karat gold (91.7% pure)', category: 'Gold', isActive: true },
  { id: '3', name: '18K', value: 18, description: '18 karat gold (75% pure)', category: 'Gold', isActive: true },
  { id: '4', name: '14K', value: 14, description: '14 karat gold (58.3% pure)', category: 'Gold', isActive: true },
  { id: '5', name: 'Silver 925', value: 925, description: 'Sterling silver (92.5% pure)', category: 'Silver', isActive: true },
  { id: '6', name: 'Silver 999', value: 999, description: 'Fine silver (99.9% pure)', category: 'Silver', isActive: true },
  { id: '7', name: 'Diamond D', value: 100, description: 'Diamond grade D (colorless)', category: 'Diamond', isActive: true },
  { id: '8', name: 'Diamond E', value: 99, description: 'Diamond grade E (near colorless)', category: 'Diamond', isActive: true },
  { id: '9', name: 'Diamond F', value: 98, description: 'Diamond grade F (near colorless)', category: 'Diamond', isActive: true },
  { id: '10', name: 'Diamond G', value: 97, description: 'Diamond grade G (near colorless)', category: 'Diamond', isActive: true },
  { id: '11', name: 'Platinum 950', value: 950, description: 'Platinum (95% pure)', category: 'Platinum', isActive: true },
  { id: '12', name: 'Platinum 900', value: 900, description: 'Platinum (90% pure)', category: 'Platinum', isActive: true }
];

// Utility functions
export const getJewelryNamesByCategory = (category: string, jewelryNames: MasterJewelryName[] = defaultMasterJewelryNames): MasterJewelryName[] => {
  return jewelryNames.filter(item => item.category === category && item.isActive);
};

export const getActiveJewelryCategories = (categories: JewelryCategory[] = defaultJewelryCategories): JewelryCategory[] => {
  return categories.filter(cat => cat.isActive);
};

export const getActivePurityStandards = (standards: PurityStandard[] = defaultPurityStandards): PurityStandard[] => {
  return standards.filter(standard => standard.isActive);
};

export const getPurityStandardsByCategory = (category: string, standards: PurityStandard[] = defaultPurityStandards): PurityStandard[] => {
  return standards.filter(standard => standard.category === category && standard.isActive);
};
