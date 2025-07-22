// src/app/interfaces/order.interface.ts

export interface Order {
  id: string; // Unique order identifier
  itemName: string; // E.g., "Custom Shirt", "Dress"
  deliveryDate: Date;
  description: String; // Or string if you prefer to handle date formatting in HTML
  fixedCost: number;
  clothDeliveringStatus: 'Pending' | 'In Transit' | 'Delivered' | 'Not Applicable'; // Status of cloth delivery to customer
  clothBuyingByTailorStatus: 'Pending' | 'Purchased' | 'Not Applicable'; // Status of tailor buying cloth
  clothGettingFromMaterialSupplierStatus: 'Pending' | 'Ordered' | 'Received' | 'Not Applicable'; // Status of getting cloth from supplier
  // Add other relevant fields like customer details, tailor details etc. if needed
}