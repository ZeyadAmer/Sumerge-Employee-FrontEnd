import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ManagersComponent } from './managers/managers.component';
import { UsersComponent } from './users/users.component';
import { ManagerReceivedCareerPackage } from './managers/managers.model';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AuthManager } from '../app.authManager';

@Component({
  selector: 'app-career-package',
  standalone: true,
  imports: [UsersComponent, ManagersComponent, MatButtonModule, MatStepperModule, CommonModule],
  templateUrl: './career-package.component.html',
  styleUrl: './career-package.component.css'
})
export class CareerPackageComponent implements OnInit{

  manager: boolean = false;

  ngOnInit(): void {
    this.receivedCareerPackage();
    this.ifManager();
  }

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private authManager: AuthManager) {}

  // variables
  receivedCareerPackages: ManagerReceivedCareerPackage[] = [];
  managerId = 1; 

  ifManager(): boolean{
    this.authManager.canActivate().subscribe(
      (isManager) => {
        if (isManager) {
          console.log("User is an manager.");
          this.manager = true;
        } else {
          console.log("User is not an manager.");
          this.manager = false;
        }
      },
      (error) => {
        console.error("Error occurred while checking role:", error);
        this.manager = false;
      }
    );
    return this.manager;
  }

  // for manager
  // RECEIVE SUBMITTED CAREER PACKAGES
  async receivedCareerPackage(){
    try{
      const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
      // send request to the submitted career package with managerId
      const response = await this.http
          .get<ManagerReceivedCareerPackage[]>(`http://localhost:8083/submittedCareerPackage/manager/${this.managerId}`, {headers})
          .toPromise();
        console.log('Response from recieved:', response!);

        for(const res of response!){
          if(res.careerPackageStatus === "PENDING"){
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
    }
    catch(error){
      console.log("Error occured: "+ error);
    }
  }

}
