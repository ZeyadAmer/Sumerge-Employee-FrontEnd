import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthRole } from '../app.authRole';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  admin: boolean = false;
  constructor(private router: Router, private authService: AuthService,private authRole: AuthRole){}

  ngOnInit(){
    this.admin = this.ifAdmin();
  }
  ifAdmin(): boolean{
    let flag = false;
    this.authRole.canActivate().subscribe(
      (isAdmin) => {
        if (isAdmin) {
          console.log("User is an admin.");
          flag = true;
        } else {
          console.log("User is not an admin.");
          flag = false;
        }
      },
      (error) => {
        console.error("Error occurred while checking role:", error);
        flag = false;
      }
    );
    return flag;
  }

  goToAdmin() {
    this.router.navigate(['/admin-controls']);
  }

  goToHome(){
    this.router.navigate(['/home']);
  }

  onClickLogout(){
    this.authService.logout();
  }
}
