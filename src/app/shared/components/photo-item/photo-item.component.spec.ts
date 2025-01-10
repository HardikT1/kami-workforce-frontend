import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoItemComponent } from './photo-item.component';
import { By } from '@angular/platform-browser';
import { Photo } from '../../../pages/photos/models/photo.model';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

describe('PhotoItemComponent', () => {
  let component: PhotoItemComponent;
  let fixture: ComponentFixture<PhotoItemComponent>;
  let router: Router;
  let location: Location;

  const mockPhoto: Photo = {
    id: 1,
    albumId: 1,
    title: 'accusamus beatae ad facilis cum similique qui sunt',
    url: 'https://via.placeholder.com/600/92c952',
    thumbnailUrl: 'https://via.placeholder.com/150/92c952',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoItemComponent, DummyPhotoComponent],
      providers: [
        provideRouter([{ path: 'photos/:id', component: DummyPhotoComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoItemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
  });

  it('should create the component', () => {
    component.photo = mockPhoto;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the photo title', () => {
    component.photo = mockPhoto;
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(
      By.css('.card-title')
    ).nativeElement;
    expect(titleElement.textContent.trim()).toBe(mockPhoto.title);
  });

  it('should render the photo thumbnail with correct src and alt attributes', () => {
    component.photo = mockPhoto;
    fixture.detectChanges();

    const imageElement = fixture.debugElement.query(
      By.css('img')
    ).nativeElement;
    expect(imageElement.src).toBe(mockPhoto.thumbnailUrl);
    expect(imageElement.alt).toBe(mockPhoto.title);
  });

  it('should navigate to the correct photo URL when clicked', async () => {
    component.photo = mockPhoto;
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a')).nativeElement;
    linkElement.click();
    await fixture.whenStable();

    expect(location.path()).toBe(`/photos/${mockPhoto.id}`);
  });

  it('should throw an error if photo input is not provided', () => {
    expect(() => {
      fixture.detectChanges();
    }).toThrowError();
  });
});

// Dummy Photo Component to serve as a routing target
@Component({
  template: '',
})
class DummyPhotoComponent {}
