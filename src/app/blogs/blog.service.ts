import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserDTO } from '../scoreboard-list/user.model';

export interface Blog {
    id: number;
    title: string;
    documentData: string;
    author: string;
    authorName?: string;
    comment: string | null;
    submissionDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private baseUrl = 'http://localhost:8082/blogs';

    constructor(private http: HttpClient, private cookieService: CookieService) {}

    private getAuthHeaders(): HttpHeaders {
        const token = this.cookieService.get('authToken');
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }

    getBlogs(page: number, size: number): Observable<Blog[]> {
        return this.http.get<Blog[]>(`${this.baseUrl}?page=${page}&size=${size}`, { headers: this.getAuthHeaders() })
            .pipe(
                switchMap(blogs => {
                    const authorRequests = blogs.map(blog => this.getBlogAuthor(blog.author));
                    return forkJoin(authorRequests).pipe(
                        map(authors => {
                            authors.forEach((author, index) => {
                                blogs[index].authorName = author ? `${author.firstName} ${author.lastName}` : 'Unknown Author';
                            });
                            return blogs;
                        })
                    );
                }),
                catchError(error => {
                    console.error('Error fetching blogs or authors:', error);
                    return of([]); // Return an empty array on error
                })
            );
    }

    getBlogAuthor(authorId: string): Observable<UserDTO | null> {
        return this.http.get<UserDTO>(`http://localhost:8080/users/${authorId}`, { headers: this.getAuthHeaders() })
            .pipe(
                catchError(error => {
                    console.error('Error fetching author:', error);
                    return of(null); // Return null in case of error
                })
            );
    }

    approveBlog(blogId: number): Observable<any> {
        return this.http.put<string>(`${this.baseUrl}/approve`, blogId, { headers: this.getAuthHeaders() });
    }

    rejectBlog(blogId: number): Observable<any> {
        return this.http.put<string>(`${this.baseUrl}/reject`, blogId, { headers: this.getAuthHeaders() });
    }

    addBlog(newBlog: Omit<Blog, 'id' | 'submissionDate'>): Observable<Blog> {
        return this.http.post<Blog>(this.baseUrl, newBlog, { headers: this.getAuthHeaders() });
    }

    getPendingBlogs(page: number, size: number): Observable<Blog[]> {
        return this.http.get<Blog[]>(`${this.baseUrl}/pending?page=${page}&size=${size}`, { headers: this.getAuthHeaders() });
    }
}
