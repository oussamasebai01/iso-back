import { RelasationService } from './../../relasation.service';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 

  user = {
    identifiant: "",
    nom: "",
    email: "",
    password: "",
    roles: ["USER"]
  
    
  };

  ajouterUser() {
    this._relasation.creatNewUser(this.user)
    .subscribe(
      res => {
        console.log(res);
        this.user = {
          identifiant: "",
          nom: "",
          email: "",
          password: "",
          roles: ["USER"]
        };
      },
      err => {
        console.log(err);
      }
    );
  }
    
  constructor(@Inject(RelasationService) public _relasation: RelasationService) { }
}
