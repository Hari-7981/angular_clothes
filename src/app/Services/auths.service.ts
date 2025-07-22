import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegisterRequest } from '../interfaces/register.interface';

interface User {
  id: string;
  username: string;
  role: 'user' | 'tailor' | 'materials';
  profileImageUrl?: string;
}
// src/app/models/login-request.model.ts

export interface LoginRequest {
  username: string;
  password: string;
  role: string; // e.g., 'USER', 'TAILOR', 'MATERIAL' - should match backend enum string representation
}


// src/app/models/auth-response.model.ts

export interface AuthResponse {
  token: string;
  type?: string; // Often 'Bearer', optional as it has a default value in backend
  id: number; // Assuming Long from Java maps to number in TS
  username: string;
  email: string;
  role: string; // The actual role string, e.g., 'USER', 'TAILOR', 'MATERIAL'
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Replace with your backend URL

   private userSubject: BehaviorSubject<User | null>;

  // Public observable that components can subscribe to for real-time updates.
  // AsObservable() is used to prevent external components from accidentally calling next() on the subject.
  public currentUser: Observable<User | null>;

   constructor(private http: HttpClient) { // Inject HttpClient
    // Initialize the BehaviorSubject.
    // Attempt to load an initial user from local storage to persist login state.
    const initialUser = this.getLoggedInUser(); 
    this.userSubject = new BehaviorSubject<User | null>(initialUser);

    // Expose the BehaviorSubject as an Observable
    this.currentUser = this.userSubject.asObservable();
  }

    public get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  getLoggedInUser(): User | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      // localStorage is not available (SSR or non-browser)
      console.warn('localStorage is not available');
      return null;
    }
    const userData = localStorage.getItem('user_data');
    try {
      if (userData) {
        const parsedData = JSON.parse(userData);
        // Ensure the parsed data conforms to the User interface
        return {
          id: String(parsedData.id), // Convert number ID to string if needed by User interface
          username: parsedData.username,
          role: parsedData.role
        };
      }
    } catch (e) {
      console.error('Error parsing stored user data from "user_data":', e);
      localStorage.removeItem('user_data'); // Clear corrupt data
    }
    return null;
  }

  register(request: RegisterRequest): Observable<User> {
    const role = request.role.toLowerCase();
    return this.http.post<User>(`${this.apiUrl}/register/${role}`, request);
  }

  getUserIdByCredentials(loginRequest: LoginRequest): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/user/login`, loginRequest);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request,{ withCredentials: true }).pipe(
      tap(authResponse => {
        this.saveAuthData(authResponse); // Save token and user data to local storage
        // Create a User object from AuthResponse to update the BehaviorSubject
        console.log('authresponse', authResponse);
        const loggedInUser: User = {
          id: String(authResponse.id), // Ensure ID is a string if your User interface expects it
          username: authResponse.username,
          role: this.mapRole(authResponse.role) // Map the role string to the User interface type
        };
        this.userSubject.next(loggedInUser); // Emit the new user to all subscribers
        // Set user_id cookie for 7 days
        document.cookie = `user_id=${loggedInUser.id}; path=/; max-age=${7 * 24 * 60 * 60}`;
        console.log('User logged in and state updated:', loggedInUser.username);
      })
    );
  }

  // Helper to map backend role string to User interface type
  private mapRole(role: string | undefined): 'user' | 'tailor' | 'materials' {
    if (!role) {
      throw new Error('Role is undefined in mapRole');
    }
    switch (role.toLowerCase()) {
      case 'user':
      case 'USER':
        return 'user';
      case 'tailor':
      case 'TAILOR':
        return 'tailor';
      case 'material':
      case 'materials':
      case 'MATERIAL':
      case 'MATERIALS':
        return 'materials';
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  // You might have other methods here for token storage, logout, etc.
  // Example for token storage (adjust as per your actual implementation)
  saveAuthData(authResponse: AuthResponse): void {
     if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('jwt_token', authResponse.token);
    // Decode token or parse user data from response if needed
    localStorage.setItem('user_data', JSON.stringify({
      id: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      role: this.mapRole(authResponse.role)
    }));
  }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // getLoggedInUser(): User | null {
  //   const userData = localStorage.getItem('user_data');
  //   return userData ? JSON.parse(userData) : null;
  // }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    // Clear any other session data
  }
}