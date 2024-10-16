import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { SignUpComponent } from './signup/signup.component';
import { AuthGuard } from './app.authGuard'
import { AuthRole } from './app.authRole'
import { AuthManager } from './app.authManager';
import { BlogComponent } from './blogs/blog/blog.component';
import { BlogsApprovalComponent } from './blogs/blogs-approval/blogs-approval.component';
import { SubmitLearningComponent } from './Learnings/submit-learning/submit-learning.component';
import { ReviewLearningComponent } from './Learnings/review-learning/review-learning.component';
import { CareerPackageComponent } from './career-package/career-package.component';
import { LearningsComponent } from './Learnings/learnings/learnings.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'signup', component: SignUpComponent, canActivate: [AuthRole] }, 
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
      { path: 'admin-controls', component: AdminControlComponent, canActivate: [AuthRole] }, 
      { path: 'blogs', component: BlogComponent,canActivate: [AuthGuard] },
      { path: 'blogs-approval', component: BlogsApprovalComponent, canActivate: [AuthManager] },
      { path: 'submit-learning', component:SubmitLearningComponent, canActivate: [AuthGuard]},
      { path: 'learnings', component:LearningsComponent, canActivate:[AuthGuard]},
      { path: 'approve-learning', component:ReviewLearningComponent, canActivate: [AuthManager]},
      {path: 'career-package', component: CareerPackageComponent, canActivate: [AuthGuard]},
    ],
  }, 
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

