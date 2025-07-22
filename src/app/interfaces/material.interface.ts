export interface Material {
  id: string; // Unique identifier for the material (e.g., 'COT001', 'SILK005')
  name: string; // Name of the material (e.g., 'Organic Cotton', 'Raw Silk', 'Crepe Polyester')
  type: string; // General category (e.g., 'Cotton', 'Silk', 'Synthetic', 'Linen', 'Wool')
  color: string; // e.g., 'Red', 'Navy Blue', 'Floral Print'
  pricePerUnit: number; // Price per standard unit (e.g., per meter, per yard)
  unit: string; // The unit of measurement (e.g., 'meter', 'yard', 'piece')
  availableQuantity?: number; // Optional: how much is available in stock
  imageUrl?: string; // Optional: URL to an image of the material
  description?: string; // Optional: detailed description of the material's properties, use cases
  supplierId?: string; // Optional: ID of the MaterialSupplier who provides this material
  supplierName?: string; // Optional: Name of the supplier (for display convenience without joining)
  fabricWeight?: string; // Optional: e.g., 'Lightweight', 'Medium', 'Heavy'
  materialComposition?: string; // Optional: e.g., '100% Cotton', 'Silk-Blend'
}