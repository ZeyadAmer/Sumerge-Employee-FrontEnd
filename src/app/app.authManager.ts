import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthManager implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    const token = this.cookieService.get('authToken'); // Check if authToken exists

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      // Make the HTTP request and return an Observable<boolean>
      return this.http.get<{ role: string }>('http://localhost:8080/auth', { headers }).pipe(
        map((response) => {
          if (response.role === 'ROLE_MANAGER') {
            return true; // Allow access if the role is manager
          } else {
            this.router.navigate(['/home']); // Redirect to home if not admin
            return false;
          }
        }),
        catchError((error) => {
          console.error('Error occurred:', error);
          this.router.navigate(['/login']); // Redirect to login on error
          return of(false); // Deny access on error
        })
      );
    } else {
      this.router.navigate(['/login']); // Redirect to login if no token
      return of(false); // Deny access if no token
    }
  }
}
