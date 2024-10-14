import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ManagersComponent } from './managers/managers.component';
import { UsersComponent } from './users/users.component';
import { ManagerReceivedCareerPackage } from './managers/managers.model';

@Component({
  selector: 'app-career-package',
  standalone: true,
  imports: [UsersComponent, ManagersComponent, MatButtonModule, MatStepperModule],
  templateUrl: './career-package.component.html',
  styleUrl: './career-package.component.css'
})
export class CareerPackageComponent implements OnInit{
  ngOnInit(): void {
    this.receivedCareerPackage();
  }

  constructor(private http: HttpClient, private router: Router) {}

  // variables
  receivedCareerPackages: ManagerReceivedCareerPackage[] = [];
  managerId = 1; 

  // for manager
  // RECEIVE SUBMITTED CAREER PACKAGES
  async receivedCareerPackage(){
    try{
      // send request to the submitted career package with managerId
      const response = await this.http
          .get<ManagerReceivedCareerPackage[]>(`http://localhost:8080/submittedCareerPackage/manager/${this.managerId}`)
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
