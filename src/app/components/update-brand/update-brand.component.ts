import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { UpdateBrandRequestDTO } from '../../models/UpdateBrandRequestDTO';
import { ActivatedRoute } from '@angular/router';
import { BrandDTO } from '../../models/BrandDTO';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-update-brand',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterOutlet,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './update-brand.component.html',
  styleUrl: './update-brand.component.scss'
})


export class UpdateBrandComponent implements OnInit {
  

  brandId!: number;
  
  brand!:BrandDTO;

  updateBrandForm!:FormGroup;
  
  constructor(private fb:FormBuilder, private brandService:BrandService,private router:Router,private snackBar:MatSnackBar
  ,private authService:AuthService,private route:ActivatedRoute) {}
  
  ngOnInit(): void {
  this.updateBrandForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
  });

  this.route.queryParams.subscribe(params => {
    this.brandId = +params['brandId'];
    console.log('Received brandId:', this.brandId);

    this.brandService.getBrandById(this.brandId).subscribe(brand => {
      this.brand = brand;
      this.updateBrandForm.patchValue({ name: this.brand.name });
    });
  });
}


    onSubmit(): void  
    { 
      if(this.updateBrandForm.invalid)
      {
        this.snackBar.open('Please fix the errors in the form.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return; 
      }
      
      const formValue = this.updateBrandForm.value;
  
      const payload: UpdateBrandRequestDTO  = {
        name:formValue.name
      };
  
  
      console.log('JWT Token from AuthService:', this.authService.getToken());
  
  
      this.brandService.updateBrand(this.brandId,payload).subscribe({
        next:(response) => {
        console.log('Update of brand successful:', response);

         this.router.navigate(['/admin/details-brand'], {
          queryParams: {brandId:this.brandId}
        });
      },
        error:(error) => {

            let errorMessage = 'An unknown error occurred.';

            switch(error.status) 
            {
              case 400:
                errorMessage = error?.error?.message || 'Cannot update brand because it has related objects.';
                break;
              default:
                errorMessage = error?.error?.message || 'Unexpected error occurred.';
                break;
            }

            console.error('Update of brand failed:', error);
            this.snackBar.open(errorMessage, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  
  onBack(brandId:number) : void 
  {
    this.router.navigate(['/admin/details-brand'], {
        queryParams: {brandId:brandId}
      });
  }
}
