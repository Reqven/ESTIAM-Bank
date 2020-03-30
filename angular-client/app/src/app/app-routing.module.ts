import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {AccountComponent} from './pages/account/account.component';
import {AuthenticatedGuard} from './guards/authenticated.guard';
import {NotAuthenticatedGuard} from './guards/not-authenticated.guard';
import {GlobalGuard} from './guards/global.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [GlobalGuard],
    canActivateChild: [GlobalGuard],
    children: [
      { path: '',         component: HomeComponent                                           },
      { path: 'login',    component: LoginComponent,    canActivate: [NotAuthenticatedGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [NotAuthenticatedGuard] },
      { path: 'account',  component: AccountComponent,  canActivate: [AuthenticatedGuard]    },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
