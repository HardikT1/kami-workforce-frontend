import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  // list of menu items to be shown in the side nav
  menuItems: {
    url: string;
    title: string;
    icon: string;
    queryParams?: {
      page: number,
      limit: number
    }
  }[] = [
      {
        url: 'dashboard',
        title: 'Dashboard',
        icon: 'bi bi-stack',
      },
      {
        url: 'posts',
        title: 'Posts',
        icon: 'bi bi-file-post',
        queryParams: {
          page: 1,
          limit: 10
        }
      },
      {
        url: 'albums',
        title: 'Albums',
        icon: 'bi bi-folder-fill',
        queryParams: {
          page: 1,
          limit: 10
        }
      },
      {
        url: 'photos',
        title: 'Photos',
        icon: 'bi bi-images',
        queryParams: {
          page: 1,
          limit: 10
        }
      },
    ];
}
