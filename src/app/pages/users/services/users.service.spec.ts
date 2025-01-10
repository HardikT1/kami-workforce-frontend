import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { ApiInterfaceService } from '../../../shared/services/api-interface.service';
import { of } from 'rxjs';
import { User } from '../models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let apiInterfaceServiceSpy: jasmine.SpyObj<ApiInterfaceService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiInterfaceService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: ApiInterfaceService, useValue: spy },
      ],
    });

    service = TestBed.inject(UsersService);
    apiInterfaceServiceSpy = TestBed.inject(
      ApiInterfaceService
    ) as jasmine.SpyObj<ApiInterfaceService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call ApiInterfaceService.get with the correct URL when getUserById is called', () => {
    const mockUser: User = {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496',
        },
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
      },
    };
    const userId = 1;
    apiInterfaceServiceSpy.get.and.returnValue(of(mockUser));

    service.getUserById(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    expect(apiInterfaceServiceSpy.get).toHaveBeenCalledWith(`/users/${userId}`);
  });
});
