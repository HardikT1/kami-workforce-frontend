import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from './pagination.component';
import { DebugElement } from '@angular/core';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    component.totalCount = 50;
    component.pageSize = 10;
    expect(component.totalPages).toBe(5);
  });

  it('should emit the correct page number when onPageChange is called', () => {
    spyOn(component.pageChangeEvent, 'emit');

    const newPage = 2;
    component.onPageChange(newPage);

    expect(component.pageChangeEvent.emit).toHaveBeenCalledWith(newPage);
  });

  it('should disable the "Previous" button on the first page', () => {
    component.currentPage = 1;
    fixture.detectChanges();

    const prevButton = debugElement.query(By.css('.page-item:first-child'));
    expect(prevButton.classes['disabled']).toBeTrue();
  });

  it('should disable the "Next" button on the last page', () => {
    component.totalCount = 30;
    component.pageSize = 10;
    component.currentPage = 3;
    fixture.detectChanges();

    const nextButton = debugElement.query(By.css('.page-item:last-child'));
    expect(nextButton.classes['disabled']).toBeTrue();
  });

  it('should render the current page and total pages correctly', () => {
    component.totalCount = 100;
    component.pageSize = 10;
    component.currentPage = 5;
    fixture.detectChanges();

    const pageInfo = debugElement.query(
      By.css('.page-item:nth-child(2) .page-link')
    ).nativeElement;
    expect(pageInfo.textContent.trim()).toBe('5 of 10');
  });

  it('should call onPageChange with the correct page number when navigating', () => {
    spyOn(component, 'onPageChange');

    component.totalCount = 30;
    component.pageSize = 10;
    component.currentPage = 2;
    fixture.detectChanges();

    const nextButton = debugElement.query(
      By.css('.page-item:last-child button')
    );
    nextButton.nativeElement.click();

    expect(component.onPageChange).toHaveBeenCalledWith(3);
  });
});
