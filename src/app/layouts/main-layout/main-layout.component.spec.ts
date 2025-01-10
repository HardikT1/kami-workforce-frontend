import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { of } from 'rxjs';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: of({}), // Replace with actual route parameters if needed
      },
    };
    await TestBed.configureTestingModule({
      imports: [RouterOutlet, MainLayoutComponent, SidenavComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidebar', () => {
    const sidebarElement = fixture.debugElement.query(
      By.css('.sidebar')
    ).nativeElement;
    expect(sidebarElement).toBeTruthy();
  });

  it('should render the sidenav component inside the sidebar', () => {
    const sidenavElement = fixture.debugElement.query(
      By.directive(SidenavComponent)
    );
    expect(sidenavElement).toBeTruthy();
  });

  it('should render the router outlet in the main content area', () => {
    const routerOutletElement = fixture.debugElement.query(
      By.directive(RouterOutlet)
    );
    expect(routerOutletElement).toBeTruthy();
  });

  it('should render the toggle button for small screens', () => {
    const toggleButton = fixture.debugElement.query(
      By.css('.btn.btn-primary.d-md-none')
    ).nativeElement;
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.textContent.trim()).toBe('☰ Menu');
  });

  it('should have offcanvas sidebar for small screens', () => {
    const offcanvasElement = fixture.debugElement.query(
      By.css('.offcanvas')
    ).nativeElement;
    expect(offcanvasElement).toBeTruthy();
    expect(offcanvasElement.id).toBe('offcanvasSidebar');
  });

  it('should have offcanvas close button', () => {
    const closeButton = fixture.debugElement.query(
      By.css('.offcanvas-header .btn-close')
    ).nativeElement;
    expect(closeButton).toBeTruthy();
    expect(closeButton.getAttribute('data-bs-dismiss')).toBe('offcanvas');
  });

  it('should render the app sidenav inside the offcanvas body for small screens', () => {
    const offcanvasSidenav = fixture.debugElement.query(
      By.css('.offcanvas-body app-sidenav')
    );
    expect(offcanvasSidenav).toBeTruthy();
  });

  it('should have a sticky sidebar on larger screens', () => {
    const stickyElement = fixture.debugElement.query(
      By.css('.position-sticky.pt-3')
    ).nativeElement;

    expect(stickyElement).toBeTruthy();
  });
});
