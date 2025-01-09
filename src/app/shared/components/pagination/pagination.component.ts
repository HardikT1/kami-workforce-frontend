import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  // input to get the page size
  @Input() pageSize = 10;

  // input to get the page size
  @Input() totalCount = 0;

  // input to get the page size
  @Input() currentPage = 1;

  // page change output event
  @Output() pageChangeEvent = new EventEmitter<number>();

  /**
   * To get the total pages
   */
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  /**
   * Emit page value to the parent component
   * @param page - page number
   */
  onPageChange(page: number): void {
    this.pageChangeEvent.emit(page);
  }
}
