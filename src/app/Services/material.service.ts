import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Add 'of' for mock data
import { catchError, delay } from 'rxjs/operators'; // Add 'delay' for mock data simulation
import { environment } from '../../environments/environment';
import { Material } from '../interfaces/material.interface';
import { MaterialSupplier } from '../interfaces/material-supplier.interface'; // <--- Import new interface

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materialsApiUrl = `${environment.apiUrl}/api/materials`;
  private suppliersApiUrl = `${environment.apiUrl}/api/material-suppliers`; // New API endpoint for suppliers

  // Mock data for Material Suppliers for demonstration
  private mockSuppliers: MaterialSupplier[] = [
    {
      id: 'MS001',
      shopName: 'Fabric Haven',
      rating: 4.7,
      description: 'Your one-stop shop for all types of high-quality fabrics and notions.',
      location: 'Central Market, Markapur',
      phoneNumber: '9123450001',
      profileImageUrl: 'https://via.placeholder.com/100/007bff/FFFFFF?text=FH'
    },
    {
      id: 'MS002',
      shopName: 'Threads & More',
      rating: 4.5,
      description: 'Wide range of threads, buttons, zippers, and custom fabric prints.',
      location: 'New Town, Markapur',
      phoneNumber: '9123450002',
      profileImageUrl: 'https://via.placeholder.com/100/28a745/FFFFFF?text=TM'
    },
    {
      id: 'MS003',
      shopName: 'Designer Fabrics India',
      rating: 4.9,
      description: 'Premium Indian and imported fabrics for bespoke tailoring.',
      location: 'Fashion Street, Markapur',
      phoneNumber: '9123450003',
      profileImageUrl: 'https://via.placeholder.com/100/ffc107/FFFFFF?text=DF'
    },
    {
      id: 'MS004',
      shopName: 'Cotton World',
      rating: 4.2,
      description: 'Specializing in organic and sustainable cotton varieties.',
      location: 'Old Bazaar, Markapur',
      phoneNumber: '9123450004',
      profileImageUrl: 'https://via.placeholder.com/100/6f42c1/FFFFFF?text=CW'
    }
  ];


  constructor(private http: HttpClient) { }

  /**
   * Fetches all available materials from the backend.
   */
  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.materialsApiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Fetches all material suppliers. (Using mock data for now)
   * In a real app, this would be an HTTP call.
   */
  getMaterialSuppliers(): Observable<MaterialSupplier[]> {
    // return this.http.get<MaterialSupplier[]>(this.suppliersApiUrl).pipe(
    //   catchError(this.handleError)
    // );
    return of(this.mockSuppliers).pipe(delay(500)); // Simulate network delay
  }

  /**
   * Fetches a single material by its ID.
   */
  getMaterialById(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.materialsApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred in MaterialService:', error);
    let errorMessage = 'Something went wrong. Please try again later.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Server returned code ${error.status}: ${error.message || error.statusText}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}