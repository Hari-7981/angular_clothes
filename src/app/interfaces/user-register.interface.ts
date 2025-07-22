export interface User {
  id: string;
  username: string;
  password?: string; // Used in registration payload, not usually stored/sent in client-side user object
  email: string;
  phoneNumber: string; // Renamed from mobile for consistency

  // Common but might not be required for all types
  firstName?: string; // Preferred name for regular user
  lastName?: string;

  // Role-specific fields. Marked optional for flexibility.
  role: 'user' | 'tailor' | 'material';

  // --- Tailor-specific fields ---
  shopName?: string; // Tailor's shop name
  experienceYears?: number; // Tailor's experience (exp)
  bio?: string; // Tailor's or Supplier's bio
  location?: string; // Tailor's or Supplier's location

  // --- Material Supplier-specific fields ---
  supplierShopName?: string; // Material supplier's shop name (using a distinct name to avoid conflict with tailor's shopName)
  startedDate?: string; // When the supplier business started (started_date) - using string for simplicity of date input
  supplierDescription?: string; // Supplier's specific description (maps to bio for them)

  // Other optional fields you might add later for any user type:
  // profileImageUrl?: string;
  // websiteUrl?: string;
  // createdAt?: Date;
}