import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CareerPackageTemplateDTO, SubmittedCareerPackage, TitleUser, UserCareerPackage } from './users.model';
import { CookieService } from 'ngx-cookie-service';
import { CommentDTO } from '../managers/managers.model';
import { Observable, lastValueFrom, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { R } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  comment: string = '';
  comments: string[] = [];
  submissionMessages: Array<{ date: string; file: string; comments: string[]; status: string; id: number }> = [];
  uploadedFile!: File;
  isSubmitted: boolean = false;
  employeeId!: number;
  employeeTitle!: string;
  careerPackageTemplateFile!: File;
  careerPackageTemplateId!: number;
  careerPackageTemplateTitle!: string;
  careerPackageTemplate!: CareerPackageTemplateDTO;


  @Output() reloadCareerPackageParent = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const headers = this.getAuthHeaders();
  
    // Fetch users
    this.http.get<TitleUser>('http://localhost:8080/users', { headers }).pipe(
      tap(response => {
        console.log('Users Response onInit:', response.title.name);
        this.employeeTitle = response.title.name;
        console.log("Title in onInit:", this.employeeTitle);
      }),
      switchMap(() =>
        // Fetch User ID
        this.http.get<number>('http://localhost:8080/users/id', { headers }).pipe(
          tap(userId => {
            console.log('User ID Response:', userId);
            this.fetchSubmissionMessages(userId);
          }),
          switchMap(() => {
            // Encode the employeeTitle to handle spaces or special characters
            const encodedTitle = encodeURIComponent(this.employeeTitle);
  
            // Fetch Career Package Template using the encoded title
            return this.http.get<CareerPackageTemplateDTO>(
              `http://localhost:8083/careerPackageTemplates/${encodedTitle}`, 
              { headers }
            ).pipe(
              tap(response => {
                console.log("Career Package Template:", response);
                this.careerPackageTemplateFile = response.careerPackageTemplate;
                this.careerPackageTemplateId = response.id;
                this.careerPackageTemplateTitle= response.title;
                this.careerPackageTemplate = response;
              })
            );
          })
        )
      ),
      catchError(error => {
        console.error('Error during requests:', error);
        return throwError(() => error); // Ensure error is propagated
      })
    ).subscribe();
  }
  

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }

  submitCareerPackage(): void {
    if (!this.uploadedFile) {
      console.log('No file uploaded.');
      return;
    }

    const headers = this.getAuthHeaders();
    const currentDate = new Date().toLocaleString();
    this.comments = [];

    this.http.get<string>('http://localhost:8080/users', { headers }).pipe(
      tap(response => console.log('Users Response in Submit:', response)),
      switchMap(() => this.http.get<number>('http://localhost:8080/users/id', { headers })),
      tap(userId => {
        console.log('User ID Response in Submit:', userId);
        this.employeeId = userId;
      }),
      switchMap((userId) => {
        const formData = new FormData();
        formData.append('employeeId', userId.toString());
        formData.append('careerPackage', this.uploadedFile);
        formData.append('careerPackageName', this.uploadedFile.name);
        formData.append('date', currentDate);
        formData.append('careerPackageTemplate', this.careerPackageTemplateTitle);

        return this.http.post<string>('http://localhost:8083/employeeCareerPackages', formData, { headers });
      }),
      tap(response => console.log('Career Package Submission Response:', response)),
      tap(() => {
        this.isSubmitted = true;
        this.fetchSubmissionMessages(this.employeeId);
      })
    ).subscribe({
      error: (error) => console.error('Error during package submission:', error)
    });
  }

  fetchSubmissionMessages(employeeId: number): void {
    const headers = this.getAuthHeaders();

    const fetchMessages$ = this.http.get<any[]>(
      `http://localhost:8083/submittedCareerPackage/employee/${employeeId}`,
      { headers }
    ).pipe(
      tap(response => console.log('Fetch Messages Response career package:', response))
    );

    if (this.isSubmitted) {
      this.http.get<UserCareerPackage[]>(
        `http://localhost:8083/employeeCareerPackages/all/${employeeId}`,
        { headers }
      ).pipe(
        tap(response => console.log('Career Packages Response:', response)),
        tap(careerPackages => {
          const lastPackage = careerPackages[careerPackages.length - 1];
          this.submittedCareerPackage(lastPackage);
        })
      ).subscribe();
    }

    fetchMessages$.pipe(
      switchMap(messagesResponse => {
        if (this.isSubmitted) {
          const message = messagesResponse[messagesResponse.length - 1];
          this.submissionMessages.push({
            date: 'Career package submitted on ' + message.employeeCareerPackage.date.toLocaleString(),
            file: message.employeeCareerPackage.careerPackageName,
            comments: [],
            status: message.careerPackageStatus,
            id: message.id,
          });
          this.isSubmitted = false;
          return [];
        }


        this.submissionMessages.length = 0;
        const commentRequests = messagesResponse.map(message =>
          this.http.get<CommentDTO[]>(
            `http://localhost:8083/comments/all/${message.id}`,
            { headers }
          ).pipe(
            tap(comments => console.log(`Comments for message ${message.id}:`, comments)),
            map(comments => ({
              message,
              comments: comments?.map(comment => comment.commentText) || []
            }))
          )
        );

        return forkJoin(commentRequests);
      })
    ).subscribe({
      next: (messageWithComments) => {
        console.log('Processed Messages with Comments:', messageWithComments);
        if (messageWithComments.length > 0) {
          messageWithComments.forEach(({ message, comments }) => {
            this.submissionMessages.push({
              date: 'Career package submitted on ' + message.employeeCareerPackage.date.toLocaleString(),
              file: message.employeeCareerPackage.careerPackageName,
              comments: comments,
              status: message.careerPackageStatus,
              id: message.id,
            });
          });
        }
        console.log('Final Submission Messages:', this.submissionMessages);
      },
      error: (error) => console.error('Error while fetching submission messages:', error)
    });
  }

  submittedCareerPackage(message: UserCareerPackage): void {
    const submitEmployeeCareerPackage: SubmittedCareerPackage = {
      employeeId: message.employeeId,
      careerPackageStatus: 'PENDING',
      managerId: 1,
      employeeCareerPackage: {
        id: message.id,
      },
    };

    const headers = this.getAuthHeaders();
    
    this.http.post<string>(
      'http://localhost:8083/submittedCareerPackage',
      submitEmployeeCareerPackage,
      { headers }
    ).pipe(
      tap(response => {
        console.log('Submitted Career Package Response:', response)
        this.reloadCareerPackageParent.emit()
      })
    ).subscribe({
      error: (error) => console.error('Error during submitted career package submission:', error)
    });
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
    const headers = this.getAuthHeaders();
    const downloadUrl = `http://localhost:8083/submittedCareerPackage/download/${id}?careerPackageName=${encodeURIComponent(careerPackageName)}`;

    this.http.get(downloadUrl, {
      headers,
      responseType: 'blob'
    }).pipe(
      tap(blob => console.log('Download Response Blob:', blob))
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = careerPackageName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Error:', error)
    });
  }
}