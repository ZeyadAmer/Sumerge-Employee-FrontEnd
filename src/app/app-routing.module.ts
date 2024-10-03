import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AuthGuard } from './app.authGuard'
import { AuthRole } from './app.authRole'

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // No guard for login
  { path: 'signup', component: SignUpComponent, canActivate: [AuthRole] }, // No guard for signup
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Guard applied
  { path: 'admin-controls', component: AdminControlComponent, canActivate: [AuthRole] }, // Guard applied
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
