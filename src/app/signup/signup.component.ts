import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface TitleDTO {
  name: string;
  department: { name: string };
  isManager: boolean;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
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


  constructor(private http: HttpClient) {}

  onSubmit() {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ6aGVzaGFtQHN1bWVyZ2UuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJleHAiOjE3Mjc4NzUzNjgsInVzZXJJZCI6MiwiaWF0IjoxNzI3Nzg4OTY4fQ.s98S37iMdP9ANDlofc3FHmFqS6cU7yRe_eVnn6DJ318';
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
