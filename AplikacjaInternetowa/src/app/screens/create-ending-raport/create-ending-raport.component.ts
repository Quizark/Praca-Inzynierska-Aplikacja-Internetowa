import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ApiConnectionService } from '../../services/api-connection.service';
import { UserService } from '../../services/user-service.service';
import { Device } from '../../interfaces/Device.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-ending-raport',
  standalone: true,
  templateUrl: './create-ending-raport.component.html',
  styleUrls: ['./create-ending-raport.component.css'],
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule],
})
export class CreateEndingRaportComponent implements OnInit {

  endingRaportForm: FormGroup;
  devices: Device[] = [];
  selectedDeviceCode: string = 'None';
  sessionToken: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiConnectionService,
    private userService: UserService,
  ) {
    this.endingRaportForm = this.fb.group({
      selectedDevice: [''],
      raportDetails: [''],
    });
  }

  ngOnInit(): void {
    this.userService.sessionToken$.subscribe(token => {
      this.sessionToken = token || '';
      this.loadInitialData();
    });
  }

  loadInitialData(): void {
    if (!this.sessionToken) {
      console.error('No session token available.');
      return;
    }

    this.apiService.fetchDevices(this.sessionToken).subscribe({
      next: data => {
        this.devices = data;
      },
      error: err => console.error('Error fetching devices:', err),
    });

    this.endingRaportForm.get('selectedDevice')?.valueChanges.subscribe(value => {
      this.selectedDeviceCode = this.devices.find(d => d.id === value)?.codeNumber || 'None';
    });
  }

  updateDevice(): void {
    const selectedDeviceId = this.endingRaportForm.get('selectedDevice')?.value;

    if (!selectedDeviceId) {
      console.error('No device selected.');
      return;
    }

    this.router.navigate(['Workprogressdetialseescreen'], {
      queryParams: { deviceId: selectedDeviceId },
    });
  }

  addNewPhotos(): void {
    if (!this.selectedDeviceCode || this.selectedDeviceCode === 'None') {
      console.error('No device selected for adding photos.');
      return;
    }

    const selectedDevice = this.devices.find(device => device.codeNumber === this.selectedDeviceCode);

    if (!selectedDevice) {
      console.error('Selected device not found in the device list.');
      return;
    }

    const reportData = { Device: selectedDevice }; // Ustaw właściwość Device
    console.log('Report data:', reportData);

    this.router.navigate(['/Addreportphotosscreen'], { state: { reportData } });
  }

  createEndingRaport() {
    if (!this.selectedDeviceCode || this.selectedDeviceCode === 'None') {
      console.error('No device selected for adding photos.');
      return;
    } else {
      const selectedDevice = this.devices.find(device => device.codeNumber === this.selectedDeviceCode);

      if (!selectedDevice) {
        console.error('Selected device not found in the device list.');
        return;
      }
      
      this.apiService.createEndingRaport(this.sessionToken, selectedDevice.id).subscribe({
        next: (data: Blob) => {
          // Przetwarzanie odpowiedzi, np. pobieranie pliku PDF
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ending-raport.pdf'; // Nazwa pliku PDF
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error fetching report:', err);
        }
      });
    }
  }
}
