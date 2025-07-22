export interface User {
  id: string;
  username: string;
  role: 'user' | 'tailor' | 'materials'; 
  profileImageUrl?: string; // Add profile image support
}