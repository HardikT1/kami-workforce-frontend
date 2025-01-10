import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Post } from '../../models/post.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-detail',
  imports: [HeaderComponent, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  // page heading
  title = 'Post Page';

  // injecting post service
  postService = inject(PostService);

  // ActivatedRoute for accessing query parameters from the route
  activatedRoute = inject(ActivatedRoute);

  // to hold post details
  post: Post | null = null;

  // DestroyRef to manage the lifecycle of subscriptions
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.paramMap.get('id');
    if (postId) {
      this.fetchPostDetails(Number(postId));
    }
  }
  /**
   * Fetch post details by id.
   */
  fetchPostDetails(id: number): void {
    this.postService
      .getPostById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (postdetails) => {
          this.post = postdetails;
        },
        error: (err) => console.error('Error fetching post details:', err),
      });
  }
}
