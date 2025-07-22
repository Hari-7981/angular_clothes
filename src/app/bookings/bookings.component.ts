import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Tailor } from '../interfaces/tailors.interface';
import { User } from '../interfaces/user.interface';
import { Booking } from '../interfaces/booking.interface';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../Services/auths.service';
import { TailorService } from '../Services/tailor.service';
import { BookingService } from '../Services/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})

export class BookingComponent implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  loadingBookings: boolean = true;
  bookingError: string | null = null;
  currentUser: User | null = null;
  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService, // Still need this to get user ID
    private bookingService: BookingService, // Still need this for actual data fetching
    @Inject(DOCUMENT) private document: Document // Inject DOCUMENT to access cookies
  ) { }

  ngOnInit(): void {
    console.log('BookingComponent initialized');
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      console.log('AuthService emitted user:', user);
      this.currentUser = user;
      if (user && user.id) {
        this.loadBookings();
      } else {
        // Try to get user id from cookie if not logged in
        const userId = this.getCookie('user_id');
        if (userId) {
          this.currentUser = { id: userId, username: '', role: 'user' };
          this.loadBookings();
        } else {
          this.bookings = [];
          this.loadingBookings = false;
          this.bookingError = 'Please log in to view your bookings.';
        }
      }
    });

    if (this.authService.currentUserValue && this.authService.currentUserValue.id) {
      console.log('User already authenticated on init:', this.authService.currentUserValue);
      this.currentUser = this.authService.currentUserValue;
      this.loadBookings();
    }
  }

  // Method to load bookings - either dummy data or actual API call
  loadBookings(): void {
    console.log('loadBookings called. Current user:', this.currentUser);
    // This is the function called by the "Retry" button in the template.
    // If using real data, uncomment the logic below:
    
    if (!this.currentUser || !this.currentUser.id) {
      this.bookingError = 'User not logged in. Cannot fetch bookings.';
      this.loadingBookings = false;
      return;
    }

    this.loadingBookings = true;
    this.bookingError = null;
    console.log('Fetching bookings for user id:', this.currentUser.id);
    this.bookingService.getBookingsByUserId(this.currentUser.id).subscribe({
      next: (data) => {
        console.log('Bookings loaded:', data);
        this.bookings = data;
        this.loadingBookings = false;
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.bookingError = 'Failed to load your bookings. Please try again.';
        this.loadingBookings = false;
        this.bookings = [];
      }
    });
    // Uncomment the following line if using real data
    // this.simulateLoadingWithDummyData();
  }

  // Helper for dummy data loading
  // private simulateLoadingWithDummyData(): void {
  //   this.loadingBookings = true;
  //   this.bookingError = null; // Clear previous errors

  //   setTimeout(() => {
  //     this.bookings = [
  //       {
  //         id: 'BKG001',
  //         userId: 'user123',
  //         tailorId: 'tailorA',
  //         bookingDate: '2025-07-01',
  //         deliveryDate: '2025-07-15',
  //         serviceType: 'Custom Suit',
  //         fixedCost: 250.00,
  //         clothHandlingOption: 'Delivering Myself',
  //         description: 'Dark blue wool suit, slim fit, peak lapel. Measurements attached. Standard lining.',
  //         status: 'Confirmed',
  //         createdAt: '2025-06-28T10:00:00Z'
  //       },
  //       {
  //         id: 'BKG002',
  //         userId: 'user123',
  //         tailorId: 'tailorB',
  //         bookingDate: '2025-06-25',
  //         deliveryDate: '2025-07-10',
  //         serviceType: 'Alterations',
  //         fixedCost: 45.50,
  //         clothHandlingOption: 'Delivering Myself',
  //         description: 'Hemming on 2 pairs of jeans and waist adjustment on a dress.',
  //         status: 'Pending',
  //         createdAt: '2025-06-24T14:30:00Z'
  //       },
  //       {
  //         id: 'BKG003',
  //         userId: 'user123',
  //         tailorId: 'tailorC',
  //         bookingDate: '2025-06-20',
  //         deliveryDate: '2025-07-05',
  //         serviceType: 'Dressmaking',
  //         fixedCost: 180.00,
  //         clothHandlingOption: 'Buy by Tailor',
  //         description: 'Summer dress, floral print, knee-length. Tailor to source light cotton fabric.',
  //         status: 'Completed',
  //         createdAt: '2025-06-19T09:15:00Z'
  //       },
  //       {
  //         id: 'BKG004',
  //         userId: 'user123',
  //         tailorId: 'tailorD',
  //         bookingDate: '2025-06-18',
  //         deliveryDate: '2025-07-03',
  //         serviceType: 'Embroidery',
  //         fixedCost: 75.00,
  //         clothHandlingOption: 'Get from Supplier',
  //         description: 'Embroidery of a custom logo on 5 shirts. Details sent via email.',
  //         status: 'Cancelled',
  //         createdAt: '2025-06-17T11:00:00Z'
  //       }
  //     ];
  //     this.loadingBookings = false;
  //   }, 1000); // Simulate 1-second network delay
  // }

  // Helper to get cookie value
  private getCookie(name: string): string | null {
    const match = this.document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  ngOnDestroy(): void {
    // Only needed if you uncomment the real data fetching logic
    this.userSubscription?.unsubscribe();
  }
  }
