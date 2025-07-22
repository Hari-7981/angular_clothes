// src/app/services/twilio.service.ts
import { Injectable } from '@angular/core';
import { Device } from '@twilio/voice-sdk';

@Injectable({ providedIn: 'root' })
export class TwilioService {
  private device: Device | null = null;

  async init(identity: string) {
    const response = await fetch(`/api/twilio/token?identity=${identity}`);
    const token = await response.text();
    this.device = new Device(token, {});

    this.device.on('ready', () => console.log('Twilio Device Ready'));
    this.device.on('error', (err) => console.error('Twilio Error', err));
    this.device.on('connect', (conn: any) => {
      console.log('Call connected', conn);
      alert('Call connected!');
    });
    this.device.on('disconnect', () => {
      console.log('Call ended');
      alert('Call ended');
    });
  }

  call(targetIdentity: string) {
    if (this.device) {
      this.device.connect({ params: { To: targetIdentity } });
    }
  }

  hangup() {
    if (this.device) {
      this.device.disconnectAll();
    }
  }
}