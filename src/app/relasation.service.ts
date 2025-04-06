import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RelasationService {

  public url = 'http://localhost:8081/';

  constructor(private http: HttpClient) { }

  // Enregistrer un nouvel utilisateur
  creatNewUser(user: any) {
    return this.http.post(this.url + 'api/auth/register', user);
  }

  // Connexion de l'utilisateur avec stockage du token
  loginUser(user: any) {
    return this.http.post<{ token: string }>(this.url + 'api/auth/login', user)
      .pipe(
        tap((response: { token: string }) => {
          localStorage.setItem('token', response.token); // Sauvegarde du token dans localStorage
        })
      );
  }

  // Récupérer tous les utilisateurs (requête protégée par le token)
  getAllUser() {
    return this.http.get(this.url + 'users');
  }

  // Supprimer un utilisateur
  deleteUser(id: any) {
    return this.http.delete(this.url + 'users/' + id);
  }
}
