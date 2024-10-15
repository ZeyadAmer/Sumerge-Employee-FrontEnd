import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export interface Learning {
    id: 0,
    proof: '',
    proofType: '',
    description: '',
    learningType: { id: 0, name: '' },
    ManagerId: 0
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
    learnings: Learning[] = [];
    learningTypes: LearningType[] = []; // Property to hold learning types
    learningSubjects: LearningSubject[] = []; // New property to hold learning subjects
    userId: number = 0;

    constructor(private http: HttpClient, private cookieService: CookieService) {}

    ngOnInit(): void {
        this.loadLearnings();
    }

    async loadLearnings() {
        this.learnings = await this.getLearnings();
    }




    async approveLearning(learningId: number): Promise<string> {
        const token = this.cookieService.get('authToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        try {
            const response = await this.http.put<string>(`http://localhost:8081/userLearning/approve`, learningId, { headers }).toPromise();
            console.log(response);
            window.location.reload(); // Reload to fetch updated list
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
            window.location.reload(); // Reload to fetch updated list
            return response || "";
        } catch (error) {
            console.error('Error rejecting learning:', error);
            return "";
        }
    }

    async getLearnings(): Promise<Learning[]> {
        const token = this.cookieService.get('authToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        try {
            const response = await this.http.get<Learning[]>(`http://localhost:8081/userLearning/pending`, { headers,params: { id: this.userId }}).toPromise();
            return response || [];
        } catch (error) {
            console.error('Error fetching learnings:', error);
            return [];
        }
    }
}
