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
  

  constructor(private http: HttpClient,private cookieService: CookieService, private router: Router) {}

  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    if(this.email===""){
      this.error = "you must enter an email";
    }else if(this.password===""){
      this.error = "you must enter password";
    }
    else{
    
    this.http.post<{token:string}>('http://localhost:8080/auth/login', loginData).subscribe(
      (response) => {
        console.log(response.token);
        this.token = response.token;
        this.cookieService.set('authToken', this.token);
        this.email = '';
        this.password = '';
        this.error = 'Login successful!';
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error occurred:', error);
        this.email = '';
        this.password = '';
        this.error = error.error;
      }
    );
  }
}
}

