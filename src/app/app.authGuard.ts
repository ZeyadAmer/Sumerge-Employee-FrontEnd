import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private cookieService: CookieService,private http: HttpClient, private router: Router) {}

  canActivate(): boolean {
    const token = this.cookieService.get('authToken'); // Check if authToken exists

    if (token) {
      return true; 
    } else {
      this.router.navigate(['/login']);
      return false; // Deny access
    }
  }
 

}
