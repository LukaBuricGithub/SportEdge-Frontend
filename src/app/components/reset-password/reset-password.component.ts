import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ResetPasswordRequestDTO } from '../../models/ResetPasswordRequestDTO';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports: [...MaterialModules,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})

export class ResetPasswordComponent implements OnInit {
  
  resetPasswordForm!:FormGroup


  constructor(private fb:FormBuilder, private userService:UserService, private router:Router,private snackBar:MatSnackBar){ }
  
  ngOnInit(): void 
  {
    this.resetPasswordForm = this.fb.group(
      {
        token: ['', [Validators.required]],
        newPassword1: ['', [Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
        newPassword2: ['', Validators.required]
      },
      {
        validators: [this.passwordMatchValidator]
      }
    );
  }


  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null 
  {
    const pass = group.get('newPassword1')?.value;
    const confirmPass = group.get('newPassword2')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }


  onSubmit(): void  
  { 

    if(this.resetPasswordForm.invalid)
    {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return; 
    }

    
    const formValue = this.resetPasswordForm.value;

    const payload : ResetPasswordRequestDTO = {
      Token: formValue.token,
      NewPassword:formValue.newPassword1
    };

    this.userService.userResetPassword(payload).subscribe({
       next: (response) => {
      console.log('Password reset successful:', response);
      this.router.navigate(['/shop/login']);
      },
      error: (error) => {
        console.error('Password reset failed:', error);
        this.snackBar.open('Password reset request failed. Please try again.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
        });
      }
    });
  }
}