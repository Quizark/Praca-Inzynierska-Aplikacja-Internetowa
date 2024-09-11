import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-progress-detail-screen',
  templateUrl: './workprogressdetialscreen.component.html',
  styleUrls: ['./workprogressdetialscreen.component.css'],
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class WorkprogressdetialscreenComponent implements OnInit {
  deviceData: any;
  personData: any = {};
  clientForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      clientName: [''],
      clientSurname: [''],
      clientEmail: [''],
      clientPhone: ['']
    });
  }

  ngOnInit(): void {
    //Pobieranie danych z poprzedniego ekranu!
    this.deviceData = history.state.device;
    console.log('Received device data:', this.deviceData);
  }

  updateForm(): void {
    this.clientForm.patchValue({
      clientName: this.personData.name || '',
      clientSurname: this.personData.surname || '',
      clientEmail: this.deviceData[0]?.email || '',
      clientPhone: this.personData.phone || 'N/A'
    });
  }

  navigateToWorkSee(deviceId: string): void {
    this.router.navigate(['Workprogressdetialseescreen'], { queryParams: { deviceId } });
  }

  goBack(): void {
    this.router.navigate(['..']);
  }
}
