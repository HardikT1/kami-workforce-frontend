import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PhotosService } from '../../services/photos.service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../../models/photo.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-photo-detail',
  imports: [HeaderComponent],
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent implements OnInit {
  // page heading
  title = 'Photo Page';

  // injecting photos service
  private photosService = inject(PhotosService);

  // ActivatedRoute for accessing query parameters from the route
  private activatedRoute = inject(ActivatedRoute);

  // photo details
  photo!: Photo;

  // DestroyRef to manage the lifecycle of subscriptions
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const photoId = this.activatedRoute.snapshot.paramMap.get('id');
    if (photoId) {
      this.fetchPhotoDetails(Number(photoId));
    }
  }

  /**
   * Fetch the photo detaisl by id.
   * @param id - id of the photo for which to fetch the details
   */
  fetchPhotoDetails(id: number): void {
    this.photosService
      .getPhotoById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (photodetails) => {
          this.photo = photodetails;
        },
        error: (err) => console.error('Error fetching photos details:', err),
      });
  }
}
