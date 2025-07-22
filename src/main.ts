// 👉 Add this line at the very top of main.ts
(window as any).global = window;

// The rest of your file stays the same
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
