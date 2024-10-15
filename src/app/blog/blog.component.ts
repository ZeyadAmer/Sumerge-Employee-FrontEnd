import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-blog',
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BlogComponent implements OnInit {
  blogs: Blog[] = [];
  newBlogContent: string = '';
  page: number = 0;  // Current page of blogs
  size: number = 5;  // Number of blogs to load per page
  loading: boolean = false; // To prevent multiple requests during scrolling

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  newBlogTitle: any;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  // Fetch initial blogs
  async loadBlogs() {
    this.page = 0; // Reset page for initial load
    this.blogs = await this.getBlogs(this.page, this.size);
  }

  // Submit new blog
  async addBlog() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const newBlog = {
      title: this.newBlogTitle,
      documentData: this.newBlogContent
    };

    try {
      const response = await this.http.post('http://localhost:8082/blogs', newBlog, { headers }).toPromise();
      this.newBlogTitle = '';
      this.newBlogContent = '';
      this.blogs.unshift(response as Blog); // Add the new blog to the top of the list
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  }

  // Scroll event handler to load more blogs
  onScroll() {
  const container = this.scrollContainer.nativeElement;
  const { scrollTop, scrollHeight, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 50 && !this.loading) {
    this.loadMoreBlogs();
  }
}

  // Fetch more blogs (pagination or lazy loading)
  async loadMoreBlogs() {
    this.loading = true;
    this.page += 1; // Increment page number
    const moreBlogs = await this.getBlogs(this.page, this.size);
    this.blogs = [...this.blogs, ...moreBlogs]; // Append new blogs to the current list
    this.loading = false;
  }

  // Fetch blogs with pagination
  async getBlogs(page: number, size: number): Promise<Blog[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.get<Blog[]>(`http://localhost:8082/blogs?page=${page}&size=${size}`, { headers }).toPromise();
      return response || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }
}
