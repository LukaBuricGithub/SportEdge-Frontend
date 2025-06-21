import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ForgotPasswordRequestDTO } from '../../models/ForgotPasswordRequestDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [...MaterialModules,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})


export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!:FormGroup;

  constructor(private fb:FormBuilder, private userService:UserService, private router:Router){ }
  

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() : void 
  {
    if(this.forgotPasswordForm.invalid) return;

    const formValue = this.forgotPasswordForm.value;

    const payload : ForgotPasswordRequestDTO = {
      Email: formValue.email
    };

    this.userService.userForgotPassword(payload).subscribe({
      next: (response) => {
      console.log('Forgot password request successful:', response);
      this.router.navigate(['/reset-password']);
      },
      error: (error) => {
        console.error('Forgot password request failed:', error);
        // Optionally: Show error message to the user
      }
    })
  }

}