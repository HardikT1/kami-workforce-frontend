import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Album } from './models/album.model';
import { AlbumsService } from './services/albums.service';
import { QueryParams } from '../../shared/models/query-param.model';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, forkJoin, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Photo } from '../photos/models/photo.model';
import { PhotosService } from '../photos/services/photos.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-albums',
  imports: [FormsModule, RouterLink, PaginationComponent, HeaderComponent],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsComponent implements OnInit {
  // page heading
  title = 'Album List';

  // Service for fetching albums data
  private albumsService = inject(AlbumsService);

  // Service for fetching photos data
  private photosService = inject(PhotosService);

  // ActivatedRoute for accessing query parameters from the route
  private activatedRoute = inject(ActivatedRoute);

  // Router for navigating and updating query parameters
  private router = inject(Router);

  // DestroyRef to manage the lifecycle of subscriptions
  private destroyRef = inject(DestroyRef);

  // List of albums fetched from the API
  albums: Album[] = [];

  // Query parameters for API requests and route updates
  params: QueryParams = {
    _page: 1,
    _limit: 10,
    _sort: '',
    _order: '',
    filter: '',
  };

  // Subject for handling filter changes with debounce
  private filterSubject = new Subject<string>();

  // total records count
  totalCount = 0;

  ngOnInit(): void {
    this.handleQueryParamChanges();

    this.setupFilterSubscription();
  }

  /**
   * Subscribes to query parameter changes and updates the `params` object accordingly.
   * Fetches posts whenever query parameters change.
   */
  handleQueryParamChanges(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.params = {
        ...this.params,
        _page: +queryParams['page'] || 1,
        _limit: +queryParams['limit'] || this.params._limit,
        _sort: queryParams['sort'] || this.params._sort,
        _order: queryParams['order'] || this.params._order,
        filter: queryParams['filter'] || this.params.filter,
      };
      this.getAllAlbums();
    });
  }

  /**
   * Sets up a subscription to the filter subject with debounce and distinctUntilChanged operators.
   * Updates query parameters whenever the filter value changes.
   */
  setupFilterSubscription(): void {
    this.filterSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500), // Debounce filter changes by 500ms
        distinctUntilChanged() // Only emit when filter value changes
      )
      .subscribe(() => {
        this.params._page = 1;
        this.appendQueryParams();
      });
  }

  /**
   * Fetches the list of albums from the API based on the current query parameters.
   */
  getAllAlbums(): void {
    const { filter, ...restParams } = this.params;
    this.albumsService
      .getAlbumbsListWithTotalCount({
        title_like: filter?.trim(),
        ...restParams,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.albums = res?.data;
          this.totalCount = res.totalCount;
          const albumIds = [...new Set(this.albums.map((album) => album.id))];
          this.loadAlbumsPhotosDetails(albumIds);
        },
        error: (error) => console.error('Error fetching albums:', error),
      });
  }

  /**
   * Load Albums details.
   * @param albumIds - album id
   */
  loadAlbumsPhotosDetails(albumIds: number[]): void {
    forkJoin(
      albumIds.map((id) => this.photosService.getPhotosList({ albumId: id }))
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (photosArray) => {
          this.enrichAlbumsWithPhotos(photosArray);
        },
        error: (err) => console.error('Error fetching photos:', err),
      });
  }

  /**
   * Associate photos with each album
   * @param photos - photos list
   */
  enrichAlbumsWithPhotos(photos: Photo[][]): void {
    this.albums = this.albums.map((album, index) => ({
      ...album,
      photos: photos[index] || [],
    }));
  }

  /**
   * Handles page changes from the pagination component.
   * Updates the `_page` parameter and triggers query parameter update.
   *
   * @param page - The new page number
   */
  onPageChange(page: number): void {
    this.params._page = page;
    this.appendQueryParams();
  }

  /**
   * Handles sorting changes.
   * Updates the sorting parameters and triggers query parameter update.
   */
  onSortChange(): void {
    this.appendQueryParams();
  }

  /**
   * Handles filter input changes.
   * Emits the new filter value to the filter subject.
   */
  onFilterChange(): void {
    this.filterSubject.next(this.params.filter.trim());
  }

  /**
   * Updates the route with the current query parameters and merges them with existing ones.
   * This ensures the URL reflects the current state of pagination, sorting, and filtering.
   */
  async appendQueryParams(): Promise<void> {
    console.log('appendQueryParams', this.params);
    await this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: this.params._page,
        limit: this.params._limit,
        sort: this.params._sort,
        order: this.params._order,
        filter: this.params.filter,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
