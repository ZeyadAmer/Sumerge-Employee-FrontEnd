import { Component } from '@angular/core';
import { TitleDTO } from '../admin-controls.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  error: string = '';
  managerEmail: String = null!;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  title: TitleDTO = {
    name: '',
    department: { name: '' },
    isManager: false
  };


  constructor(private http: HttpClient,private cookieService: CookieService) {}

  onSubmit() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const signUpData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      title: this.title
    };
    if(this.firstName==="" ||this.lastName==="" || this.email==="" || this.title.name==="" || this.title.department.name ===""){
      this.error = "you must fill all fields";
    }else {
      const url = `http://localhost:8080/users/${this.managerEmail}`;
    this.http.post(url, signUpData, { headers }).subscribe(
      (response) => {
        console.log(response);
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.title.name = '';
        this.title.department.name="";
        this.managerEmail="";
        this.title.isManager = false;
        this.error = 'User Created';
      },
      error => {
        console.error('Error occurred:', error);
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.title.name = '';
        this.title.department.name="";
        this.managerEmail="";
        this.title.isManager = false;
        this.error = error.error;
      }
    );
  }
}
}
