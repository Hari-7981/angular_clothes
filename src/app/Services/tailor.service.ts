import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs'; // 'of' is used to create an observable from a static value
import { delay, tap } from 'rxjs/operators'; // For simulating network latency

import { Tailor } from '../interfaces/tailors.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TailorService {
  private tailorProfileSubject = new BehaviorSubject<Tailor | null>(null);
  public tailorProfile$ = this.tailorProfileSubject.asObservable();

  private apiUrl = 'http://localhost:8080/api/auth';

  // Mock data for demonstration purposes
  private mockTailors: Tailor[] = [
    {
      id: 'T001',
      name: 'Ramesh Tailors',
      phoneNumber: '9876543210',
      clothesStitched: 520,
      rating: 4.8,
      isVerified: true,
      location: 'Main Street, Markapur',
      profileImageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=R',
      tailorId: 'T001' // Assuming tailorId is not used in this mock data 
    },
    {
      id: 'T002',
      name: 'Shree Fashion',
      phoneNumber: '9988776655',
      clothesStitched: 310,
      rating: 4.5,
      isVerified: true,
      location: 'Gandhi Road, Markapur',
      profileImageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=S',
      tailorId: 'T002' // Assuming tailorId is not used in this mock data
    },
    {
      id: 'T003',
      name: 'Elegant Stitches',
      phoneNumber: '9123456789',
      clothesStitched: 180,
      rating: 3.9,
      isVerified: false,
      location: 'Industrial Area, Markapur',
      profileImageUrl: 'https://via.placeholder.com/150/008000/FFFFFF?text=E',
      tailorId: 'T003' // Assuming tailorId is not used in this mock data
    },
    {
      id: 'T004',
      name: 'Perfect Fit Studio',
      phoneNumber: '9012345678',
      clothesStitched: 750,
      rating: 4.9,
      isVerified: true,
      location: 'Temple Street, Markapur',
      profileImageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=P',
      tailorId: 'T004' // Assuming tailorId is not used in this mock data
    },
    {
      id: 'T005',
      name: 'Quick Sew',
      phoneNumber: '8765432109',
      clothesStitched: 95,
      rating: 4.2,
      isVerified: false,
      location: 'Bus Stand Road, Markapur',
      profileImageUrl: 'https://via.placeholder.com/150/FF8C00/FFFFFF?text=Q',
      tailorId: 'T005' // Assuming tailorId is not used in this mock data
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Fetches all tailors. Simulates an API call with a delay.
   */
  getAllTailors(role: string): Observable<Tailor[]> {
    return this.http.get<any>(`${this.apiUrl}/tailorlist?role=${role}`);
  }

  /**
   * Fetches a single tailor by ID.
   */
  getTailorById(tailorId: string): Observable<Tailor | null> {
    return this.http.get<Tailor | null>(`${this.apiUrl}/tailor/profile/${tailorId}`);
  }

  /**
   * Updates the tailor profile and notifies subscribers (dashboard, etc.)
   */
 

  /**
   * Gets the current tailor profile (for immediate value)
   */
  get currentTailorProfile(): Tailor | null {
    return this.tailorProfileSubject.value;
  }

  // In a real application, you'd integrate with HttpClient here:
  // constructor(private http: HttpClient) {}
  // getAllTailors(): Observable<Tailor[]> {
  //   return this.http.get<Tailor[]>(`${environment.apiUrl}/tailors`);
  // }
  // getTailorById(id: string): Observable<Tailor> {
  //   return this.http.get<Tailor>(`${environment.apiUrl}/tailors/${id}`);
  // }

  
  getTailorProfile(tailorId: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tailor/profile/${tailorId}`);
  }

 updateTailorProfile(formData: FormData, tailorId: string): Observable<any> {
   const token = localStorage.getItem('jwtToken');
   const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}` // ✅ JWT token from storage
  });
  return this.http.put<any>(`${this.apiUrl}/tailor/profile/${tailorId}`, formData, { headers }).pipe(
    tap(updated => this.tailorProfileSubject.next(updated))
  );
 }


  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file);
    return this.http.post<any>(`${this.apiUrl}/tailor/uploadProfileImage`, formData);
  }

  uploadWorks(files: FileList): Observable<any> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('workImages', file);
    });
    return this.http.post<any>(`${this.apiUrl}/tailor/uploadWorks`, formData);
  }
}