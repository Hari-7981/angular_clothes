// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Device } from '@twilio/voice-sdk';

// @Injectable({ providedIn: 'root' })
// export class TwilioService {
//    device: any;

//   constructor(private http: HttpClient) {}

//    async init(userId: string): Promise<void> {
//     try {
//       const token = await this.http.get(`/api/twilio/token/${userId}`, { responseType: 'text' }).toPromise();
      

//       if (token) {
//       // ✅ Use new Device(token) instead of Device.setup(token)
//       this.device = new Device(token, { 
//         // Optional: add options
       
//       });

//       this.device.on('ready', () => {
//         console.log('Twilio Device is ready.'); 
//       });

//       this.device.on('error', (error: Error) => {
//         console.error('Twilio Device error:', error);
//       });
//     } 
//   }catch (err) {
//       console.error('Failed to initialize Twilio Device:', err);
//     }
//   }


//   call(identity: string) {
//     this.device.connect({ To: identity });
//   }

//   disconnect() {
//     this.device.disconnectAll();
//   }
// }
