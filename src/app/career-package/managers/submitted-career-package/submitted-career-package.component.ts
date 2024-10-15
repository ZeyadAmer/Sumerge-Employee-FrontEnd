import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-submitted-career-package',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './submitted-career-package.component.html',
  styleUrl: './submitted-career-package.component.css'
})
export class SubmittedCareerPackageComponent {
  @Input({ required: true }) userName!: string;
  @Input({ required: true }) titleName!: string;
  @Input({ required: true }) uploadedFileName!: string;
  @Input({ required: true }) selectedStatus!: boolean;
  @Input({ required: true }) id!: number;
  managerId = 1;

  ngOnInit(): void {
    console.log("submitted id: " + this.id);
  }

  comment: string = '';
  comments: string[] = [];
  submissionMessages: Array<{ date: string, file: string, comments: string[], userName: string, titleName: string, status: string }> = [];

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  @Output() changeDetected = new EventEmitter<void>();

  notifyParent() {
    // Emit the event to notify the parent
    this.changeDetected.emit();
  }

  updateStatus() {
    // Update the selected status based on the switch state
    this.selectedStatus = !this.selectedStatus; // Toggle the status
  }

  async updateCareerPackage() {
    try {
      // Determine the status to send
      const careerPackageStatus: string = this.selectedStatus ? 'APPROVED' : 'REJECTED';
      
      // Construct the request URL with query parameters
      const url = `http://localhost:8080/submittedCareerPackage/${this.id}?careerPackageStatus=${careerPackageStatus}`;
      
      // Send the PUT request
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      const response = await this.http.put<string>(url, null, {
        headers// optional, depending on the API's expectations
      }).toPromise();
      
      console.log('Response from received:', response!);

      // Emit the changeDetected event after successful update
      this.notifyParent(); // Notify the parent component

    } catch (error) {
      console.log("Error occurred: " + error);
    }
  }

  downloadFile(careerPackageName: string, id: number, titleName: string, userName: string) {
    const downloadUrl = `http://localhost:8080/submittedCareerPackage/download/${id}?careerPackageName=${encodeURIComponent(careerPackageName)}`;
    
    // Get the token from the cookie service
    const token = this.cookieService.get('authToken');
    
    // Define the headers
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
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
        a.download = `${titleName}_${userName}_${careerPackageName}`; // Set the filename
        a.click();
        window.URL.revokeObjectURL(url); // Cleanup
      })
      .catch(error => console.error("Error:", error));
  }
  

}

