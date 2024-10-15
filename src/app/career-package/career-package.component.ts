import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild(ManagersComponent) managerReloadComponent!: ManagersComponent;
  @ViewChild(UsersComponent) userReloadComponent!: UsersComponent;

  manager: boolean = false;

  ngOnInit(): void {
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

  reload(){
    console.log("parent commponent reloaded");
    console.log("testing the manager reload");
    this.managerReloadComponent.receivedCareerPackage();
    console.log("testing user component reload");
    this.userReloadComponent.ngOnInit();
  }

}
