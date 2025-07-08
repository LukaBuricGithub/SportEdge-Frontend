import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../services/brand.service';
import { CreateBrandRequestDTO } from '../../models/CreateBrandRequestDTO';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/AuthenticationServices/auth.service';


@Component({
  selector: 'app-create-brand',
  standalone: true,
  imports: [...MaterialModules,FormsModule,ReactiveFormsModule,CommonModule,RouterOutlet,RouterModule,RouterLink],
  templateUrl: './create-brand.component.html',
  styleUrl: './create-brand.component.scss'
})
export class CreateBrandComponent implements OnInit {

  createBrandForm!:FormGroup;

  constructor(private fb:FormBuilder, private brandService:BrandService,private router:Router,private snackBar:MatSnackBar
    ,private authService:AuthService) {}

  ngOnInit(): void {
    this.createBrandForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  onSubmit(): void  
  { 
    if(this.createBrandForm.invalid)
    {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return; 
    }
    
    const formValue = this.createBrandForm.value;

    const payload: CreateBrandRequestDTO = {
      name:formValue.name
    };


    console.log('JWT Token from AuthService:', this.authService.getToken());


    this.brandService.createBrand(payload).subscribe({
      next:(response) => {
      console.log('Creation of brand successful:', response);
       this.router.navigate(['/admin/brands']);
      },
      error:(error) => {
          console.error('Creation of brand failed:', error);
          this.snackBar.open('Creation of brand failed. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onBack() : void 
  {
    this.router.navigate(['/admin/brands']);
  }

}
