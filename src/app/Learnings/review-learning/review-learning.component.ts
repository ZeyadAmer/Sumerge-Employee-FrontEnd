import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export interface Learning {
    id: number;
    proof: string;
    proofTypesDTO: { id: number; proofType: string }; 
    learningTypesDTO: { id: number; learningType: string; baseScore:number };
    comment: string
  }

export interface LearningType {
    id: number;
    name: string;
}

export interface LearningSubject {
    id: number;
    subject: string;
}

@Component({
    selector: 'app-review-learning',
    templateUrl: './review-learning.component.html',
    styleUrls: ['./review-learning.component.css']
})
export class ReviewLearningComponent implements OnInit {
    currentPage: number = 0; // Current page for pagination
    pageSize: number = 5; // Number of learnings per page
    isLoading: boolean = false; // To prevent duplicate requests
    learnings: Learning[] = [];
    learningTypes: LearningType[] = []; // Property to hold learning types
    learningSubjects: LearningSubject[] = []; // New property to hold learning subjects
    userId: number = 0;

    constructor(private http: HttpClient, private cookieService: CookieService) {}

    ngOnInit(): void {
        this.loadLearnings();
    }


    async approveLearning(learning: Learning): Promise<string> {
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
      });
      try {
          const learningId = learning.id;
          const baseScore = learning.learningTypesDTO.baseScore;
          await this.http.put<string>(`http://localhost:8081/userScores/add`,{}, { 
            headers,
            params: {
              userId: this.userId, 
              score: baseScore,
          }
            }).toPromise();
          const response = await this.http.put<string>(`http://localhost:8081/userLearning/approve`,learningId,{ headers }).toPromise();
          console.log(response);
          this.loadLearnings();
          return response || "";
      } catch (error) {
          console.error('Error approving learning:', error);
          return "";
      }
  }

    async rejectLearning(learningId: number): Promise<string> {
        const token = this.cookieService.get('authToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        try {
            const response = await this.http.put<string>(`http://localhost:8081/userLearning/reject`, learningId, { headers }).toPromise();
            console.log(response);
            this.loadLearnings();
            return response || "";
        } catch (error) {
            console.error('Error rejecting learning:', error);
            return "";
        }
    }

    async loadLearnings(): Promise<void> {

      if (this.isLoading || this.userId === 0) return; // Prevent multiple calls
        this.isLoading = true;
        this.learnings = [];
        this.currentPage = 0;
        const token = this.cookieService.get('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        try {
          const response = await this.http.get<Learning[]>(`http://localhost:8081/userLearning`, {
            headers,
            params: {
                id: this.userId.toString(), // Add userId to the request params
                page: this.currentPage.toString(),
                size: this.pageSize.toString()
            }
        }).toPromise();
    
          this.learnings = this.learnings.concat(response || []); // Append new learnings
          this.currentPage++; // Increment page for next load
          console.log("Loaded learnings:", this.learnings);
        } catch (error) {
          console.error('Error fetching learnings:', error);
        } finally {
          this.isLoading = false; // Reset loading state
        }
      }
    
      @HostListener('window:scroll', ['$event'])
      onScroll(event: any): void {
        // Check if the user has scrolled to the bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          this.loadLearnings(); // Load more learnings when at the bottom
        }
      }
}
