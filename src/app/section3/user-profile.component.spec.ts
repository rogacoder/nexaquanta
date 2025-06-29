import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from
    '@angular/common/http/testing';
import { UserProfileComponent } from './user-profile.component';
import { UserService } from '../services/user.service';
// RS: Missing 'By' Import
import { By } from '@angular/platform-browser';
describe('UserProfileComponent', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;
    let httpMock: HttpTestingController;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserProfileComponent],
            /* RS: use provideHttpClientTesting() instead of HttpClientTestingModule */
            providers: [provideHttpClientTesting(), UserService]
        }).compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });
    it('should display user name when loaded', () => {
        const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
        const req = httpMock.expectOne('/api/user');
        expect(req.request.method).toBe('GET');
        req.flush(mockUser);
        fixture.detectChanges();
        const nameElement = fixture.debugElement.query(By.css('.user-name'));
        expect(nameElement.nativeElement.textContent).toContain('John Doe');
    });
});