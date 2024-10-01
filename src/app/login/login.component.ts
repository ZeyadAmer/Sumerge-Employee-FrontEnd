import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],  // Make sure FormsModule is imported here
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient,private snackBar: MatSnackBar) {}

  onSubmit() {
    const loginData = {
        email: this.email, // Assuming you have these properties bound to your form inputs
        password: this.password
    };

    this.http.post('http://localhost:8080/auth/login', loginData).subscribe(
      token => {
        console.log('token:', token)
        this.email = '';
        this.password = '';

        // You can store the token and navigate to another page
      },
        error => {
            this.showErrorToast(error.message || 'Login failed. Please try again.');
            this.email = '';
            this.password = '';

        }
    );
}
private showErrorToast(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 3000, // Duration in milliseconds
    verticalPosition: 'top', // You can change it to 'bottom'
    horizontalPosition: 'center' // You can change it to 'start' or 'end'
  });
}
}
