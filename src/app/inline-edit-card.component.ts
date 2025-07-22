import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inline-edit-card',
  template: `
    <div class="inline-edit-overlay">
      <div class="inline-edit-card">
        <label *ngIf="label">{{ label }}</label>
        <input [(ngModel)]="internalValue" [type]="type" />
        <ng-container *ngIf="type === 'email' || type === 'tel'">
          <div class="otp-section">
            <button class="otp-btn" (click)="sendOtp()" *ngIf="!otpSent">Send OTP</button>
            <div *ngIf="otpSent">
              <input [(ngModel)]="otpInput" maxlength="6" placeholder="Enter OTP" class="otp-input" />
              <button class="verify-btn" (click)="verifyOtp()">Verify</button>
              <span class="otp-status" *ngIf="otpStatus">{{ otpStatus }}</span>
            </div>
          </div>
        </ng-container>
        <div class="actions">
          <button class="save-btn" (click)="onSave()"><i class="fa fa-check"></i></button>
          <button class="cancel-btn" (click)="onCancel()"><i class="fa fa-times"></i></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inline-edit-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.32);
      z-index: 1000;
     display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .inline-edit-card {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 2.2rem 2.5rem 2rem 2.5rem;
      min-width: 320px;
      max-width: 420px;
      width: 100%;
      position: relative;
      z-index: 1010;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      animation: fadeIn 0.18s;
    }
    .inline-edit-card label {
      font-weight: 600;
      margin-bottom: 0.7rem;
      color: #222;
      font-size: 1.1rem;
    }
    .inline-edit-card input {
      padding: 12px 16px;
      border: 1.5px solid #d0d0d0;
      border-radius: 8px;
      font-size: 1.1rem;
      margin-bottom: 1.3rem;
      outline: none;
      transition: border 0.2s;
    }
    .inline-edit-card input:focus {
      border: 1.5px solid #0078d4;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1.1rem;
    }
    .save-btn, .cancel-btn {
      background: none;
      border: none;
      font-size: 1.4em;
      cursor: pointer;
      color: #0078d4;
      transition: color 0.2s, background 0.2s;
      padding: 0.3em 0.6em;
      border-radius: 6px;
    }
    .save-btn:hover { color: #28a745; background: #eafbe7; }
    .cancel-btn:hover { color: #e74c3c; background: #fdeaea; }
    .otp-section {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .otp-btn, .verify-btn {
      background: #0078d4;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 0.4em 1em;
      font-size: 1em;
      cursor: pointer;
      margin-top: 0.3em;
      align-self: flex-start;
    }
    .otp-btn:hover, .verify-btn:hover {
      background: #005fa3;
    }
    .otp-input {
      border: 1.5px solid #d0d0d0;
      border-radius: 6px;
      padding: 0.4em 0.7em;
      font-size: 1em;
      width: 120px;
      margin-right: 0.5em;
    }
    .otp-status {
      color: #28a745;
      font-size: 0.95em;
      margin-top: 0.2em;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 600px) {
      .inline-edit-card {
        min-width: 90vw;
        max-width: 98vw;
        padding: 1.2rem 0.7rem 1rem 0.7rem;
      }
    }
  `],
   standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InlineEditCardComponent implements OnChanges {
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  // Make value two-way bound for modal editing
  ngOnChanges() {
    this.internalValue = this.value;
  }
  internalValue: string = '';

  otpSent = false;
  otpInput: string = '';
  otpCode: string = '';
  otpStatus: string = '';

  sendOtp() {
    this.otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpSent = true;
    this.otpStatus = '';
    setTimeout(() => {
      alert(`${this.type === 'email' ? 'Email' : 'Phone'} OTP: ${this.otpCode}`);
    }, 100);
  }

  verifyOtp() {
    if (this.otpInput === this.otpCode) {
      this.otpStatus = 'Verified!';
    } else {
      this.otpStatus = 'Invalid OTP. Try again.';
    }
  }

  onSave() {
    // Only allow save if OTP is verified for phone/email
    if ((this.type === 'email' || this.type === 'tel') && this.otpSent && this.otpStatus !== 'Verified!') {
      this.otpStatus = 'Please verify OTP before saving.';
      return;
    }
    this.save.emit(this.internalValue);
  }
  onCancel() {
    this.cancel.emit();
  }
}
