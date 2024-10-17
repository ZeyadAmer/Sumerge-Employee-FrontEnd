import { Injectable } from '@angular/core';
import { CareerPackageTemplateDTO, SubmittedCareerPackage, TitleUser, UserCareerPackage } from './users.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommentDTO } from '../managers/managers.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = 'http://localhost:8080';
  private careerPackageUrl = 'http://localhost:8083';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getHeaders() {
    const token = this.cookieService.get('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUser(): Promise<TitleUser | undefined> {
    return this.http.get<TitleUser>(`${this.baseUrl}/users`, { headers: this.getHeaders() }).toPromise()
      .then(response => {
        if (!response) {
          throw new Error('User not found'); // Handle the case when no user is returned
        }
        return response;
      });
  }

  getUserId(): Promise<number | undefined> {
    return this.http.get<number>(`${this.baseUrl}/users/id`, { headers: this.getHeaders() }).toPromise()
      .then(response => {
        if (!response) {
          throw new Error('User ID not found'); // Handle the case when no user ID is returned
        }
        return response;
      });
  }

  getCareerPackageTemplate(titleName: string): Promise<CareerPackageTemplateDTO | undefined> {
    return this.http.get<CareerPackageTemplateDTO>(`${this.careerPackageUrl}/careerPackageTemplates/${titleName}`, { headers: this.getHeaders() }).toPromise()
      .then(response => {
        if (!response) {
          throw new Error('Career Package Template not found'); // Handle when template is not found
        }
        return response;
      });
  }

  // Updated submitCareerPackage method
  submitCareerPackage(employeeId: number, uploadedFile: File, careerPackageTemplateTitle: string): Promise<string> {
    const formData = new FormData();
    const currentDate = new Date().toLocaleString();
    
    formData.append('employeeId', employeeId.toString());
    formData.append('careerPackage', uploadedFile);
    formData.append('careerPackageName', uploadedFile.name);
    formData.append('date', currentDate);
    formData.append('careerPackageTemplate', careerPackageTemplateTitle);
    
    return this.http.post<string>(`${this.careerPackageUrl}/employeeCareerPackages`, formData, { headers: this.getHeaders() })
      .toPromise()
      .then(response => {
        if (!response) {
          throw new Error('Submission failed, no response received.'); // Error handling
        }
        return response; // Ensures a string response is returned
      });
  }

  // Updated fetchSubmissionMessages method
  fetchSubmissionMessages(employeeId: number): Promise<any[]> {
    return this.http.get<any[]>(`${this.careerPackageUrl}/submittedCareerPackage/employee/${employeeId}`, { headers: this.getHeaders() })
      .toPromise()
      .then(response => {
        if (!response) {
          throw new Error('No submission messages found.'); // Error handling
        }
        return response; // Ensures an array response is returned
      });
  }

  // Updated submittedCareerPackage method
  submittedCareerPackage(message: UserCareerPackage): Promise<string> {
    const submitEmployeeCareerPackage: SubmittedCareerPackage = {
      employeeId: message.employeeId,
      careerPackageStatus: 'PENDING',
      managerId: 1, // Assuming a static managerId for demo
      employeeCareerPackage: {
        id: message.id,
      },
    };
    return this.http.post<string>(`${this.careerPackageUrl}/submittedCareerPackage`, submitEmployeeCareerPackage, { headers: this.getHeaders() })
      .toPromise()
      .then(response => {
        if (!response) {
          throw new Error('Submission failed, no response received.'); // Error handling
        }
        return response; // Ensures a string response is returned
      });
  }

  // Updated downloadFile method
  downloadFile(careerPackageName: string, id: number): Promise<Blob> {
    const headers = { Authorization: `Bearer ${this.cookieService.get('authToken')}` };
    const downloadUrl = `${this.careerPackageUrl}/submittedCareerPackage/download/${id}?careerPackageName=${encodeURIComponent(careerPackageName)}`;
    
    return fetch(downloadUrl, { method: 'GET', headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download file.'); // Error handling
        }
        return response.blob();
      });
  }

  // Updated getComments method
  getComments(messageId: number): Promise<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.careerPackageUrl}/comments/all/${messageId}`, { headers: this.getHeaders() })
      .toPromise()
      .then(response => {
        if (!response) {
          throw new Error('No comments found.'); // Error handling
        }
        return response; // Ensures an array response is returned
      });
  }
}
