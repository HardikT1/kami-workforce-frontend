import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PhotosService } from './services/photos.service';
import { Photo } from './models/photo.model';
import { QueryParams } from '../../shared/models/query-param.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-photos',
  imports: [FormsModule, PaginationComponent, RouterLink, HeaderComponent],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
})
export class PhotosComponent implements OnInit {
  // page heading
  title = 'Photo List';

  // Service for fetching photos data
  private photosService = inject(PhotosService);

  // ActivatedRoute for accessing query parameters from the route
  private activatedRoute = inject(ActivatedRoute);

  // Router for navigating and updating query parameters
  private router = inject(Router);

  // DestroyRef to manage the lifecycle of subscriptions
  private destroyRef = inject(DestroyRef);

  // List of photos fetched from the API
  photos: Photo[] = [];

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

  ngOnInit(): void {
    this.handleQueryParamChanges();
    this.setupFilterSubscription();
  }

  /**
   * Subscribes to query parameter changes and updates the `params` object accordingly.
   * Fetches photos whenever query parameters change.
   */
  private handleQueryParamChanges(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.params = {
        ...this.params,
        _page: +queryParams['page'] || 1,
        _limit: +queryParams['limit'] || this.params._limit,
        _sort: queryParams['sort'] || this.params._sort,
        _order: queryParams['order'] || this.params._order,
        filter: queryParams['filter'] || this.params.filter,
      };
      this.getAllPhotos();
    });
  }

  /**
   * Sets up a subscription to the filter subject with debounce and distinctUntilChanged operators.
   * Updates query parameters whenever the filter value changes.
   */
  private setupFilterSubscription(): void {
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
   * Fetches the list of photos from the API based on the current query parameters.
   */
  private getAllPhotos(): void {
    const { filter, ...restParams } = this.params;
    this.photosService
      .getPhotosList({ title_like: filter?.trim(), ...restParams })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (photos) => (this.photos = photos),
        error: (error) => console.error('Error fetching photos:', error),
      });
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
  private async appendQueryParams(): Promise<void> {
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