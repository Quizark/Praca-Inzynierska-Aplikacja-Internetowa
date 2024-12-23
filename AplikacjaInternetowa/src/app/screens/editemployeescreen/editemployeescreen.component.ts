import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-employee-screen',
  standalone: true,
  templateUrl: './editemployeescreen.component.html',
  styleUrls: ['./editemployeescreen.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class EditemployeescreenComponent implements OnInit {
  employeeForm!: FormGroup;
  isAdmin: boolean = false;
  employeeId: string = '';
  sessionToken: string = '';
  employee: any = {};
  isActive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiConnectionService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sessionToken = this.userService.getSessionToken() || '';

    // Pobranie danych pracownika z przekazanych parametrów lub historii stanu
    this.route.params.subscribe(params => {
      this.employeeId = params['id'] || '';
    });
    this.employee = history.state.employee || {};

    this.employeeForm = this.fb.group({
      name: [this.employee.name || '', Validators.required],
      surname: [this.employee.surname || '', Validators.required],
      email: [this.employee.email || '', [Validators.required, Validators.email]],
      specialization: [this.employee.specialization || '']
    });

    this.isAdmin = this.employee.isAdmin || false;
    this.isActive = this.employee.isActive || false;
  }

  handleToggleAdmin(): void {
    this.apiService.toggleAdmin(this.sessionToken, this.employee.id, this.employeeForm.value.name, this.employeeForm.value.surname, this.employeeForm.value.email, this.employeeForm.value.specialization, this.isAdmin, this.isActive).subscribe(() => {
      this.isAdmin = !this.isAdmin;
    });
    console.log(this.isAdmin);
  }

  handleToggleActive(): void {
    this.apiService.toggleActive(this.sessionToken, this.employee.id, this.employeeForm.value.name, this.employeeForm.value.surname, this.employeeForm.value.email, this.employeeForm.value.specialization, this.isAdmin, this.isActive).subscribe(() => {
      this.isActive = !this.isActive;
    });
    console.log(this.isActive);
  }

  handleSave(): void {
      this.apiService.saveEmployee(this.sessionToken, this.employee.id, this.employeeForm.value.name, this.employeeForm.value.surname, this.employeeForm.value.email, this.employeeForm.value.specialization, this.isAdmin, this.isActive).subscribe(() => {
      this.goBack();
    });
  }



  handleDelete(): void {
    this.apiService.deleteEmployee(this.sessionToken, this.employeeId).subscribe(() => {
      this.goBack();
    });
  }

  prepareEmployeeData(): any {
    return {
      name: this.employeeForm.value.name,
      surname: this.employeeForm.value.surname,
      email: this.employeeForm.value.email,
      specialization: this.employeeForm.value.specialization,
      isAdmin: this.isAdmin
    };
  }

  goBack(): void {
    window.history.back();
  }
}
