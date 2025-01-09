import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from './loader.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
/**
 * The purpose of this intercept is to track the status of http requests for the purposes of showing/hiding a loader
 *
 */
let activeRequests = 0; // counter for total request

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  // Use inject() to access the LoaderService
  const loaderService = inject(LoaderService);

  activeRequests++;

  // show loader on request being initialized
  loaderService.show();

  return next(req).pipe(
    finalize(() => {
      // minus counter after request finalize
      activeRequests -= 1;

      // check if no request pending and hide loader
      if (activeRequests === 0) {
        loaderService.hide();
      }
    })
  );
};
