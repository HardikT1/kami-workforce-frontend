import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { PostService } from '../../../posts/services/post.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Post } from '../../../posts/models/post.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  imports: [RouterLink],
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  // injecting user service
  private readonly userService = inject(UsersService);

  // injecting posts service
  private readonly postService = inject(PostService);

  // ActivatedRoute for accessing query parameters from the route
  private readonly activatedRoute = inject(ActivatedRoute);

  // DestroyRef to manage the lifecycle of subscriptions
  private destroyRef = inject(DestroyRef);

  // to hold user details
  user!: User;

  // to hold posts list
  posts: Post[] = [];

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.paramMap.get('id');
    if (userId) {
      this.fetchAllUserDetails(Number(userId));
    }
  }
  /**
   * Fetch all user details including user and posts
   */
  fetchAllUserDetails(userId: number): void {
    forkJoin({
      user: this.userService.getUserById(userId),
      posts: this.postService.getPostsList({ userId }),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ user, posts }) => {
          this.user = user;
          this.posts = posts;
        },
        error: (err) => console.error('Error fetching user details:', err),
      });
  }
}
