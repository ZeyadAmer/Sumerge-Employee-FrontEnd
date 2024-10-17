import { Component, OnInit } from '@angular/core';
import { BlogService, Blog } from '../blog.service'; // Adjust the import path accordingly

@Component({
    selector: 'app-blogs-approval',
    templateUrl: './blogs-approval.component.html',
    styleUrls: ['./blogs-approval.component.css']
})
export class BlogsApprovalComponent implements OnInit {
    blogs: Blog[] = [];
    page: number = 0;
    size: number = 5;

    constructor(private blogService: BlogService) {}

    ngOnInit(): void {
        this.loadBlogs();
    }

    loadBlogs(): void {
        this.blogService.getPendingBlogs(this.page, this.size).subscribe({
            next: (blogs) => this.blogs = blogs,
            error: (err) => console.error('Error loading blogs:', err)
        });
    }

    approveBlog(blogId: number): void {
        this.blogService.approveBlog(blogId).subscribe({
            next: (response) => {
                console.log(response);
                this.loadBlogs();
            },
            error: (err) => console.error('Error approving blog:', err)
        });
    }

    rejectBlog(blogId: number): void {
        this.blogService.rejectBlog(blogId).subscribe({
            next: (response) => {
                console.log(response);
                this.loadBlogs();
            },
            error: (err) => console.error('Error rejecting blog:', err)
        });
    }
}
