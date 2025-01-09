import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../../services/albums.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrl: './album-detail.component.scss',
})
export class AlbumDetailComponent {
  private albumService = inject(AlbumsService);

  private activatedRoute = inject(ActivatedRoute);
}
