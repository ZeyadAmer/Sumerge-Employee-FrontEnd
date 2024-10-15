import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubmittedCareerPackage, UserCareerPackage, UserSubmittedCareerPackage } from './users.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  comment: string = '';
  comments: string[] = [];
  submissionMessages: Array<{ date: string; file: string; comments: string[]; status: string, id: number }> = [];
  uploadedFile!: File;
  isSubmitted: boolean = false;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.fetchSubmissionMessages(2); // Fetch submission messages for a specific employee
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }

  submitComment(): void {
    if (this.comment) {
      this.comments.push(this.comment);
      this.comment = ''; // Clear the input
    }
  }

  async submitCareerPackage(): Promise<void> {
    if (!this.uploadedFile) {
      console.log('No file uploaded.');
      return;
    }

    try {
      const currentDate = new Date().toLocaleString();
      this.comments = []; // Clear comments for the new submission

      const formData = new FormData();
      const employeeId = 2; // Assuming a static employeeId for demo
      formData.append('employeeId', employeeId.toString());
      formData.append('careerPackage', this.uploadedFile);
      formData.append('careerPackageName', this.uploadedFile.name);
      formData.append('date', currentDate);

      console.log('Form Data:', formData);
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log("token: "+ token);

      const response = await this.http.post<string>('http://localhost:8083/employeeCareerPackages', formData, {headers}).toPromise();
      console.log('Response:', response);

      this.isSubmitted = true;
      await this.fetchSubmissionMessages(employeeId);
    } catch (error) {
      console.error('Error during package submission:', error);
    }
  }

  async fetchSubmissionMessages(employeeId: number): Promise<void> {
    try {
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
      if (this.isSubmitted) {
        const careerPackagesResponse = await this.http.get<UserCareerPackage[]>(`http://localhost:8083/employeeCareerPackages/all/${employeeId}`, {headers}).toPromise();
        console.log('Employee Career Packages:', careerPackagesResponse);
        await this.submittedCareerPackage(careerPackagesResponse![careerPackagesResponse!.length - 1]);
      }

      const messagesResponse = await this.http.get<UserSubmittedCareerPackage[]>(`http://localhost:8083/submittedCareerPackage/employee/${employeeId}`, {headers}).toPromise();
      console.log('Fetched Submission Messages:', messagesResponse);

      if (this.isSubmitted) {
        const message = messagesResponse![messagesResponse!.length - 1];
        this.submissionMessages.push({
          date: 'Career package submitted on ' + message.employeeCareerPackage.date.toLocaleString(),
          file: message.employeeCareerPackage.careerPackageName,
          comments: [...this.comments],
          status: message.careerPackageStatus,
          id: message.id
        });
        this.isSubmitted = false;
      } else {
        for (const message of messagesResponse!) {
          this.submissionMessages.push({
            date: 'Career package submitted on ' + message.employeeCareerPackage.date.toLocaleString(),
            file: message.employeeCareerPackage.careerPackageName,
            comments: [...this.comments],
            status: message.careerPackageStatus,
            id: message.id
          });
        }
      }
      console.log(this.submissionMessages);
    } catch (error) {
      console.error('Error while fetching submission messages:', error);
    }
  }

  async submittedCareerPackage(message: UserCareerPackage): Promise<void> {
    try {
      const submitEmployeeCareerPackage: SubmittedCareerPackage = {
        employeeId: message.employeeId,
        careerPackageStatus: 'PENDING',
        managerId: 1, // Assuming a static managerId for demo
        employeeCareerPackage: {
          id: message.id,
        },
      };
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log("token: "+ token);
      const response = await this.http.post<string>('http://localhost:8083/submittedCareerPackage', submitEmployeeCareerPackage, {headers}).toPromise();
      console.log('Submitted Career Package Response:', response);
    } catch (error) {
      console.error('Error during submitted career package submission:', error);
    }
  }

  statusColor(status: string): string {
    if(status === "APPROVED"){
      return '#198754'
    }
    else if(status === "REJECTED"){
      return '#dc3545'
    }
    return "yellow";
  }

  downloadFile(careerPackageName: string, id: number){

  // Get the token from the cookie service
  const token = this.cookieService.get('authToken');
  
  // Define the headers
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  const downloadUrl = `http://localhost:8083/submittedCareerPackage/download/${id}?careerPackageName=${encodeURIComponent(careerPackageName)}`;
  fetch(downloadUrl, { 
    method: 'GET', 
    headers // Include headers in the fetch request
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to download file.");
      }
      return response.blob(); // Convert the response to a blob
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = careerPackageName; // Set the filename
      a.click();
      window.URL.revokeObjectURL(url); // Cleanup
    })
    .catch(error => console.error("Error:", error));
  }
}