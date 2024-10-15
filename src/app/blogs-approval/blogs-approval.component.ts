import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
export interface Blog {
  id: number;
  title: string;
  documentData: string;
  author: string;
  comment: string | null;
  submissionDate: string; // or Date if you want to parse it later
}
@Component({
  selector: 'app-blogs-approval',
  templateUrl: './blogs-approval.component.html',
  styleUrls: ['./blogs-approval.component.css']
})
export class BlogsApprovalComponent implements OnInit {
  blogs: Blog[] = [];
  newBlogContent: string = '';
  page: number = 0;  // Current page of blogs
  size: number = 5;  // Number of blogs to load per page
  loading: boolean = false; // To prevent multiple requests during scrolling
  constructor(private http: HttpClient, private cookieService: CookieService) {}


  ngOnInit(): void {
    this.loadBlogs(); // Fetch blogs on initialization
  }

  async loadBlogs() {
    this.page = 0; // Reset page for initial load
    this.blogs = await this.getBlogs(this.page, this.size);
  }

  async approveBlog(blogId: number): Promise<string> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      const response = await this.http.put<string>(`http://localhost:8082/blogs/approve`, blogId , {headers}).toPromise();
      console.log(response);
      window.location.reload();
      return response || "";
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return "";
    }
  }

  async rejectBlog(blogId: number): Promise<string> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      const response = await this.http.put<string>(`http://localhost:8082/blogs/reject`, blogId , {headers}).toPromise();
      console.log(response)
      window.location.reload();
      return response || "";
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return "";
    }
  }

  async getBlogs(page: number, size: number): Promise<Blog[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.get<Blog[]>(`http://localhost:8082/blogs/pending?page=${page}&size=${size}`, { headers }).toPromise();
      return response || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }
}
