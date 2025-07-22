// src/app/models/register-request.model.ts

export interface RegisterRequest {
  role: string; // Will be 'USER', 'TAILOR', or 'MATERIAL'
  username: string;
  password: string;
  email: string;
  phoneNumber: string;



  // Optional fields for TAILOR role
  shopName?: string;
  experienceYears?: number;
  bio?: string; // Shared with MATERIAL
  location?: string; // Shared with MATERIAL

  // Optional fields for MATERIAL role
  supplierShopName?: string;
  startedDate?: string; // Send as ISO string 'YYYY-MM-DD'
  // bio and location are shared
}