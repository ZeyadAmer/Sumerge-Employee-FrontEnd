import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-submitted-career-package',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './submitted-career-package.component.html',
  styleUrls: ['./submitted-career-package.component.css']
})
export class SubmittedCareerPackageComponent {
  @Input({ required: true }) userName!: string;
  @Input({ required: true }) titleName!: string;
  @Input({ required: true }) uploadedFileName!: string;
  @Input({ required: true }) selectedStatus!: boolean;
  @Input({ required: true }) id!: number;

  @Output() changeDetected = new EventEmitter<void>();

  comment: string = '';
  comments: string[] = [];
  submissionMessages: Array<{ date: string; file: string; comments: string[]; userName: string; titleName: string; status: string }> = [];
  
  private readonly apiBaseUrl = 'http://localhost:8083/submittedCareerPackage';
  private managerId = 1; // Not used, consider removing if unnecessary

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    console.log("Submitted ID: " + this.id);
  }

  notifyParent(): void {
    this.changeDetected.emit();
  }

  updateStatus(): void {
    this.selectedStatus = !this.selectedStatus; // Toggle the status
  }

  async updateCareerPackage(): Promise<void> {
    const careerPackageStatus: string = this.selectedStatus ? 'APPROVED' : 'REJECTED';
    const url = `${this.apiBaseUrl}/${this.id}?careerPackageStatus=${careerPackageStatus}`;
    
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await this.http.put<string>(url, null, { headers }).toPromise();
      console.log('Response from received:', response);
      this.notifyParent(); // Notify the parent component
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  downloadFile(careerPackageName: string, id: number, titleName: string, userName: string): void {
    const downloadUrl = `${this.apiBaseUrl}/download/${id}?careerPackageName=${encodeURIComponent(careerPackageName)}`;
    const token = this.cookieService.get('authToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    fetch(downloadUrl, { method: 'GET', headers })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to download file.");
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${titleName}_${userName}_${careerPackageName}`;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error("Error:", error));
  }
}
