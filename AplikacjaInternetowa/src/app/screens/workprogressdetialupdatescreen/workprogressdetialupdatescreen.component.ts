import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-progress-detail-update',
  templateUrl: './workprogressdetialupdatescreen.component.html',
  styleUrls: ['./workprogressdetialupdatescreen.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class WorkprogressdetialupdatescreenComponent implements OnInit {
  updateForm: FormGroup;
  deviceId!: string;
  sessionToken!: string;
  userEmail!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiService: ApiConnectionService
  ) {
    this.updateForm = this.fb.group({
      description: ['']
    });
  }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId') || '';
    const sessionToken = this.userService.getSessionToken();
    const userEmail = this.userService.getUserEmail();
    this.updateForm.patchValue({ description: '' });
  }

  handleSubmit(): void {
    const description = this.updateForm.get('description')?.value;
    const employee = this.userEmail || '';

    this.apiService.updateDevice(this.sessionToken, this.deviceId, description, employee)
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (error) => console.error('Error:', error)
      });
  }

  goBack(): void {
    this.router.navigate(['/previous-page']);
  }
}
