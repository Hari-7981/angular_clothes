import { Component, OnInit, DoCheck, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TailorService } from '../Services/tailor.service';
import { InlineEditCardComponent } from '../inline-edit-card.component';
import { error } from 'console';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tailor-profile',
  templateUrl: './tailor-profile.component.html',
  styleUrl: './tailor-profile.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, InlineEditCardComponent]
})
export class TailorProfileComponent implements OnInit{
  tailor = {
    id: '',
    name: '',
    phoneNumber: '',
    email: '',
    isVerified: false,
    profileImageUrl: '',
    works: [] as string[],
    phoneVerified: false,
    emailVerified: false,
    clothesStitched: 0,
    rating: 0,
    location: '',
    bio: '',
    shopName: '', // <-- add this
    experienceYears: 0 // <-- add this
  };
  worksPreviewUrls: string[] = [];
  phoneOtpSent = false;
  emailOtpSent = false;
  phoneOtp = '';
  emailOtp = '';
  phoneOtpInput = '';
  emailOtpInput = '';
  phoneOtpError = '';
  emailOtpError = '';
  profileImagePreviewUrl: string | null = null;
  private lastSavedState: string = '';

  // Edit/view toggle additions
  editMode: boolean = false;
  editedProfile: typeof this.tailor = { ...this.tailor };
  inlineEditField: string | null = null;
   @ViewChild('profileInput') profileImageInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('worksInput') worksInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private tailorService: TailorService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Load tailor profile from localStorage if available
    console.log('TailorProfileComponent loaded');

    const tailorId = this.route.snapshot.paramMap.get('id');
    if (tailorId) {
      this.tailorService.getTailorProfile(tailorId).subscribe(tailor => {
        if (tailor) {
          console.log('Tailor data fetched:', tailor);  
          this.tailor = {
         ...tailor,
         works: tailor.works ?? [],
        profileImageUrl: tailor.profileImageUrl ?? '',
};

          this.profileImagePreviewUrl = tailor.profileImageUrl || null;
          this.worksPreviewUrls = tailor.works || [];
      //    this.tailorService.updateTailorProfile(this.tailor,tailorId);
        }
      });
    }
    this.lastSavedState = JSON.stringify(this.tailor) + this.worksPreviewUrls.join(',');
    // Initialize editedProfile
    this.editedProfile = { ...this.tailor };
  }

  // ngDoCheck(): void {
  //   // Autosave on any change
  //   const currentState = JSON.stringify(this.tailor) + this.worksPreviewUrls.join(',');
  //   if (currentState !== this.lastSavedState && this.worksPreviewUrls.length >= 3) {
  //     this.saveProfile();
  //     this.lastSavedState = currentState;
  //   }
  // }

  onWorksUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.worksPreviewUrls = [];
      for (const file of Array.from(input.files)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.worksPreviewUrls.push(e.target.result);
          this.tailor.works = this.worksPreviewUrls;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onProfileImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreviewUrl = e.target.result;
        this.tailor.profileImageUrl = this.profileImagePreviewUrl || '';
      };
      reader.readAsDataURL(file);
    }
  }

  enableEdit() {
    this.editMode = true;
    this.editedProfile = { ...this.tailor };
  }

  // saveProfile() {
  //   const payload = {
  //     ...this.editedProfile,
  //     workSamples: this.worksPreviewUrls
  //   };

  //   this.http.put<any>('YOUR_API_ENDPOINT/tailor/profile', payload).subscribe(
  //     updated => {
  //       this.tailor = updated;
  //       this.editedProfile = { ...updated };
  //       this.inlineEditField = null;
  //     },
  //     error => {
  //       console.error('Failed to save profile:', error);
  //     }
  //   );
  // }

  // cancelProfile() {
  //   this.editedProfile = { ...this.tailor };
  //   this.inlineEditField = null;
  // }

  cancelProfile() {
    this.editedProfile = { ...this.tailor };
    this.inlineEditField = null;
  }

 saveProfile() {
  console.log('[saveProfile] called');
  const tailorId = this.tailor.id;
  if (!tailorId) {
    console.error('[saveProfile] Missing tailor ID!');
    return;
  }

  // Prepare form data
  const formData = new FormData();
 const profile = {
  id: tailorId,
  phoneNumber: this.tailor.phoneVerified ? this.editedProfile.phoneNumber : this.tailor.phoneNumber,
  email: this.tailor.emailVerified ? this.editedProfile.email : this.tailor.email,
  name: this.editedProfile.name?.trim() || this.tailor.name,
  shopName: this.editedProfile.shopName?.trim() || this.tailor.shopName,
  location: this.editedProfile.location?.trim() || this.tailor.location,
  bio: this.editedProfile.bio?.trim() || this.tailor.bio,
  works: this.worksPreviewUrls,
  profileImageUrl: '' // let backend overwrite if image is uploaded
};

  console.log('[saveProfile] Prepared profile:', profile);

  formData.append('profile', new Blob([JSON.stringify(profile)], { type: 'application/json' }));

  // Add the profile image if available (assuming selected as File)
  const imageInput = this.profileImageInputRef?.nativeElement;
if (imageInput?.files?.length) {
  formData.append('image', imageInput.files[0]);
}


const worksInput = this.worksInputRef?.nativeElement;
if (worksInput?.files?.length) {
  Array.from(worksInput.files).forEach(file => {
    formData.append('works', file);
  });
}

console.log('[saveProfile] Final FormData ready');

  this.tailorService.updateTailorProfile(formData, tailorId).subscribe({
    next: (updated: any) => {
      this.tailor = updated;
      this.editedProfile = { ...updated };
      this.inlineEditField = null;
    this.router.navigate(['/tailor-dashboard', tailorId]);

      console.log('Profile saved successfully:', updated);
    },
    error: (error: any) => {
      console.error('Failed to save profile:', error);
    }
  });
 }


  cancelEdit() {
    this.editMode = false;
    this.editedProfile = { ...this.tailor };
  }

  sendPhoneOtp() {
    // Simulate sending OTP (replace with backend call)
    this.phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.phoneOtpSent = true;
    this.phoneOtpError = '';
    setTimeout(() => alert('Phone OTP: ' + this.phoneOtp), 100); // Remove in production
  }

  verifyPhoneOtp() {
    if (this.phoneOtpInput === this.phoneOtp) {
      this.tailor.phoneVerified = true;
      this.phoneOtpError = '';
      alert('Phone number verified!');
    } else {
      this.phoneOtpError = 'Invalid OTP. Please try again.';
    }
  }

  sendEmailOtp() {
    // Simulate sending OTP (replace with backend call)
    this.emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.emailOtpSent = true;
    this.emailOtpError = '';
    setTimeout(() => alert('Email OTP: ' + this.emailOtp), 100); // Remove in production
  }

  verifyEmailOtp() {
    if (this.emailOtpInput === this.emailOtp) {
      this.tailor.emailVerified = true;
      this.emailOtpError = '';
      alert('Email verified!');
    } else {
      this.emailOtpError = 'Invalid OTP. Please try again.';
    }
  }

  startInlineEdit(field: string) {
    this.inlineEditField = field;
    this.editedProfile = { ...this.tailor };
  }



