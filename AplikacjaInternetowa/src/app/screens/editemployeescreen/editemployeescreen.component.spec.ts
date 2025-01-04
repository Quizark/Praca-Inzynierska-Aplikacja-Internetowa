import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditemployeescreenComponent } from './editemployeescreen.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { fakeAsync, tick } from '@angular/core/testing';

describe('EditemployeescreenComponent', () => {
  let component: EditemployeescreenComponent;
  let fixture: ComponentFixture<EditemployeescreenComponent>;
  let mockApiService: jasmine.SpyObj<ApiConnectionService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('ApiConnectionService', [
      'toggleActive',
      'toggleAdmin',
      'saveEmployee',
      'deleteEmployee',
    ]);

    mockUserService = jasmine.createSpyObj('UserService', ['getSessionToken']);
    mockUserService.getSessionToken.and.returnValue('dummy-token');

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([]), CommonModule],
      providers: [
        { provide: ApiConnectionService, useValue: mockApiService },
        { provide: UserService, useValue: mockUserService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(EditemployeescreenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.employeeForm).toBeDefined();
    expect(component.employeeId).toBe('1');
    expect(component.sessionToken).toBe('dummy-token');
  });

  it('should initialize the form with employee data from history state', () => {
    // Given:
    const mockEmployee = { id: '1', name: 'John', surname: 'Doe', email: 'john.doe@example.com', phone: '123456789' };
    const mockHistoryState = { employee: mockEmployee };
  
    Object.defineProperty(history, 'state', { value: mockHistoryState });
  
    // When:
    fixture.detectChanges();  
  
    // Then:
    expect(component.employeeForm.value).toEqual({
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      specialization: '' 
    });  
  
    expect(component.employeeId).toBe('1');  
  });
  it('should save employee data', fakeAsync(() => {
    // Given:
    const mockEmployee = { id: '1', name: 'John', surname: 'Doe', email: 'john.doe@example.com', phone: '123456789' };
  
    // Mock history state
    Object.defineProperty(window.history, 'state', { value: { employee: mockEmployee } });
  
    // Update the fixture
    fixture.detectChanges();
  
    // When: Update form values
    component.employeeForm.controls['name'].setValue('Jane');
    component.employeeForm.controls['surname'].setValue('Smith');
    component.employeeForm.controls['email'].setValue('jane.smith@example.com');
  
    // Mock API response
    mockApiService.saveEmployee.and.returnValue(of({}));
  
    // Call save method
    component.handleSave();
  
    // Wait for async operations to complete
    tick();
  
    // Then: Verify saveEmployee was called
    expect(mockApiService.saveEmployee).toHaveBeenCalledWith(
      'dummy-token', 
      '1', 
      'Jane', 
      'Smith', 
      'jane.smith@example.com', 
      '',  // specialization
      false,  // isAdmin
      false   // isActive
    );
  }));
  
  it('should delete employee', fakeAsync(() => {
    // Given:
    const mockEmployee = { id: '1', name: 'John', surname: 'Doe', email: 'john.doe@example.com', phone: '123456789' };
  
    // Mock history state
    Object.defineProperty(window.history, 'state', { value: { employee: mockEmployee } });
  
    // Update the fixture
    fixture.detectChanges();
  
    // Mock API response for delete
    mockApiService.deleteEmployee.and.returnValue(of({}));
  
    // Call delete method
    component.handleDelete();
  
    // Wait for async operations to complete
    tick();
  
    // Then: Verify deleteEmployee was called
    expect(mockApiService.deleteEmployee).toHaveBeenCalledWith('dummy-token', '1');
  }));
});