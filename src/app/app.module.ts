import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
import { ScoreboardListComponent } from './scoreboard-list/scoreboard-list.component';
import { BlogsApprovalComponent } from './blogs-approval/blogs-approval.component';
import { BlogComponent } from './blog/blog.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    BlogsApprovalComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginComponent,
    FormsModule, // Add FormsModule here
    ScoreboardListComponent,
    CommonModule,
    BlogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
