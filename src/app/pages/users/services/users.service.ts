import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiInterfaceService } from '../../../shared/services/api-interface.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // Injecting ApiInterfaceService to handle API calls
  private apiInterfaceService = inject(ApiInterfaceService);

  /**
   * Fetches detailed information about a specific user by its ID.
   * @param id - The unique identifier of the user.
   * @returns users detail
   */
  getUserById(id: number): Observable<User> {
    return this.apiInterfaceService.get<User>(`/users/${id}`);
  }
}
