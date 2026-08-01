import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authService: jasmine.SpyObj<AuthService>;
  let alertSpy: jasmine.Spy;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: AuthService, useValue: authService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    alertSpy = spyOn(window, 'alert');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a helpful message when the backend returns a conflict', () => {
    authService.register.and.returnValue(
      throwError(() => ({ status: 409, error: { message: 'User already exists' } }))
    );

    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'secret123';

    component.register();

    expect(alertSpy).toHaveBeenCalledWith(
      'An account with this email or username already exists. Please try logging in instead.'
    );
  });
});
