import { Router } from '@angular/router';
import { RelasationService } from './../../relasation.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    identifiant: "",
    password: ""
  };


  entrUser() {
    this._login.loginUser(this.user)
    .subscribe(
      (res: any) => {
        console.log('res',res)
        localStorage.setItem('token',res.token)
        this.router.navigateByUrl('/dashboard')
      },
      (error) => {
        console.log(error);
      }
    );
  }
    
  constructor(public _login: RelasationService, public router: Router) { }
  
}
