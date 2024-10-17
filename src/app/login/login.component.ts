import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule], 
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  token: string = '';
  
  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

  onSubmit() {
    this.error = this.validateInput();

    if (this.error) {
      return; // Exit early if there is a validation error
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<{ token: string }>('http://localhost:8080/auth/login', loginData).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response.token);
      },
      error: (error) => {
        this.handleLoginError(error);
      }
    });
  }

  private validateInput(): string {
    if (this.email === '') {
      return "You must enter an email";
    }
    if (this.password === '') {
      return "You must enter a password";
    }
    return '';
  }

  private handleLoginSuccess(token: string): void {
    console.log(token);
    this.token = token;
    this.cookieService.set('authToken', this.token);
    this.resetForm();
    this.error = 'Login successful!';
    this.router.navigate(['/home']);
  }

  private handleLoginError(error: any): void {
    console.error('Error occurred:', error);
    this.resetForm();
    this.error = error.error || 'An error occurred. Please try again.';
  }

  private resetForm(): void {
    this.email = '';
    this.password = '';
  }
}
