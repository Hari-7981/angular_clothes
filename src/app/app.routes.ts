// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookingComponent } from './bookings/bookings.component';
 // Import your protected component here


export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
 
  {
    path: 'user-dashboard/:id', // Dynamic parameter for user ID
    // This will be the parent route for user-specific features
    // lazy-load the UserDashboardComponent which will act as the parent layout
    loadComponent: () => import('./user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
     // Guards applied to the parent route
    data: { roles: ['user'] }, // Data for the RoleGuard
    children: [
      // Lazy-load child components as well
      {
        path: 'material-suppliers', 
        loadComponent: () => import('./material-suppliers-list/material-suppliers-list.component').then(m => m.MaterialSuppliersListComponent)
      },
      {
        path: 'tailors', 
        loadComponent: () => import('./tailors-list/tailors-list.component').then(m => m.TailorsListComponent)
      },
      {
        path: 'my-bookings',
        loadComponent: () => import('./bookings/bookings.component').then(m => m.BookingComponent)
      },

        { path: '', redirectTo: 'tailors', pathMatch: 'full' }
      ]
    },
    {
    path: 'tailor-dashboard/:id',
    loadComponent: () => import('./tailor-dashboard/tailor-dashboard.component').then(m => m.TailorDashboardComponent),
    children: [
      {
        path: 'my-orders',
        loadComponent: () => import('./my-orders-list/my-orders-list.component').then(m => m.MyOrdersListComponent)
      },
      {
        path: 'material-supplier',
        loadComponent: () => import('./material-suppliers-list/material-suppliers-list.component').then(m => m.MaterialSuppliersListComponent)
      },

      { path: 'chat-dashboard',
        loadComponent: () => import('./chat-dashboard/chat-dashboard.component').then(m => m.ChatsDashboardComponent),
        children: [
         { path: 'chat-room', 
    loadComponent: () => import('./chat-room/chat-room.component').then(m => m.ChatRoomComponent)
  }]
      },
      // // Default child route for tailor-dashboard: redirects to 'my-orders'
      { path: '', redirectTo: 'material-supplier', pathMatch: 'full' },
    ]
  },
 {
    path: 'register', 
    loadComponent: () => import('./register-chooser/register-chooser.component').then(m => m.RegisterChooserComponent)
  },
 {
    path: 'register/:roleType', // Your route with the dynamic parameter
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'tailor-details/:id',
    loadComponent: () => import('./tailor-details/tailor-details.component').then(m => m.TailorDetailsComponent)
  },
  // {
  //   path: 'tailor-book/:id',
  //   loadComponent: () => import('./tailor-book/tailor-book.component').then(m => m.TailorBookComponent)
  // },
  {
    path: 'tailor-profile/:id',
    loadComponent: () => import('./tailor-profile/tailor-profile.component').then(m => m.TailorProfileComponent)
  },

  { path: 'chat-room', 
    loadComponent: () => import('./chat-room/chat-room.component').then(m => m.ChatRoomComponent)
  },

    
    { path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: '**', redirectTo: 'login' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }