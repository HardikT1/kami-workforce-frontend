import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../services/loader.service';
import { Observable, Subject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let loaderServiceStub: Partial<LoaderService>;
  let loadingSubject: Subject<boolean>;

  beforeEach(async () => {
    // Create a Subject to mock the loading$ observable
    loadingSubject = new Subject<boolean>();

    // Stub for LoaderService
    loaderServiceStub = {
      loading$: loadingSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [AsyncPipe, LoaderComponent],
      providers: [{ provide: LoaderService, useValue: loaderServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the LoaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have a loading$ observable', () => {
    expect(component.loading$).toBeDefined();
    expect(component.loading$ instanceof Observable).toBeTrue();
  });

  it('should display the loader when loading$ is true', () => {
    // Emit true to simulate loading state
    loadingSubject.next(true);
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(By.css('.spinner-border'));
    expect(loaderElement).toBeTruthy();
  });

  it('should hide the loader when loading$ is false', () => {
    // Emit false to simulate non-loading state
    loadingSubject.next(false);
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(By.css('.spinner-border'));
    expect(loaderElement).toBeNull();
  });

  it('should initially not display the loader if loading$ has not emitted', () => {
    const loaderElement = fixture.debugElement.query(By.css('.spinner-border'));
    expect(loaderElement).toBeNull();
  });
});
