import { Component, OnInit, ChangeDetectionStrategy, signal} from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import {FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...MaterialModules,FormsModule, ReactiveFormsModule,CommonModule,RouterModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  //Novo dodano
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
  errorMessage: string |null = null;
  
  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router ){ }

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
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        const userData = this.authService.decodeToken();
        console.log('Login successful:', userData);
        //this.router.navigate(['/dashboard']); // Adjust the route
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
        console.error('Login failed', err);
      }
    });
  }
  
}
