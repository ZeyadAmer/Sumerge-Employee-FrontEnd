import { Component, HostListener, OnInit } from '@angular/core';
import { LearningsService, Learning } from '../learnings.service';

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
    userId: number = 0;

    constructor(private learningsService: LearningsService) {}

    ngOnInit(): void {
        this.loadLearnings();
    }

    approveLearning(learning: Learning): void {
        const baseScore = learning.learningTypesDTO.baseScore;

        this.learningsService.approveLearning(learning.id, this.userId, baseScore).subscribe({
            next: () => {
                this.resetLearnings();
                this.loadLearnings();
            },
            error: (err) => console.error('Error approving learning:', err)
        });
    }

    rejectLearning(learningId: number): void {
        this.learningsService.rejectLearning(learningId).subscribe({
            next: () => {
                this.resetLearnings();
                this.loadLearnings(); // Reload learnings after rejection
            },
            error: (err) => console.error('Error rejecting learning:', err)
        });
    }

    loadLearnings(): void {
        if (this.isLoading || this.userId === 0) return;

        this.isLoading = true;
        this.learningsService.getPendingLearnings(this.userId, this.currentPage, this.pageSize).subscribe({
            next: (response) => {
                this.learnings = this.learnings.concat(response || []);
                this.currentPage++;
                console.log('Loaded learnings:', this.learnings);
            },
            error: (err) => console.error('Error fetching learnings:', err),
            complete: () => this.isLoading = false
        });
    }

    resetLearnings(): void {
        this.learnings = []; // Clear the old learnings
        this.currentPage = 0; // Reset the page count
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(): void {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            this.loadLearnings();
        }
    }
}
