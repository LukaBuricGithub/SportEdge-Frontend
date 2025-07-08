import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ForgotPasswordRequestDTO } from '../../models/ForgotPasswordRequestDTO';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [...MaterialModules,FormsModule,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})


export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!:FormGroup;

  constructor(private fb:FormBuilder, private userService:UserService, private router:Router,private snackBar:MatSnackBar){ }
  

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() : void 
  {

    if(this.forgotPasswordForm.invalid)
    {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return; 
    }


    const formValue = this.forgotPasswordForm.value;

    const payload : ForgotPasswordRequestDTO = {
      Email: formValue.email
    };

    this.userService.userForgotPassword(payload).subscribe({
      next: (response) => {
      console.log('Forgot password request successful:', response);
      this.router.navigate(['/shop/reset-password']);
      },
      error: (error) => {
        console.error('Forgot password request failed:', error);
        this.snackBar.open('Forgot password request failed. Please try again.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
        });
      }
    })
  }

}