import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./pages/posts/posts.component').then((c) => c.PostsComponent),
      },
      {
        path: 'posts/:id',
        loadComponent: () =>
          import(
            './pages/posts/components/post-detail/post-detail.component'
          ).then((c) => c.PostDetailComponent),
      },
      {
        path: 'albums',
        loadComponent: () =>
          import('./pages/albums/albums.component').then(
            (c) => c.AlbumsComponent
          ),
      },
      {
        path: 'albums/:id',
        loadComponent: () =>
          import(
            './pages/albums/components/album-detail/album-detail.component'
          ).then((c) => c.AlbumDetailComponent),
      },
      {
        path: 'photos',
        loadComponent: () =>
          import('./pages/photos/photos.component').then(
            (c) => c.PhotosComponent
          ),
      },
      {
        path: 'photos/:id',
        loadComponent: () =>
          import(
            './pages/photos/components/photo-detail/photo-detail.component'
          ).then((c) => c.PhotoDetailComponent),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import(
            './pages/users/components/user-detail/user-detail.component'
          ).then((c) => c.UserDetailComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
