// src/app/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // 'of' for mock data
import { Order } from '../interfaces/order.interface'; // Ensure path is correct

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'YOUR_SPRING_BOOT_API_BASE_URL/api/orders'; // <--- IMPORTANT: Replace with your actual API URL

  constructor(private http: HttpClient) { }

  /**
   * Fetches orders for the currently logged-in user (customer or tailor).
   * In a real app, you might pass user ID or get it from auth token.
   */
  getOrdersForUser(): Observable<Order[]> {
    // In a real application, you'd make an HTTP request:
    // return this.http.get<Order[]>(this.apiUrl);

    // --- MOCK DATA for development ---
    const mockOrders: Order[] = [
      {
        id: 'ORD001',
        itemName: 'Custom Suit',
        description: 'A bespoke three-piece suit for a formal event.',
        deliveryDate: new Date('2025-07-15'),
        fixedCost: 5000,
        clothDeliveringStatus: 'Pending',
        clothBuyingByTailorStatus: 'Pending',
        clothGettingFromMaterialSupplierStatus: 'Ordered'
      },
      {
        id: 'ORD002',
        itemName: 'Party Dress',
        description: 'Elegant evening gown with intricate embroidery.',
        deliveryDate: new Date('2025-08-01'),
        fixedCost: 2500,
        clothDeliveringStatus: 'In Transit',
        clothBuyingByTailorStatus: 'Purchased',
        clothGettingFromMaterialSupplierStatus: 'Received'
      },
      {
        id: 'ORD003',
        itemName: 'Casual Shirt',
        description: 'Light blue linen shirt for everyday wear.',
        deliveryDate: new Date('2025-07-05'),
        fixedCost: 1200,
        clothDeliveringStatus: 'Delivered',
        clothBuyingByTailorStatus: 'Not Applicable',
        clothGettingFromMaterialSupplierStatus: 'Not Applicable'
      },
      {
        id: 'ORD004',
        itemName: 'Wedding Lehenga',
        description: 'Traditional Indian bridal outfit with heavy embellishments.',
        deliveryDate: new Date('2025-09-20'),
        fixedCost: 15000,
        clothDeliveringStatus: 'Pending',
        clothBuyingByTailorStatus: 'Pending',
        clothGettingFromMaterialSupplierStatus: 'Pending'
      }
    ];
    return of(mockOrders); // 'of' creates an observable from the mock data
  }

  // You might add other methods here like:
  // getOrderById(id: string): Observable<Order> { ... }
  // createOrder(order: Order): Observable<Order> { ... }
  // updateOrderStatus(id: string, status: string): Observable<Order> { ... }
}