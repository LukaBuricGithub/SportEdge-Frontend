import { Component, OnInit, ChangeDetectionStrategy, signal} from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...MaterialModules,FormsModule, ReactiveFormsModule,CommonModule,RouterModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class LoginComponent implements OnInit {

  hide = signal(true);
  clickEvent(event: MouseEvent) 
  {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  loginForm!:FormGroup;
  //errorMessage: string |null = null;
  
  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router,
    private snackBar:MatSnackBar
   ){ }

  ngOnInit(): void 
  {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public enableSubmitBtn() : boolean
  {
    return this.loginForm.valid;
  }

  
  onSubmit(): void 
  {

     if(this.loginForm.invalid)
    {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return; 
    }

    const credentials = this.loginForm.value;


    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        const userData = this.authService.decodeToken();
        console.log('Login successful:', userData);
        this.router.navigate(['/shop/index']);
      },
      error: (err) => {
        let errorMessage = 'An unknown error occurred.';
          switch (err.status) {
            case 400:
              errorMessage = err?.error?.message || 'Invalid email or password.';
              break;
            default:
              errorMessage = err?.error?.message || 'Invalid email or password.';
              break;
        }

        console.error('Login failed', err);
           this.snackBar.open(errorMessage, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
}
