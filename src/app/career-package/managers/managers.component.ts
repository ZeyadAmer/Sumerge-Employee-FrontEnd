import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmittedCareerPackageComponent } from "./submitted-career-package/submitted-career-package.component";
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ManagerReceivedCareerPackage } from './managers.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [SubmittedCareerPackageComponent, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.css'
})
export class ManagersComponent {
    userName: string = "Manar Khedr"; // Replace with actual data as needed
    titleName: string = "Associate Software Engineer"; // Replace with actual data as needed
    uploadedFileName!: string; 
    selectedStatus: boolean = false;
    comment: string = '';
    comments: string[] = [];
    submissionMessages: Array<{ date: string, file: string, comments: string[], userName: string, titleName: string, status: string }> = [];
  
    // vars
    managerId = 1;
    @Input({ required: true }) receivedCareerPackages!: ManagerReceivedCareerPackage[];
  
    constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}
  
    onUpdateCareerPackage() {
      console.log('Career package updated in child component.');
      this.receivedCareerPackage(); 
    }
  
    // submitComment() {
    //   if (this.comment) {
    //     this.comments.push(this.comment);
    //     this.comment = '';
    //   }
    // }
  
    updateStatus() {
      this.selectedStatus = !this.selectedStatus; // Toggle the status
    }
  
  
    // submitCareerPackage() {
    //   const currentDate = new Date().toLocaleString();
    //   this.submissionMessages.push({
    //     date: `Career package submitted on ${currentDate}`,
    //     file: this.uploadedFileName,
    //     comments: [...this.comments],
    //     userName: this.userName,
    //     titleName: this.titleName,
    //     status: this.selectedStatus ? 'Approved' : 'Rejected' // Use the state of the switch
    //   });
    //   this.comments = []; // Clear comments after submission
    //   this.uploadedFileName = ''; // Clear file name after submission if necessary
    // }
  
    async receivedCareerPackage() {
      try {
        const token = this.cookieService.get('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        // Send request to the submitted career package with managerId
        const response = await this.http
          .get<ManagerReceivedCareerPackage[]>(`http://localhost:8083/submittedCareerPackage/manager/${this.managerId}`, {headers})
          .toPromise();
        console.log('Response from received:', response!);
  
        // Clear existing packages before pushing new ones
        this.receivedCareerPackages = []; // Clear the array if needed
  
        for (const res of response!) {
          if (res.careerPackageStatus === "PENDING") {
            this.receivedCareerPackages.push({
              id: res.id,
              employeeId: res.employeeId,
              employeeCareerPackage: {
                id: res.employeeCareerPackage.id,
                careerPackageName: res.employeeCareerPackage.careerPackageName,
                date: res.employeeCareerPackage.date
              },
              managerId: res.managerId,
              careerPackageStatus: res.careerPackageStatus,
              selectedStatus: false
            });
          }
        }
      } catch (error) {
        console.log("Error occurred: " + error);
      }
    }
  }
