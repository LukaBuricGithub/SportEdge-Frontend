import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';

import { MatSnackBar } from '@angular/material/snack-bar';


import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignUpRequestDTO } from '../../models/SignUpRequestDTO';
import { UserService } from '../../services/user.service';




@Component({
  selector: 'app-sign-up',
  standalone:true,
  imports: [...MaterialModules,FormsModule,ReactiveFormsModule,CommonModule,RouterModule,RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})


export class SignUpComponent implements OnInit {

  signUpForm!:FormGroup;

  constructor(private fb:FormBuilder, private router:Router, private userService:UserService, private snackBar:MatSnackBar){ }
  

  ngOnInit(): void 
  {
    this.signUpForm = this.fb.group(
  {
    firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password1: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    ]],
    password2: ['', Validators.required],
    country: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    city: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    address: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    dateOfBirth: ['', Validators.required],
  },
  {
    validators: [this.passwordMatchValidator]
  }
);
  }

  
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null 
  {
    const pass = group.get('password1')?.value;
    const confirmPass = group.get('password2')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  onSubmit(): void  
  { 
    if(this.signUpForm.invalid)
    {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return; 
    }
    
    const formValue = this.signUpForm.value;

    const payload: SignUpRequestDTO = {
      FirstName: formValue.firstName,
      LastName: formValue.lastName,
      Email: formValue.email,
      Password: formValue.password1,
      DateOfBirth: new Date(formValue.dateOfBirth).toISOString().split('T')[0], // e.g. "1990-01-01"
      Country: formValue.country,
      City: formValue.city,
      Address: formValue.address,
    };

    this.userService.userSignUp(payload).subscribe({
      next: (response) => {
      console.log('Registration successful:', response);
      this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.snackBar.open('Registration failed. Please try again.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      }
    });


  }

}
