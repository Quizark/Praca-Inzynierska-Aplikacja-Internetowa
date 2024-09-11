import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-client',
  templateUrl: './editclientscreen.component.html',
  styleUrls: ['./editclientscreen.component.css'],
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule],
})
export class EditclientscreenComponent implements OnInit {
  clientForm!: FormGroup;
  clientId!: string;
  sessionToken!: string;
//SPRAWDZIĆ CZY TE WYKRZYKNIKI NIE PSUJĄ
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiConnectionService: ApiConnectionService
  ) {}

  ngOnInit() {
    
    const sessionToken = this.userService.getSessionToken();
    //POBIERANIE DANYCH O KLIENCIE Z POPRZEDNIEGO EKRANU!!!
    
  }

  handleSave() {
    const { clientName, clientSurname, clientEmail, clientPhone } = this.clientForm.value;
    this.apiConnectionService.saveClient(
      this.clientId,
      clientName,
      clientSurname,
      clientEmail,
      clientPhone,
      this.sessionToken
    ).subscribe(() => {
      this.router.navigate(['/clients']); // Navigate to the clients list or another route
    });
  }

  handleDelete() {
    this.apiConnectionService.deleteClient(this.clientId, this.sessionToken).subscribe(() => {
      this.router.navigate(['/clients']); // Navigate to the clients list or another route
    });
  }

  goBack() {
    this.router.navigate(['/clients']); // Navigate back to the clients list or previous page
  }
}