saveInlineEdit(field: string) {
  if (field === 'name') {
    this.tailor.name = this.editedProfile.name;
  } else if (field === 'phoneNumber') {
    if (this.tailor.phoneNumber !== this.editedProfile.phoneNumber) {
      this.tailor.phoneNumber = this.editedProfile.phoneNumber;
      this.tailor.phoneVerified = false;
      this.editedProfile.phoneVerified = false;
      this.phoneOtpSent = false;
      this.phoneOtpInput = '';
    }
  } else if (field === 'email') {
    if (this.tailor.email !== this.editedProfile.email) {
      this.tailor.email = this.editedProfile.email;
      this.tailor.emailVerified = false;
      this.editedProfile.emailVerified = false;
      this.emailOtpSent = false;
      this.emailOtpInput = '';
    }
  } else if (field === 'shopName') {
    this.tailor.shopName = this.editedProfile.shopName;
  } else if (field === 'location') {
    this.tailor.location = this.editedProfile.location;
  } else if (field === 'bio') {
    this.tailor.bio = this.editedProfile.bio;
  }

  this.inlineEditField = null;

  // 🔁 Build FormData to match backend
  const formData = new FormData();
  const profile = {
    ...this.tailor,
    works: this.worksPreviewUrls,
   profileImageUrl: this.tailor.profileImageUrl || ''
 // Let backend update if image file is sent separately
  };

  formData.append('profile', new Blob([JSON.stringify(profile)], { type: 'application/json' }));

  // Optionally append image if needed (skip here if no change)
  const imageInput = document.querySelector('#profileImageInput') as HTMLInputElement;
  if (imageInput?.files?.length) {
    formData.append('image', imageInput.files[0]);
  }

  this.tailorService.updateTailorProfile(formData, this.tailor.id).subscribe({
    next: (updated: any) => {
      this.tailor = updated;
      this.editedProfile = { ...updated };
      localStorage.setItem('tailor_profile', JSON.stringify(this.tailor));
    },
    error: (err) => {
      console.error('Inline update failed:', err);
    }
  });
}

  cancelInlineEdit() {
    this.inlineEditField = null;
    this.editedProfile = { ...this.tailor };
  }

  getEditLabel(field: string | null): string {
    switch (field) {
      case 'name': return 'Name';
      case 'phoneNumber': return 'Phone Number';
      case 'email': return 'Email';
      case 'shopName': return 'Shop Name';
      case 'location': return 'Location';
      case 'bio': return 'Bio';
      default: return '';
    }
  }

  getEditValue(field: string | null): string {
    if (!field) return '';
    switch (field) {
      case 'name': return this.editedProfile.name || '';
      case 'phoneNumber': return this.editedProfile.phoneNumber || '';
      case 'email': return this.editedProfile.email || '';
      case 'shopName': return this.editedProfile.shopName || '';
      case 'location': return this.editedProfile.location || '';
      case 'bio': return this.editedProfile.bio || '';
      default: return '';
    }
  }

  getEditType(field: string | null): string {
    if (field === 'email') return 'email';
    if (field === 'phoneNumber') return 'tel';
    return 'text';
  }

  onModalEditSave(newValue: string) {
    if (!this.inlineEditField) return;
    switch (this.inlineEditField) {
      case 'name': this.editedProfile.name = newValue; break;
      case 'phoneNumber': this.editedProfile.phoneNumber = newValue; break;
      case 'email': this.editedProfile.email = newValue; break;
      case 'shopName': this.editedProfile.shopName = newValue; break;
      case 'location': this.editedProfile.location = newValue; break;
      case 'bio': this.editedProfile.bio = newValue; break;
    }
    this.saveInlineEdit(this.inlineEditField);
  }

  // Returns true if any field in editedProfile is different from tailor
  editedProfileChanged(): boolean {
    // Only check fields that are editable in the UI
    return (
      this.tailor.name !== this.editedProfile.name ||
      this.tailor.phoneNumber !== this.editedProfile.phoneNumber ||
      this.tailor.email !== this.editedProfile.email ||
      this.tailor.shopName !== this.editedProfile.shopName ||
      this.tailor.location !== this.editedProfile.location ||
      this.tailor.bio !== this.editedProfile.bio
    );
  }

  
}
