import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loading$ as false', (done) => {
    service.loading$.subscribe((loading) => {
      expect(loading).toBeFalse();
      done();
    });
  });

  it('should set loading$ to true when show() is called', (done) => {
    service.show();
    service.loading$.subscribe((loading) => {
      expect(loading).toBeTrue();
      done();
    });
  });

  it('should set loading$ to false when hide() is called', (done) => {
    service.show(); // Set to true first
    service.hide();
    service.loading$.subscribe((loading) => {
      expect(loading).toBeFalse();
      done();
    });
  });

  it('should toggle loading$ between true and false when show() and hide() are called', (done) => {
    service.show();
    service.loading$.subscribe((loading) => {
      if (loading) {
        service.hide();
      } else {
        expect(loading).toBeFalse();
        done();
      }
    });
  });
});
