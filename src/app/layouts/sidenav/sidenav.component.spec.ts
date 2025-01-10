import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { of } from 'rxjs';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (): string => '123', // Explicitly specify the return type as string
              },
            },
            params: of({ id: '123' }), // Mock observable for params
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all menu items', () => {
    // Ensure the menuItems array is populated correctly before testing
    component.menuItems = [
      {
        url: 'dashboard',
        title: 'Dashboard',
        icon: 'bi bi-stack',
      },
      {
        url: 'posts',
        title: 'Posts',
        icon: 'bi bi-file-post',
      },
      {
        url: 'albums',
        title: 'Albums',
        icon: 'bi bi-folder-fill',
      },
      {
        url: 'photos',
        title: 'Photos',
        icon: 'bi bi-images',
      },
    ];

    // Trigger change detection to update the template
    fixture.detectChanges();

    // Query all <li> elements and check the length
    const menuItems = fixture.debugElement.queryAll(By.css('li'));
    expect(menuItems.length).toBe(component.menuItems.length);
  });

  it('should display correct title and icon for each menu item', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('li'));

    menuItems.forEach((menuItem, index) => {
      const titleElement = menuItem.query(By.css('.menu-title')).nativeElement;
      const iconElement = menuItem.query(By.css('.menu-icon')).nativeElement;

      expect(titleElement.textContent.trim()).toBe(
        component.menuItems[index].title
      );
      expect(iconElement.className).toContain(component.menuItems[index].icon);
    });
  });

  it('should have correct router links for each menu item', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));

    links.forEach((link, index) => {
      const linkDirective = link.injector.get(RouterLink);
      expect(linkDirective.routerLink).toBe(component.menuItems[index].url);
    });
  });

  it('should apply active class to the active link', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLinkActive));

    links.forEach((link, index) => {
      const linkActiveDirective = link.injector.get(RouterLinkActive);
      expect(linkActiveDirective.routerLinkActive).toContain('active');
    });
  });
});
