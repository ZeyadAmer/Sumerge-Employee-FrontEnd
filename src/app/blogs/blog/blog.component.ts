import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserDTO } from '../../scoreboard-list/user.model';

export interface Blog {
  id: number;
  title: string;
  documentData: string;
  author: string; 
  authorName?: string; 
  comment: string | null;
  submissionDate: string;
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
  page: number = 0;
  size: number = 5;
  loading: boolean = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  newBlogTitle: any;

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

  addBlog(): void {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const newBlog = {
      title: this.newBlogTitle,
      documentData: this.newBlogContent
    };

    this.http.post<Blog>('http://localhost:8082/blogs', newBlog, { headers }).subscribe({
      next: (response) => {
        this.newBlogTitle = '';
        this.newBlogContent = '';
        this.blogs.unshift(response);
      },
      error: (err) => console.error('Error submitting blog:', err)
    });
  }

  onScroll(): void {
    const container = this.scrollContainer.nativeElement;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !this.loading) {
      this.loadMoreBlogs();
    }
  }

  loadMoreBlogs(): void {
    this.loading = true;
    this.page += 1;

    this.getBlogs(this.page, this.size).subscribe({
      next: (moreBlogs) => {
        this.blogs = [...this.blogs, ...moreBlogs];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading more blogs:', err);
        this.loading = false;
      }
    });
  }
  getBlogs(page: number, size: number): Observable<Blog[]> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<Blog[]>(`http://localhost:8082/blogs?page=${page}&size=${size}`, { headers }).pipe(
      switchMap(blogs => {
        // Create an array of observables to fetch the author for each blog
        const authorRequests = blogs.map(blog => this.getBlogAuthor(blog.author));
        return forkJoin(authorRequests).pipe(
          map(authors => {
            // Map authors to their respective blogs using the index
            authors.forEach((author, index) => {
              // You can attach the author directly to the blog object if you want
              blogs[index].authorName = author ? `${author.firstName} ${author.lastName}` : 'Unknown Author';
            });
            return blogs; // Return the modified blogs array
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching blogs or authors:', error);
        return of([]); // Return an empty array on error
      })
    );
  }
  
  
  // Fetch UserDTO for the given author ID
  getBlogAuthor(authorId: string): Observable<UserDTO | null> {
  const token = this.cookieService.get('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<UserDTO>(`http://localhost:8080/users/${authorId}`, { headers })
    .pipe(
      catchError(error => {
        console.error('Error fetching author:', error);
        return of(null); // Return null in case of error
      })
    );
}

}
