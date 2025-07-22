// src/app/my-orders-list/my-orders-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'; // Important for standalone components
import { Order } from '../interfaces/order.interface';
import { OrderService } from '../Services/order.service'; // <--- Import the new OrderService

@Component({
  selector: 'app-my-orders-list',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe], // CommonModule for *ngIf, *ngFor; DatePipe/DecimalPipe for formatting
  templateUrl: './my-orders-list.component.html',
  styleUrls: ['./my-orders-list.component.css']
})
export class MyOrdersListComponent implements OnInit {

  orders: Order[] = [];
  loading: boolean = false; // <--- Loading state
  error: string | null = null; // <--- Error state

  constructor(
    private orderService: OrderService // <--- Inject the OrderService
  ) { }

  ngOnInit(): void {
    this.loadOrders(); // Call loadOrders on component initialization
  }

  loadOrders(): void {
    this.loading = true; // Set loading to true before fetching
    this.error = null; // Clear any previous errors

    this.orderService.getOrdersForUser().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.loading = false; // Set loading to false on success
      },
      error: (err: any) => {
        console.error('Failed to load orders:', err);
        this.error = err.message || 'Error loading your orders. Please try again.'; // Set error message
        this.loading = false; // Set loading to false on error
      }
    });
  }

  // You might still keep specific helper methods relevant to orders if needed:
  // For example, a method to get a more readable status message
  getClothStatusText(status: string): string {
    switch (status) {
      case 'Pending': return 'Pending';
      case 'Ordered': return 'Ordered from Supplier';
      case 'Received': return 'Received from Supplier';
      case 'Purchased': return 'Tailor Purchased';
      case 'In Transit': return 'On its way to you';
      case 'Delivered': return 'Delivered';
      case 'Not Applicable': return 'N/A';
      default: return status;
    }
  }

  // Placeholder for viewing order details (e.g., navigating to a detail page)
  viewOrderDetails(orderId: string): void {
    console.log(`Viewing details for order: ${orderId}`);
    // In a real app, you would navigate to a detailed order page:
    // this.router.navigate(['/orders', orderId]);
  }
}