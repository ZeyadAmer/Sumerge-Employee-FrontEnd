import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route to LoginComponent
  { path: '**', redirectTo: '' } // Catch-all route redirecting to LoginComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Correctly close the imports array
  exports: [RouterModule]
})
export class AppRoutingModule { }
