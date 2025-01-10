import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterOutlet, AppComponent, LoaderComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'kami-workforce-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('kami-workforce-frontend');
  });

  it('should render <app-loader>', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(By.css('app-loader'));
    expect(loaderElement).toBeTruthy();
  });

  it('should render <router-outlet>', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const routerOutletElement = fixture.debugElement.query(
      By.directive(RouterOutlet)
    );
    expect(routerOutletElement).toBeTruthy();
  });
});
