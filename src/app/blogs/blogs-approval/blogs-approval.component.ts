import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Blog {
  id: number;
  title: string;
  documentData: string;
  author: string;
  comment: string | null;
  submissionDate: string;
}

@Component({
  selector: 'app-blogs-approval',
  templateUrl: './blogs-approval.component.html',
  styleUrls: ['./blogs-approval.component.css']
})
export class BlogsApprovalComponent implements OnInit {
  blogs: Blog[] = [];
  newBlogContent: string = '';
  page: number = 0;
  size: number = 5;
  loading: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.page = 0;
    this.getBlogs(this.page, this.size).subscribe({
      next: (blogs) => this.blogs = blogs,
      error: (err) => console.error('Error loading blogs:', err)
    });
  }

  approveBlog(blogId: number): void {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.put<string>(`http://localhost:8082/blogs/approve`, blogId, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          window.location.reload();
        },
        error: (err) => console.error('Error approving blog:', err)
      });
  }

  rejectBlog(blogId: number): void {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.put<string>(`http://localhost:8082/blogs/reject`, blogId, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          window.location.reload();
        },
        error: (err) => console.error('Error rejecting blog:', err)
      });
  }

  getBlogs(page: number, size: number): Observable<Blog[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Blog[]>(`http://localhost:8082/blogs/pending?page=${page}&size=${size}`, { headers })
      .pipe(
        map(response => response || [])
      );
  }
}
