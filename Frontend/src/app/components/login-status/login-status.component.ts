import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit{
  isAuthenticated: boolean| undefined = false;
  userFullName: string = '';

  storage: Storage = sessionStorage;
  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
    ){}
  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(
      (result)=>{
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {
    if(this.isAuthenticated){
      this.oktaAuth.getUser().then(
        data=>{
          this.userFullName = data.name as string;
          const emailId = data.email;
          this.storage.setItem('userEmail', JSON.stringify(emailId));
        }
      );
    }
  }
  logOut(){
    this.oktaAuth.signOut();
  }
}
