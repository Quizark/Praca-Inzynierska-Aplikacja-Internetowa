import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
@Component({
  selector: 'app-edit-employee-screen',
  standalone: true,
  templateUrl: './editemployeescreen.component.html',
  styleUrls: ['./editemployeescreen.component.css']
})
export class EditemployeescreenComponent implements OnInit {
  employeeForm!: FormGroup;
  isAdmin: boolean = false;
  employeeId: string = '';
  sessionToken: string = '';
  constructor(
    private fb: FormBuilder,
    private apiService: ApiConnectionService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sessionToken = this.userService.getSessionToken();
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      //Pobierz dane użytkownika
    });

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialization: ['']
    });
  }

  loadEmployeeData(id: number): void {
    //Pobieranie danych o pracowniku z poprzedniego ekranu!!!
  }

  handleToggleAdmin(): void {
    this.apiService.toggleAdmin(this.sessionToken, this.employeeId, this.employeeForm.value.name,this.employeeForm.value.surname,this.employeeForm.value.email,this.employeeForm.value.specialization, this.isAdmin).subscribe(() => {
      this.isAdmin = !this.isAdmin;
    });
  }

  handleSave(): void {
    this.apiService.saveEmployee(this.sessionToken, this.employeeId, this.employeeForm.value.name,this.employeeForm.value.surname,this.employeeForm.value.email,this.employeeForm.value.specialization, this.isAdmin).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }

  handleDelete(): void {
    this.apiService.deleteEmployee(this.sessionToken, this.employeeId).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
