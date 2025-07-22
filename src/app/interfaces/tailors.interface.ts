export interface Tailor {
  id: string; // Unique identifier for the tailor
  name: string;
  phoneNumber: string;
  email?: string;
  isVerified: boolean;
  profileImageUrl?: string; // Optional: for displaying a profile picture
  works?: string[]; // Optional: array of works or specialties
  phoneVerified?: boolean; // Optional: indicates if the phone number is verified
  emailVerified?: boolean; // Optional: indicates if the email is verified
  clothesStitched: number;
  rating: number; // e.g., 1.0 to 5.0
  location: string; // Could be a more complex object with city, address, coordinates later
  bio?: string; // Optional: a short description
  tailorId: string | null;  
  shopName?: string; // Optional: name of the tailor's shop
  createdAt?: Date; // Optional: date when the tailor profile was created
  username?: string; // Optional: username for login purposes
}