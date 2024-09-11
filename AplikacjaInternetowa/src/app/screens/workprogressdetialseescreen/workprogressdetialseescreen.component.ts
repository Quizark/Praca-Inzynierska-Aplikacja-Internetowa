import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { ApiConnectionService } from '../../services/api-connection.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-work-progress-detail-see',
  templateUrl: './workprogressdetialseescreen.component.html',
  styleUrls: ['./workprogressdetialseescreen.component.css']
})
export class WorkprogressdetialseescreenComponent implements OnInit, OnDestroy {
  deviceId!: string;
  sessionToken!: string;
  deviceDetails: any[] = [];
  photos: string[] = [];
  showPhotos = false;
  loading = false;
  photosLoaded = false; // Nowy stan do śledzenia, czy zdjęcia zostały już pobrane
  private routeSub!: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiConnectionService: ApiConnectionService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.deviceId = params['deviceId'];
      const sessionToken = this.userService.getSessionToken();
      this.fetchDeviceDetails();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  fetchDeviceDetails(): void {
    this.apiConnectionService.fetchDeviceDetails(this.sessionToken, this.deviceId)
      .subscribe(details => {
        this.deviceDetails = details;
      });
  }

  fetchPhotos(): void {
    this.loading = true;
    this.apiConnectionService.fetchDevicePhotos(this.sessionToken, this.deviceId)
      .subscribe(
        photos => {
          this.photos = photos;
          this.photosLoaded = true;
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }

  togglePhotos(): void {
    if (!this.photosLoaded) {
      this.fetchPhotos();
    }
    this.showPhotos = !this.showPhotos;
  }

  refresh(): void {
    this.fetchDeviceDetails();
    if (this.photosLoaded) {
      this.fetchPhotos();
    }
  }

  navigateToUpdate(): void {
    this.router.navigate(['/work-update', { deviceId: this.deviceId }]);
  }

  goBack(): void {
    this.router.navigate(['../']);
  }

  viewFullScreen(photoUrl: string): void {
    this.router.navigate(['/full-screen-image'], { queryParams: { photoUrl } });
  }
}