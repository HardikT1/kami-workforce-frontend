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
    },
    {
      url: 'albums',
      title: 'Albums',
      icon: 'bi bi-folder-fill',
    },
    {
      url: 'photos',
      title: 'Photos',
      icon: 'bi bi-images',
    },
  ];
}
