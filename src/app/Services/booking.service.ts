// booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../interfaces/booking.interface'; // Ensure path is correct

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings'; // Backend API URL for bookings

  constructor(private http: HttpClient) { }

  /**
   * Fetches all bookings for a specific user ID.
   * @param userId The ID of the user whose bookings are to be fetched.
   * @returns An Observable array of Bookings.
   */
  getBookingsByUserId(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Sends a new booking request to the backend.
   * This method will now implicitly send the new fields as part of the Booking object.
   * @param booking The Booking object to be created.
   * @returns An Observable of the created Booking (with ID and status from backend).
   */
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }
}
