import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf, *ngFor
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // For safe tel: links

import { MaterialService } from '../Services/material.service'; // Use the service that fetches suppliers
import { MaterialSupplier } from '../interfaces/material-supplier.interface'; // Import the interface

@Component({
  selector: 'app-material-suppliers-list',
  standalone: true,
  imports: [CommonModule], // Only CommonModule is strictly needed for display directives
  templateUrl: './material-suppliers-list.component.html',
  styleUrls: ['./material-suppliers-list.component.css']
})
export class MaterialSuppliersListComponent implements OnInit {
  suppliers: MaterialSupplier[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private materialService: MaterialService, // Inject MaterialService
    private sanitizer: DomSanitizer // For sanitizing phone links
  ) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.error = null;

    this.materialService.getMaterialSuppliers().subscribe({
      next: (data: any) => {
        this.suppliers = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load material suppliers:', err);
        this.error = err.message || 'Error loading material suppliers. Please try again.';
        this.loading = false;
      }
    });
  }

  // Helper to generate star rating display (e.g., "★★★★☆")
  getStarRating(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating)); // Fixed typo here
    return fullStars + emptyStars;
  }

  // Sanitize tel: link for safety
  getSafeTelLink(phoneNumber: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl('tel:' + phoneNumber);
  }

  // Placeholder for audio call (requires specific integration)
  startAudioCall(phoneNumber: string): void {
    alert(`Initiating audio call to ${phoneNumber} (feature coming soon!).`);
    // This would typically integrate with a WebRTC solution or a third-party calling API.
  }

  // Placeholder for profile image if not available
  getProfileImage(supplier: MaterialSupplier): string {
    return supplier.profileImageUrl || 'assets/placeholder-supplier.jpg'; // Path to a default image
  }
}