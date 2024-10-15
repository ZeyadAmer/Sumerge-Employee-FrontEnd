import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export interface Learning {
  id: number;
  proof: string;
  proofType: string;
  description: string;
  learningType: { id: number; name: string };
  ManagerId: number;
}

@Component({
  selector: 'app-submit-learning',
  templateUrl: './submit-learning.component.html',
  styleUrls: ['./submit-learning.component.css']
})
export class SubmitLearningComponent implements OnInit {
  learning: Learning = {
    id: 0,
    proof: '',
    proofType: '',
    description: '',
    learningType: { id: 0, name: '' },
    ManagerId: 0
  };

  learningTypes: { id: number; name: string }[] = []; // Dropdown options for learning types
  proofTypes: string[] = []; // Replace with actual proof types
  learnings: Learning[] = []; // List of learnings
  currentPage: number = 1; // Current page for pagination
  pageSize: number = 5; // Number of learnings per page

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.loadLearningTypes(); // Load learning types on initialization
    this.loadLearnings(); // Load initial learnings
  }

  async loadLearningTypes(): Promise<void> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      const response = await this.http.get<{ id: number; name: string }[]>('http://localhost:8081/learning-types', { headers }).toPromise();
      this.learningTypes = response || [];
    } catch (error) {
      console.error('Error fetching learning types:', error);
    }
  }

  async loadLearnings(): Promise<void> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      const response = await this.http.get<Learning[]>(`http://localhost:8081/userLearning/all?page=${this.currentPage}&size=${this.pageSize}`, { headers }).toPromise();
      this.learnings = response || [];
    } catch (error) {
      console.error('Error fetching learnings:', error);
    }
  }

  async submitLearning(): Promise<void> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      await this.http.post('http://localhost:8081/userLearning', this.learning, { headers }).toPromise();
      alert('Learning submitted successfully!');
      this.resetForm(); // Reset the form after submission
      this.loadLearnings(); // Reload learnings
    } catch (error) {
      console.error('Error submitting learning:', error);
      alert('Failed to submit learning.');
    }
  }

  resetForm(): void {
    this.learning = {
      id: 0,
      proof: '',
      proofType: '',
      description: '',
      learningType: { id: 0, name: '' },
      ManagerId: 0
    };
  }

  loadMoreLearnings(): void {
    this.currentPage++;
    this.loadLearnings();
  }
}
