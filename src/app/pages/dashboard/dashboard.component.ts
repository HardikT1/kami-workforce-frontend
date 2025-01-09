import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PostService } from '../posts/services/post.service';
import { AlbumsService } from '../albums/services/albums.service';
import { PhotosService } from '../photos/services/photos.service';
import { forkJoin } from 'rxjs';
import { Post } from '../posts/models/post.model';
import { Album } from '../albums/models/album.model';
import { Photo } from '../photos/models/photo.model';
import { UsersService } from '../users/services/users.service';
import { RouterLink } from '@angular/router';
import { User } from '../users/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  // injecting dependencies
  private postService = inject(PostService);
  private albumsService = inject(AlbumsService);
  private photosService = inject(PhotosService);
  private usersService = inject(UsersService);

  // to hold posts data
  posts: Post[] = [];
  // to hold albums data
  albums: Album[] = [];
  // to hold photos data
  photos: Photo[] = [];
  // to hold top posts
  topPosts: Post[] = [];
  // to hold recent photos
  recentPhotos: Photo[] = [];

  // to manage the subscription on destroy
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load dashboard data.
   */
  private loadDashboardData(): void {
    forkJoin({
      posts: this.postService.getPostsList(),
      albums: this.albumsService.getAlbumbsList(),
      photos: this.photosService.getPhotosList(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboardData) => {
          this.handleDashboardData(dashboardData);
        },
        error: (err) => {
          console.error('Error fetching dashboard data', err);
        },
      });
  }

  /**
   * TO handle the dashboard data to properly assign to the variables.
   * @param data - contains posts, albums, photos data
   */
  private handleDashboardData(data: {
    posts: Post[];
    albums: Album[];
    photos: Photo[];
  }): void {
    this.posts = data.posts;
    this.albums = data.albums;
    this.photos = data.photos;
    this.topPosts = this.posts.slice(0, 5);
    this.recentPhotos = this.photos.slice(0, 12);

    const userIds = [...new Set(this.topPosts.map((post) => post.userId))];
    this.loadUserDetails(userIds);
  }

  /**
   * To fetch the user details for each post.
   * @param userIds - userid lists
   */
  private loadUserDetails(userIds: number[]): void {
    forkJoin(userIds.map((id) => this.usersService.getUserById(id)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (userDetails) => {
          this.enrichPostsWithUserDetails(userDetails);
        },
        error: (err) => {
          console.error('Error fetching user details', err);
        },
      });
  }

  /**
   * To assign user details to specific post.
   * @param userDetails - user related details
   */
  private enrichPostsWithUserDetails(userDetails: User[]): void {
    this.topPosts = this.topPosts.map((post) => {
      const user = userDetails.find((user) => user.id === post.userId);
      return { ...post, user };
    });
  }
}
