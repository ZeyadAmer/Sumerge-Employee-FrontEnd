import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],  // Make sure CommonModule is included here
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  

  constructor(private http: HttpClient) {}

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

    
    this.http.post('http://localhost:8080/auth/login', loginData).subscribe(
      (response) => {
        console.log('Login successful!', response);
        this.email = '';
        this.password = '';
        this.error = 'Login successful!';
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
