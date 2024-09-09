import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';  // Upewnij się, że ścieżka jest poprawna
import { UserService } from '../user-service.service';  // Upewnij się, że ścieżka jest poprawna
import { MatSnackBar } from '@angular/material/snack-bar';  // Użyj Angular Material do powiadomień

@Component({
  selector: 'app-login-screen',
  templateUrl: './loginscreen.component.html',
  styleUrls: ['./loginscreen.component.css'],
  standalone: true,
  imports:[ReactiveFormsModule],
})
export class LoginScreenComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  handleSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login Data:', { email, password }); // Dodaj logowanie
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login Response:', response); // Dodaj logowanie
          this.userService.setUserEmail(email);
          this.userService.setSessionToken(response.sessionToken);
          this.snackBar.open('Login successful', 'Close', { duration: 3000 });
          this.router.navigate(['/home']); // Lub inna strona po zalogowaniu
        },
        error: (error) => {
          console.error('Login Error:', error); // Dodaj logowanie
          this.snackBar.open('Login failed: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
