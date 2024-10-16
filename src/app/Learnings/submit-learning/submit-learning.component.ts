import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export interface Learning {
  id: number;
  proof: string;
  proofTypesDTO: { id: number; proofType: string };
  learningTypesDTO: { id: number; learningType: string };
  approvalStatus: string;
  comment: string;
}

export interface Proof {
  id: number;
  proofType: string;
}

export interface LearningType {
  id: number;
  learningType: string;
  baseScore: number;
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
    proofTypesDTO: { id: 0, proofType: '' },
    approvalStatus: '',
    learningTypesDTO: { id: 0, learningType: '' },
    comment: ''
  };

  learningTypes: LearningType[] = []; // Dropdown options for learning types
  proofTypes: Proof[] = []; // Dropdown options for proof types
  learnings: Learning[] = []; // List of learnings
  currentPage: number = 0; // Current page for pagination
  pageSize: number = 100; // Number of learnings per page
  isLoading: boolean = false; // To prevent multiple simultaneous requests
  allLoaded: boolean = false; // Track if all data has been loaded

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.loadLearningTypes();
    this.loadProofTypes();
    this.loadLearnings();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('authToken');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Load proof types from the backend
  async loadProofTypes(): Promise<void> {
    try {
      const response = await this.http
        .get<Proof[]>('http://localhost:8081/proofTypes/all', { headers: this.getAuthHeaders() })
        .toPromise();
      this.proofTypes = response || [];
      console.log('Proof Types:', this.proofTypes);
    } catch (error) {
      console.error('Error fetching proof types:', error);
    }
  }

  // Load learning types from the backend
  async loadLearningTypes(): Promise<void> {
    try {
      const response = await this.http
        .get<LearningType[]>('http://localhost:8081/learningTypes', { headers: this.getAuthHeaders() })
        .toPromise();
      this.learningTypes = response || [];
      console.log('Learning Types:', this.learningTypes);
    } catch (error) {
      console.error('Error fetching learning types:', error);
    }
  }

  // Load learnings from the backend with pagination
  async loadLearnings(): Promise<void> {
    if (this.isLoading || this.allLoaded) return; // Prevent duplicate requests

    this.isLoading = true;

    try {
      const response = await this.http
        .get<Learning[]>('http://localhost:8081/userLearning/all', {
          headers: this.getAuthHeaders(),
          params: { page: this.currentPage.toString(), size: this.pageSize.toString() }
        })
        .toPromise();

      if (response && response.length < this.pageSize) {
        this.allLoaded = true; // If fewer items are returned than requested, mark as loaded
      }

      this.learnings = this.learnings.concat(response || []); // Append new learnings
      this.currentPage++; // Increment page for next load
      console.log('Loaded learnings:', this.learnings);
    } catch (error) {
      console.error('Error fetching learnings:', error);
    } finally {
      this.isLoading = false; // Reset loading state
    }
  }

  // Submit a new learning
  async submitLearning(): Promise<void> {
    const userLearningDTO = {
      id: 0, // Assuming the id is auto-generated or set from the token backend
      proof: this.learning.proof,
      proofTypesDTO: { id: this.learning.proofTypesDTO.id }, // Send only the proofType id
      learningTypesDTO: { id: this.learning.learningTypesDTO.id } // Send only the learningType id
    };

    try {
      await this.http
        .post('http://localhost:8081/userLearning', userLearningDTO, { headers: this.getAuthHeaders() })
        .toPromise();
      this.resetForm(); // Reset form after submission
      this.loadLearnings(); // Reload learnings after submission
    } catch (error) {
      console.error('Error submitting learning:', error);
      alert('Failed to submit learning.');
    }
  }

  // Reset form after submission
  resetForm(): void {
    this.learning = {
      id: 0,
      proof: '',
      proofTypesDTO: { id: 0, proofType: '' },
      approvalStatus: '',
      learningTypesDTO: { id: 0, learningType: '' },
      comment: ''
    };
  }

  // Infinite scroll to load more learnings when the user scrolls to the bottom of the page
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.isLoading || this.allLoaded) return;

    const threshold = 200; // Adjust the threshold to trigger loading before reaching the bottom
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold)) {
      this.loadLearnings(); // Load more learnings when nearing the bottom
    }
  }
}
