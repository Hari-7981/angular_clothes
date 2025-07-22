import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './Services/auths.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {}

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token = localStorage.getItem('jwt_token'); // Adjust the key if needed

  //   if (token) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //   }

  //   return next.handle(request);
  // }


//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   const token = localStorage.getItem('jwt_token');

//   if (token) {
//     request = request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next.handle(request).pipe(
//     catchError(err => {
//       if (err.status === 401 || err.status === 403) {
//         this.router.navigate(['/login']);
//       }
//       return throwError(() => err);
//     })
//   );
// }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
    catchError(err => {
      if (err.status === 401 || err.status === 403) {
        // Token might be invalid or expired
        // this.authService.logout(); // Clear storage
        // this.router.navigate(['/login']);
        console.error('Unauthorized request:', err);
      }
      return throwError(() => err);
    })
  );
  }
}
