import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CareerPackageTemplateDTO, SubmittedCareerPackage, TitleUser, UserCareerPackage } from './users.model';
import { CookieService } from 'ngx-cookie-service';
import { CommentDTO } from '../managers/managers.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  comment: string = '';
  comments: string[] = [];
  submissionMessages: Array<{ date: string; file: string; comments: string[]; status: string; id: number }> = [];
  uploadedFile!: File;
  isSubmitted: boolean = false;
  employeeId!: number;
  careerPackageTemplateTitle!: string;

  @Output() reloadCareerPackageParent = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  async ngOnInit(): Promise<void> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    try {
      const user = await this.http.get<TitleUser>('http://localhost:8080/users', { headers }).toPromise();
      const userId: any = await this.http.get<string>('http://localhost:8080/users/id', { headers }).toPromise();
      const careerPackageTemplate = await this.http.get<CareerPackageTemplateDTO>(`http://localhost:8083/careerPackageTemplates/${user!.title.name}`, { headers }).toPromise();
      this.careerPackageTemplateTitle = careerPackageTemplate!.title;
      this.fetchSubmissionMessages(userId);
    } catch (error) {
      console.error('Error fetching user or userId:', error);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }


  async submitCareerPackage(): Promise<void> {
    if (!this.uploadedFile) {
      console.log('No file uploaded.');
      return;
    }

    try {
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      const user = await this.http.get<string>('http://localhost:8080/users', { headers }).toPromise();
      const userId: any = await this.http.get<string>('http://localhost:8080/users/id', { headers }).toPromise();

      const currentDate = new Date().toLocaleString();
      this.comments = []; // Clear comments for the new submission

      const formData = new FormData();
      this.employeeId = userId!;
      formData.append('employeeId', this.employeeId.toString());
      formData.append('careerPackage', this.uploadedFile);
      formData.append('careerPackageName', this.uploadedFile.name);
      formData.append('date', currentDate);
      formData.append("careerPackageTemplate", this.careerPackageTemplateTitle);

      const response = await this.http.post<string>('http://localhost:8083/employeeCareerPackages', formData, { headers }).toPromise();
      console.log('Response:', response);

      this.isSubmitted = true;
      await this.fetchSubmissionMessages(this.employeeId);
      this.reloadCareerPackageParent.emit();
    } catch (error) {
      console.error('Error during package submission:', error);
    }
  }

  async fetchSubmissionMessages(employeeId: number): Promise<void> {
    try {
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      if (this.isSubmitted) {
        const careerPackagesResponse = await this.http.get<UserCareerPackage[]>(`http://localhost:8083/employeeCareerPackages/all/${employeeId}`, { headers }).toPromise();
        await this.submittedCareerPackage(careerPackagesResponse![careerPackagesResponse!.length - 1]);
      }

      const messagesResponse = await this.http.get<any[]>(`http://localhost:8083/submittedCareerPackage/employee/${employeeId}`, { headers }).toPromise();

      if (this.isSubmitted) {
        const message = messagesResponse![messagesResponse!.length - 1];
        this.submissionMessages.push({
          date: 'Career package submitted on ' + message.employeeCareerPackage.date.toLocaleString(),
          file: message.employeeCareerPackage.careerPackageName,
          comments: [],
          status: message.careerPackageStatus,
          id: message.id,
        });
        this.isSubmitted = false;
      } else {
        this.submissionMessages.length = 0;
        for (const message of messagesResponse!) {

          // fetch comments
          const commentResponse = await this.http.get<CommentDTO[]>(`http://localhost:8083/comments/all/${message.id}`, { headers }).toPromise();
          if (commentResponse) {
            this.comments = commentResponse.map(comment => comment.commentText); // Extract commentText
          } else {
            this.comments = []; // Handle the case when the response is undefined
          }
          // dsplay the submiited career packages
          this.submissionMessages.push({
            date: 'Career package submitted on ' + message.employeeCareerPackage.date.toLocaleString(),
            file: message.employeeCareerPackage.careerPackageName,
            comments: [...this.comments],
            status: message.careerPackageStatus,
            id: message.id,
          });
        }
      }
      console.log('Submission:', this.submissionMessages);
    } catch (error) {
      console.error('Error while fetching submission messages:', error);
    }
  }

  async submittedCareerPackage(message: UserCareerPackage): Promise<void> {
    try {
      const submitEmployeeCareerPackage: SubmittedCareerPackage = {
        employeeId: message.employeeId,
        careerPackageStatus: 'PENDING',
        managerId: 1, // Assuming a static managerId for demo
        employeeCareerPackage: {
          id: message.id,
        },
      };
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      const response = await this.http.post<string>('http://localhost:8083/submittedCareerPackage', submitEmployeeCareerPackage, { headers }).toPromise();
      console.log('Submitted Career Package Response:', response);
    } catch (error) {
      console.error('Error during submitted career package submission:', error);
    }
  }

  statusColor(status: string): string {
    if (status === 'APPROVED') {
      return '#28a745';
    } else if (status === 'REJECTED') {
      return '#df362d';
    }
    return '#fad02c';
  }

  downloadFile(careerPackageName: string, id: number): void {
    const token = this.cookieService.get('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    const downloadUrl = `http://localhost:8083/submittedCareerPackage/download/${id}?careerPackageName=${encodeURIComponent(careerPackageName)}`;

    fetch(downloadUrl, { method: 'GET', headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download file.');
        }
        return response.blob(); // Convert the response to a blob
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = careerPackageName; // Set the filename
        a.click();
        window.URL.revokeObjectURL(url); // Cleanup
      })
      .catch((error) => console.error('Error:', error));
  }
}
