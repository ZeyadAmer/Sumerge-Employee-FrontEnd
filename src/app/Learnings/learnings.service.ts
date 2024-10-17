import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, mergeMap, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export interface Proof {
    id: number;
    proofType: string;
}

export interface LearningType {
    id: number;
    learningType: string;
    baseScore: number;
}

export interface Learning {
    id: number;
    proof: string;
    proofTypesDTO: { id: number; proofType: string };
    learningTypesDTO: {
        baseScore: number;
     id: number; learningType: string 
};
    approvalStatus: string;
    comment: string;
}

@Injectable({
    providedIn: 'root'
})
export class LearningsService {
    constructor(private http: HttpClient, private cookieService: CookieService) {}

    private getAuthHeaders(): HttpHeaders {
        const token = this.cookieService.get('authToken');
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }

    getProofTypes(): Observable<Proof[]> {
        return this.http.get<Proof[]>('http://localhost:8081/proofTypes/all', { headers: this.getAuthHeaders() });
    }

    getLearningTypes(): Observable<LearningType[]> {
        return this.http.get<LearningType[]>('http://localhost:8081/learningTypes', { headers: this.getAuthHeaders() });
    }

    getUserLearnings(page: number, pageSize: number): Observable<Learning[]> {
        return this.http.get<Learning[]>('http://localhost:8081/userLearning/all', {
            headers: this.getAuthHeaders(),
            params: { page: page.toString(), size: pageSize.toString() }
        });
    }
    getLearnings(): Observable<any[]> {
        return this.http.get<any[]>('http://localhost:8081/userLearning/all', { headers: this.getAuthHeaders() });
      }

    submitLearning(learning: any): Observable<any> {
        return this.http.post('http://localhost:8081/userLearning', learning, { headers: this.getAuthHeaders() });
    }
    getPendingLearnings(userId: number, page: number, size: number): Observable<Learning[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<Learning[]>(`http://localhost:8081/userLearning/pending`, {
            headers,
            params: {
                id: userId.toString(),
                page: page.toString(),
                size: size.toString()
            }
        });
    }

    approveLearning(learningId: number, userId: number, baseScore: number): Observable<any> {
        const headers = this.getAuthHeaders();
        
        return this.http.put<string>(`http://localhost:8081/userScores/add`, {}, {
            headers,
            params: {
                userId: userId.toString(),
                score: baseScore.toString()
            }
        }).pipe(
            mergeMap(() => {
                return this.http.put<string>(`http://localhost:8081/userLearning/approve`, learningId, { headers });
            })
        );
    }

    rejectLearning(learningId: number): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.put<string>(`http://localhost:8081/userLearning/reject`, learningId, { headers });
    }
}
