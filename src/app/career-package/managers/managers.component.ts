import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmittedCareerPackageComponent } from "./submitted-career-package/submitted-career-package.component";
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ManagerReceivedCareerPackage, UserCareerPackageDetails } from './managers.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [
    SubmittedCareerPackageComponent, 
    CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule
  ],
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css'] // Fixed 'styleUrl' to 'styleUrls'
})
export class ManagersComponent implements OnInit {
  userName!: string; // Replace with actual data as needed
  titleName!: string; // Replace with actual data as needed
  uploadedFileName!: string; 
  selectedStatus: boolean = false;
  comment: string = '';
  comments: string[] = [];
  isVisible: boolean = true;
  submissionMessages: Array<{ 
    date: string; 
    file: string; 
    comments: string[]; 
    userName: string; 
    titleName: string; 
    status: string 
  }> = [];
  
  @Output() reloadCareerPackageParent = new EventEmitter<void>();
  
  receivedCareerPackages!: ManagerReceivedCareerPackage[];

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.receivedCareerPackage();
  }

  onUpdateCareerPackage(): void {
    console.log('Career package updated in child component.');
    this.reloadCareerPackageParent.emit();
  }

  updateStatus(): void {
    this.selectedStatus = !this.selectedStatus; // Toggle the status
  }

  async receivedCareerPackage(): Promise<void> {
    try {
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const user = await this.http.get<string>('http://localhost:8080/users', { headers }).toPromise();
      console.log('Response of user:', user);

      const userId: any = await this.http.get<string>('http://localhost:8080/users/id', { headers }).toPromise();
      console.log('Response of userId:', userId);

      // Get submitted career packages for the manager
      const response = await this.http
        .get<ManagerReceivedCareerPackage[]>(`http://localhost:8083/submittedCareerPackage/manager/${userId}`, { headers })
        .toPromise();
      console.log('Response from received:', response!);

      // Clear existing packages before pushing new ones
      this.receivedCareerPackages = [];

      // Process received career packages
      for (const res of response!) {
        if (res.careerPackageStatus === "PENDING") {
          // Get user details for the employee
          const userCP = await this.http.get<UserCareerPackageDetails>(`http://localhost:8080/users/${res.employeeId}`, { headers }).toPromise();
          console.log('Response of userCP:', userCP);

          this.receivedCareerPackages.push({
            id: res.id,
            employeeId: res.employeeId,
            employeeCareerPackage: {
              id: res.employeeCareerPackage.id,
              careerPackageName: res.employeeCareerPackage.careerPackageName,
              date: res.employeeCareerPackage.date
            },
            managerId: userId,
            careerPackageStatus: res.careerPackageStatus,
            selectedStatus: false,
            userName: `${userCP!.firstName} ${userCP!.lastName}`,
            titleName: userCP!.title.name
          });
        }
      }
    } catch (error) {
      console.log("Error occurred: ", error);
    }
  }
}
