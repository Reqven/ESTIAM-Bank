import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private user: UserService,
    private domSanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry
  ) {
    iconRegistry.addSvgIcon('angular', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/angular.svg'));
  }

  ngOnInit(): void {}
}
