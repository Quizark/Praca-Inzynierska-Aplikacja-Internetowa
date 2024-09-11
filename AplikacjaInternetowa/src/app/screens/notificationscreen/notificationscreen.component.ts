import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { Task } from '../../interfaces/Task.interface';

@Component({
  selector: 'app-notification-screen',
  templateUrl: './notificationscreen.component.html',
  styleUrls: ['./notificationscreen.component.css'],
})
export class NotificationscreenComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  tasks: any[] = [];
  filteredTasks: any[] = [];
  searchQuery: string = '';
  private sessionToken!: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiConnectionService,
    private userService: UserService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      searchInput: [''],
    });
  }

  ngOnInit(): void {
    const sessionToken = this.userService.getSessionToken();
    this.loadTasks();

    this.subscriptions.add(
      this.clientForm.get('searchInput')?.valueChanges.subscribe(value => {
        this.searchQuery = value;
        this.handleSearch(value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTasks(): void {
    this.apiService.fetchAllTasks(this.sessionToken).subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
      },
      error => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  handleSearch(query: string): void {
    if (query) {
      this.filteredTasks = this.tasks.filter(task =>
        task.deviceCodeNumber.toLowerCase().includes(query.toLowerCase()) ||
        task.taskDescription.toLowerCase().includes(query.toLowerCase()) ||
        task.employeeEmail.toLowerCase().includes(query.toLowerCase()) ||
        (task.isDone ? 'true' : 'false').includes(query.toLowerCase())
      );
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  deleteTask(taskId: string): void {
    this.apiService.deleteTask(this.sessionToken, taskId).subscribe(() => {
      this.loadTasks();
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
