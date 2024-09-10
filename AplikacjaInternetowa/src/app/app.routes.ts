import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './homescreen/homescreen.component';
import { LoginScreenComponent } from './loginscreen/loginscreen.component';
import { RegisterscreenComponent } from './registerscreen/registerscreen.component';
import { AddnewclientscreenComponent } from './addnewclientscreen/addnewclientscreen.component';
import { AddreportscreenComponent } from './addreportscreen/addreportscreen.component';
import { WorkprogressscreenComponent } from './workprogressscreen/workprogressscreen.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginScreenComponent },
  { path: 'register', component: RegisterscreenComponent}, 
  { path: 'addnewclientscreen', component: AddnewclientscreenComponent, canActivate: [AuthGuard]},
  { path: 'addreportscreen', component: AddreportscreenComponent, canActivate: [AuthGuard]},
  { path: 'workprogressscreen', component: WorkprogressscreenComponent, canActivate: [AuthGuard]},
  
  // inne ścieżki
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
