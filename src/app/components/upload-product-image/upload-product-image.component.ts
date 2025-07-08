import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { UserService } from '../../services/user.service';
import { UpdateUserRequestDTO } from '../../models/UpdateUserRequestDTO';
import { ProductService } from '../../services/product.service';
import { ProductDTO } from '../../models/ProductDTO';

@Component({
  selector: 'app-upload-product-image',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterOutlet,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './upload-product-image.component.html',
  styleUrl: './upload-product-image.component.scss'
})
export class UploadProductImageComponent implements OnInit {

  uploadProductImage!:FormGroup;
  productId!:number;
  selectedFiles: File[] = [];
  product!:ProductDTO;


  constructor(private fb:FormBuilder, private productService:ProductService,private router:Router,private snackBar:MatSnackBar
  ,private authService:AuthService,private route:ActivatedRoute) {}



  

  ngOnInit(): void 
  {
     this.route.queryParams.subscribe(params => {
      this.productId = +params['productId'];
      console.log('Received productId:', this.productId);

      this.productService.getProductById(this.productId).subscribe((x:ProductDTO) => {
        this.product = x;
        console.log("Received product data:",  this.product)
      })
    });

  }

  onFileSelected(event: any) 
  {
    this.selectedFiles = Array.from(event.target.files);
  }

  onUpload(productId: number) 
  {

    if (this.selectedFiles.length === 0) {
    this.snackBar.open('Please select at least one file before uploading.', 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
    return; 
  }



    console.log("I am in upload function");
    this.productService.uploadProductImages(productId, this.selectedFiles).subscribe({
      next: (res) => {
        console.log('Images uploaded successfully', res);
        this.router.navigate(['/admin/details-product'], {
          queryParams: {productId:productId}
        });
      },
      error: (error) => {
         let errorMessage = 'An unknown error occurred.';

          switch(error.status) 
          {
            default:
               errorMessage = error?.error?.message || 'Unexpected error occurred.';
              break;
          }


          console.error('Failed to upload images', error);
          this.snackBar.open(errorMessage, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
          });



      },
    });
  }

 onBack(productId:number) : void 
  {
      this.router.navigate(['/admin/details-product'], {
        queryParams: {productId:productId}
      });
  }

  onClearFiles(fileInput: HTMLInputElement): void 
  {
    this.selectedFiles = [];
    fileInput.value = '';
  }

}
