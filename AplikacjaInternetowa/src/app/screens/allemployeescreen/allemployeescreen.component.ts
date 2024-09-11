import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-employee-screen',
  templateUrl: './allemployeescreen.component.html',
  styleUrls: ['./allemployeescreen.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AllemployeescreenComponent implements OnInit {
  employees: any[] = [];
  loading = true;

  constructor(private userService: UserService, private apiConnectionService: ApiConnectionService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.loading = true;
    const sessionToken = this.userService.getSessionToken(); 
  
    // Check if sessionToken is null or undefined
    if (sessionToken) {
      this.apiConnectionService.fetchEmployees(sessionToken).subscribe(
        (data: any[]) => {
          this.employees = data;
          this.loading = false;
        },
        error => {
          console.error('Error fetching employees', error);
          this.loading = false;
        }
      );
    } else {
      console.error('Session token is not available.');
      this.loading = false;
    }
  }

  editEmployee(employee: any): void {
    this.router.navigate(['/edit-employee'], { state: { employee } });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
