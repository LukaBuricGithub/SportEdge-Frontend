import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();
    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn && role === 'Admin') {
      return true;
    }

    this.router.navigate(['/shop/access-denied']);
    return false;
  }
}
