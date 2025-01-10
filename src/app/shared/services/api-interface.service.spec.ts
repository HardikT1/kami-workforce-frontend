import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiInterfaceService } from './api-interface.service';
import { provideHttpClient } from '@angular/common/http';

describe('ApiInterfaceService', () => {
  let service: ApiInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiInterfaceService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
