import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const testTitle = 'Post List';
    component.title = testTitle;

    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;

    expect(titleElement.textContent.trim()).toBe(testTitle);
  });

  it('should apply the correct styles and classes', () => {
    fixture.detectChanges();
    const containerElement = fixture.debugElement.query(By.css('.bg-primary'));
    const titleElement = fixture.debugElement.query(By.css('h1'));

    expect(containerElement).toBeTruthy();
    expect(titleElement.nativeElement.classList).toContain('text-white');
    expect(titleElement.nativeElement.classList).toContain('mb-0');
  });
});
