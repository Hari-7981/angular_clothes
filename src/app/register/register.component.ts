// src/app/register/register.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { AuthService } from '../Services/auths.service';
import { RegisterRequest } from '../interfaces/register.interface'; // Import the interface
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    // Add all NgModules/Components used in your template here
    CommonModule, // For *ngIf
    ReactiveFormsModule, // For formGroup, formControlName
    // ... any other components or modules used
  ],
  standalone: true, // If you are using standalone components
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  // Define your roles for the dropdown, matching backend enum values
  roles: string[] = ['USER', 'TAILOR', 'MATERIAL'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the form in the constructor, then configure validators in ngOnInit
    this.registerForm = this.fb.group({
      role: ['USER', Validators.required], // Default to USER, required
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Basic 10-digit phone validation
      name: ['', [Validators.required, Validators.minLength(3)]],

     
      shopName: [''],
      experienceYears: [''],
      bio: [''],
      location: [''],
      supplierShopName: [''],
      startedDate: ['']
    });
  }

  ngOnInit(): void {

     this.route.paramMap.subscribe(params => { // <--- paramMap is used for route parameters
      const roleFromUrl = params.get('roleType'); // <--- Get the 'roleType' from the URL

      if (roleFromUrl && this.roles.includes(roleFromUrl.toUpperCase())) {
        // If a valid role is found in the URL, set it and disable the dropdown
        this.registerForm.get('role')?.setValue(roleFromUrl.toUpperCase());
        this.registerForm.get('role')?.disable(); // Disable to prevent user from changing it
      } else {
        // If no role in URL, or an invalid role, default to USER and allow selection
        this.registerForm.get('role')?.setValue('USER');
        this.registerForm.get('role')?.enable(); // Ensure it's enabled if defaulting
        // Optionally, redirect if an invalid role was in the URL
        if (roleFromUrl && !this.roles.includes(roleFromUrl.toUpperCase())) {
            console.warn(`Invalid role type in URL: ${roleFromUrl}. Defaulting to USER.`);
            // You might want to redirect back to choose-registration or an error page here
            // this.router.navigate(['/choose-registration']);
        }
      }
       this.setRoleSpecificValidators(this.registerForm.get('role')?.value);
    });
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      // Only set validators if the control is not disabled (i.e., user is allowed to change it)
      if (this.registerForm.get('role')?.enabled) {
          this.setRoleSpecificValidators(role);
      }
    });
  }




  private setRoleSpecificValidators(role: string): void {
    // Clear all existing role-specific validators first
    this.clearRoleSpecificValidators();

    // Apply validators based on the selected role
    switch (role) {
     
      case 'TAILOR':
        this.registerForm.get('shopName')?.setValidators([Validators.required, Validators.minLength(3)]);
        this.registerForm.get('experienceYears')?.setValidators([Validators.required, Validators.min(0)]);
        this.registerForm.get('bio')?.setValidators([Validators.maxLength(500)]); // Optional but with max length
        this.registerForm.get('location')?.setValidators([Validators.required]);
        break;
      case 'MATERIAL':
        this.registerForm.get('supplierShopName')?.setValidators([Validators.required, Validators.minLength(3)]);
        this.registerForm.get('startedDate')?.setValidators([Validators.required]);
        this.registerForm.get('bio')?.setValidators([Validators.maxLength(500)]); // Optional but with max length
        this.registerForm.get('location')?.setValidators([Validators.required]);
        break;
    }

    // Update validity for all fields affected by validator changes
    // This is crucial to re-evaluate validation status
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.updateValueAndValidity();
    });
  }

  private clearRoleSpecificValidators(): void {
    // List all role-specific controls
    const roleSpecificControls = [
      'firstName', 'lastName',
      'shopName', 'experienceYears',
      'supplierShopName', 'startedDate',
      'bio', 'location' // bio and location are shared but conditional
    ];

    roleSpecificControls.forEach(controlName => {
      const control = this.registerForm.get(controlName);
      if (control) {
        control.clearValidators();
        control.updateValueAndValidity(); // Update validity after clearing
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = ''; // Clear previous errors
    this.successMessage = ''; // Clear previous success messages

    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      // Optionally, mark all fields as touched to display validation errors
      this.markAllAsTouched(this.registerForm);
      return;
    }

    const formData: RegisterRequest = this.registerForm.value;

    // Filter out null/empty values for role-specific fields that are not applicable
    // This makes the payload cleaner, though backend should handle nulls gracefully
    const filteredFormData: RegisterRequest = Object.keys(formData).reduce((acc, key) => {
        const value = (formData as any)[key];
        if (value !== null && value !== '' && value !== undefined) {
            (acc as any)[key] = value;
        }
        return acc;
    }, {} as RegisterRequest);

    filteredFormData.role = this.registerForm.get('role')?.value;

    this.authService.register(filteredFormData).subscribe({
      next: (response: any) => {
        this.successMessage = 'Registration successful! You can now log in.';
        console.log('Registration successful:', response);
        // Redirect based on role
        const role = filteredFormData.role?.toUpperCase();
        if (role === 'TAILOR') {
          this.router.navigate(['/tailor-dashboard', response]);
        } else if (role === 'USER') {
          this.router.navigate(['/user-dashboard', response]);
        } else if (role === 'MATERIAL') {
          this.router.navigate(['/material-dashboard', response]);
        } else {
          this.router.navigate(['/login']); // fallback
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }

  // Helper to mark all form controls as touched to display validation messages
  private markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  // Helper to get error messages for template
  getControl(name: string): AbstractControl | null {
    return this.registerForm.get(name);
  }
}