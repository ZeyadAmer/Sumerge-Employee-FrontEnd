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
import { BlogsApprovalComponent } from './blogs/blogs-approval/blogs-approval.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { SubmitLearningComponent } from './Learnings/submit-learning/submit-learning.component';
import { ReviewLearningComponent } from './Learnings/review-learning/review-learning.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LearningsComponent } from './Learnings/learnings/learnings.component';
import { HeaderComponent } from "./header/header.component";
import { LayoutComponent } from './layout/layout.component';
@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    BlogsApprovalComponent,
    SubmitLearningComponent,
    ReviewLearningComponent,
    LearningsComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginComponent,
    FormsModule, // Add FormsModule here
    ScoreboardListComponent,
    CommonModule,
    BlogComponent,
    HeaderComponent
],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
