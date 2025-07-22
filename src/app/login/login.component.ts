// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../Services/auths.service'; // We'll create this service next
import { CommonModule } from '@angular/common'; 
//import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, // <--- MAKE IT STANDALONE
  imports: [
    CommonModule,        // <--- Add this back! It's correct for standalone.
    ReactiveFormsModule, // <--- Add this back! It's correct for standalone.
    RouterModule,
    //HttpClientModule,
    RouterLink     // Add this if you use routerLink in the template
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Or .scss
  
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string | null = null; // For displaying backend errors

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect to home if already logged in (optional)
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/dashboard']); // Or wherever your dashboard is
    // }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required] 
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, password, role } = this.loginForm.value;

   this.authService.login({ username, password, role })
  .subscribe({
    next: (authResponse: any) => {
      // The cookie is set inside AuthService.login()
      // You can get the user ID from authResponse.id
      if (role === 'user') {
        this.router.navigate(['/user-dashboard', authResponse.id]);
      } else if (role === 'tailor') {
        this.router.navigate(['/tailor-dashboard', authResponse.id]);
      } else if (role === 'material') {
        this.router.navigate(['/material-dashboard', authResponse.id]);
      }
    },
    error: (error) => {
      this.errorMessage = error.message || 'Login failed. Please check your credentials.';
      this.loading = false;
    }
  });
   }
}