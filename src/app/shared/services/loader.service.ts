import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  // to track the loader loading status
  private _loading = new BehaviorSubject<boolean>(false);

  public readonly loading$: Observable<boolean> = this._loading.asObservable();

  /**
   * To show loader.
   */
  show(): void {
    this._loading.next(true);
  }

  /**
   * To hide loader
   */
  hide(): void {
    this._loading.next(false);
  }
}
