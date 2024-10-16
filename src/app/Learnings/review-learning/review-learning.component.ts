import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Learning {
    id: number;
    proof: string;
    proofTypesDTO: { id: number; proofType: string }; 
    learningTypesDTO: { id: number; learningType: string; baseScore: number };
    comment: string;
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
    currentPage: number = 0;
    pageSize: number = 5;
    isLoading: boolean = false;
    learnings: Learning[] = [];
    learningTypes: LearningType[] = [];
    learningSubjects: LearningSubject[] = [];
    userId: number = 0;

    constructor(private http: HttpClient, private cookieService: CookieService) {}

    ngOnInit(): void {
        this.loadLearnings();
    }

    approveLearning(learning: Learning): void {
        const token = this.cookieService.get('authToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        const learningId = learning.id;
        const baseScore = learning.learningTypesDTO.baseScore;

        this.http.put<string>(`http://localhost:8081/userScores/add`, {}, {
            headers,
            params: {
                userId: this.userId,
                score: baseScore,
            }
        }).subscribe({
            next: () => {
                this.http.put<string>(`http://localhost:8081/userLearning/approve`, learningId, { headers })
                    .subscribe({
                        next: (response) => {
                            console.log(response);
                            this.loadLearnings();
                        },
                        error: (err) => console.error('Error approving learning:', err)
                    });
            },
            error: (err) => console.error('Error updating score:', err)
        });
    }

    rejectLearning(learningId: number): void {
        const token = this.cookieService.get('authToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.put<string>(`http://localhost:8081/userLearning/reject`, learningId, { headers })
            .subscribe({
                next: (response) => {
                    console.log(response);
                    this.loadLearnings();
                },
                error: (err) => console.error('Error rejecting learning:', err)
            });
    }

    loadLearnings(): void {
        if (this.isLoading || this.userId === 0) return;

        this.isLoading = true;
        this.learnings = [];
        this.currentPage = 0;
        const token = this.cookieService.get('authToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.get<Learning[]>(`http://localhost:8081/userLearning/pending`, {
            headers,
            params: {
                id: this.userId.toString(),
                page: this.currentPage.toString(),
                size: this.pageSize.toString()
            }
        }).subscribe({
            next: (response) => {
                this.learnings = this.learnings.concat(response || []);
                this.currentPage++;
                console.log("Loaded learnings:", this.learnings);
            },
            error: (err) => console.error('Error fetching learnings:', err),
            complete: () => this.isLoading = false
        });
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(): void {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            this.loadLearnings();
        }
    }
}
