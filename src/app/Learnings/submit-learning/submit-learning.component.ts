import { Component, OnInit, HostListener } from '@angular/core';
import { LearningsService, Learning, LearningType, Proof } from '../learnings.service';

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
        learningTypesDTO: {
            id: 0, learningType: '',
            baseScore: 0
        },
        comment: ''
    };

    learningTypes: LearningType[] = [];
    proofTypes: Proof[] = [];
    learnings: Learning[] = [];
    currentPage: number = 0;
    pageSize: number = 100;
    isLoading: boolean = false;
    allLoaded: boolean = false;

    constructor(private learningsService: LearningsService) {}

    ngOnInit(): void {
        this.loadLearningTypes();
        this.loadProofTypes();
        this.loadLearnings();
    }

    loadProofTypes(): void {
        this.learningsService.getProofTypes().subscribe({
            next: (response) => {
                this.proofTypes = response || [];
                console.log('Proof Types:', this.proofTypes);
            },
            error: (error) => {
                console.error('Error fetching proof types:', error);
            }
        });
    }

    loadLearningTypes(): void {
        this.learningsService.getLearningTypes().subscribe({
            next: (response) => {
                this.learningTypes = response || [];
                console.log('Learning Types:', this.learningTypes);
            },
            error: (error) => {
                console.error('Error fetching learning types:', error);
            }
        });
    }

    loadLearnings(): void {
        if (this.isLoading || this.allLoaded) return;

        this.isLoading = true;
        this.learningsService.getUserLearnings(this.currentPage, this.pageSize).subscribe({
            next: (response) => {
                if (response && response.length < this.pageSize) {
                    this.allLoaded = true;
                }

                this.learnings = this.learnings.concat(response || []);
                this.currentPage++;
                console.log('Loaded learnings:', this.learnings);
            },
            error: (error) => {
                console.error('Error fetching learnings:', error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    submitLearning(): void {
        const userLearningDTO = {
            id: 0,
            proof: this.learning.proof,
            proofTypesDTO: { id: this.learning.proofTypesDTO.id },
            learningTypesDTO: { id: this.learning.learningTypesDTO.id }
        };

        this.learningsService.submitLearning(userLearningDTO).subscribe({
            next: () => {
                this.resetForm();
                this.loadLearnings();
            },
            error: (error) => {
                console.error('Error submitting learning:', error);
                alert('Failed to submit learning.');
            }
        });
    }

    resetForm(): void {
        this.learning = {
            id: 0,
            proof: '',
            proofTypesDTO: { id: 0, proofType: '' },
            approvalStatus: '',
            learningTypesDTO: {
                id: 0, learningType: '',
                baseScore: 0
            },
            comment: ''
        };
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(): void {
        if (this.isLoading || this.allLoaded) return;

        const threshold = 200;
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold)) {
            this.loadLearnings();
        }
    }
}
