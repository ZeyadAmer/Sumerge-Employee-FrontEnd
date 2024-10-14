import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AuthGuard } from './app.authGuard'
import { AuthRole } from './app.authRole'
import { AuthManager } from './app.authManager';
import { BlogComponent } from './blog/blog.component';
import { BlogsApprovalComponent } from './blogs-approval/blogs-approval.component';
import { CareerPackageComponent } from './career-package/career-package.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // No guard for login
  { path: 'signup', component: SignUpComponent, canActivate: [AuthRole] }, // No guard for signup
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Guard applied
  { path: 'admin-controls', component: AdminControlComponent, canActivate: [AuthRole] }, // Guard applied
  { path: 'blogs', component: BlogComponent,canActivate: [AuthGuard] },
  { path: 'blogsApproval', component: BlogsApprovalComponent, canActivate: [AuthManager] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
  {path: 'career-package', component: CareerPackageComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
