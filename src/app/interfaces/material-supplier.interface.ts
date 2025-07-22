export interface MaterialSupplier {
  id: string; // Unique identifier
  shopName: string; // Name of the shop/supplier
  rating: number; // Average rating (e.g., 1.0 to 5.0)
  description: string; // Short description or bio
  location: string; // Physical address or general area
  phoneNumber: string;
  profileImageUrl?: string; // Optional: for displaying a shop logo or image
  // Add coordinates if you plan for map integration or "nearby" features later
  // latitude?: number;
  // longitude?: number;
}