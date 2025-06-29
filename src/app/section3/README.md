## 3.1 Unit Test Modernization

**Task: This unit test is failing after migration. Fix and modernize it:**

    import { ComponentFixture, TestBed } from '@angular/core/testing';
    import { HttpClientTestingModule, HttpTestingController } from
    '@angular/common/http/testing';
    import { UserProfileComponent } from './user-profile.component';
    import { UserService } from '../services/user.service';
    describe('UserProfileComponent', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;
    let httpMock: HttpTestingController;
    beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [UserProfileComponent],
    imports: [HttpClientTestingModule],
    providers: [UserService]
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

**Answer**

This unit test file is problematic/potentially flakey in that it it not 'unit'*(function/class property)* testing and it is DOM testing. 

For DOM testing it is recommended to use component testing *( cypress component tests. playwright, ... ).* These are much better tools for DOM testing a component in isolation and we then separate the testing concerns *( Unit, component, e2e, contract, ..)*

**Fixing**

From initial look, the file is using a deprecated method for http testing and missing the import for 'By'.

*If this test still fails,* it will be likely due to an issue in the component itself ( component file or service not provided ).

**Updated file**

    import { ComponentFixture, TestBed } from  '@angular/core/testing';
    
    import { HttpTestingController, provideHttpClientTesting } from
    
    '@angular/common/http/testing';
    
    import { UserProfileComponent } from  './user-profile.component';
    
    import { UserService } from  '../services/user.service';
    
    // RS: Missing 'By' Import
    
    import { By } from  '@angular/platform-browser';
    
    describe('UserProfileComponent', () => {
    
    let  component:  UserProfileComponent;
    
    let  fixture:  ComponentFixture<UserProfileComponent>;
    
    let  httpMock:  HttpTestingController;
    
    beforeEach(async () => {
    
    await  TestBed.configureTestingModule({
    
    declarations:  [UserProfileComponent],
    
    /* RS: use provideHttpClientTesting() instead of HttpClientTestingModule */
    
    providers:  [provideHttpClientTesting(), UserService]
    
    }).compileComponents();
    
    });
    
    beforeEach(() => {
    
    fixture  =  TestBed.createComponent(UserProfileComponent);
    
    component  =  fixture.componentInstance;
    
    httpMock  =  TestBed.inject(HttpTestingController);
    
    fixture.detectChanges();
    
    });
    
    it('should display user name when loaded', () => {
    
    const  mockUser  = { id:  1, name:  'John Doe', email:  'john@example.com' };
    
    const  req  =  httpMock.expectOne('/api/user');
    
    expect(req.request.method).toBe('GET');
    
    req.flush(mockUser);
    
    fixture.detectChanges();
    
    const  nameElement  =  fixture.debugElement.query(By.css('.user-name'));
    expect(nameElement.nativeElement.textContent).toContain('John Doe');
    
    });
    
    });

**Modernize...**

The Modernisation of the spec file is, apart from new syntax and flow, not Angular version specific.

To ease fucture upgrades, these practices are reccomended

1. Keep http calls to services
2. Employ a 'smart/dumb' (container/presentation) architecture - Separation of Concerns and ease of switching between SPA and SSR/SSG
3. Use Cypress Component testing for e2e tests "in the box" and a separate e2e project for more 'integrated' E2E tests


