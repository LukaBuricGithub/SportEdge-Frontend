import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { UserService } from '../../services/user.service';
import { UpdateUserRequestDTO } from '../../models/UpdateUserRequestDTO';
import { ProductService } from '../../services/product.service';
import { ProductVariationDTO } from '../../models/ProductVariationDTO';
import { UpdateMultipleProductVariationsRequestDto } from '../../models/UpdateMultipleProductVariationsRequestDto';

@Component({
  selector: 'app-update-product-variations-quantity',
  standalone: true,
  imports: [...MaterialModules,RouterModule,RouterOutlet,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './update-product-variations-quantity.component.html',
  styleUrl: './update-product-variations-quantity.component.scss'
})
export class UpdateProductVariationsQuantityComponent implements OnInit {
  
  productId!: number;
  variations: ProductVariationDTO[] = [];
  updateProductVariationsForm!: FormGroup;
  
   constructor(private fb:FormBuilder, private productService:ProductService,private router:Router,private snackBar:MatSnackBar
  ,private authService:AuthService,private route:ActivatedRoute) {}
  
  
  ngOnInit(): void 
  {
      this.route.queryParams.subscribe(params => {
      this.productId = +params['productId'];
      console.log('Received productId:', this.productId);
    });

    this.productService.getAllProductVariationsForProduct(this.productId).subscribe( x => {
      this.variations = x;
      this.initializeForm();
    });
  }


  initializeForm(): void {
  this.updateProductVariationsForm = this.fb.group({
    variations: this.fb.array(this.variations.map(variation => {
      const group = this.fb.group({
        id: [variation.id],
        quantityInStock: [variation.quantityInStock, [Validators.required, Validators.min(0)]],
        productId: [variation.productId],
        sizeOptionId: [variation.sizeOptionId],
        sizeOptionName: [variation.sizeOptionName]
      });

      group.get('quantityInStock')?.valueChanges.subscribe(value => {
        if (Object.is(value, -0)) {
          group.get('quantityInStock')?.setValue(0, { emitEvent: false });
        }
      });

      return group;
    }))
  });
}


   get variationsFormArray(): FormArray {
    return this.updateProductVariationsForm.get('variations') as FormArray;
  }

  onSubmit(): void {
     if (this.updateProductVariationsForm.invalid) {
        this.snackBar.open('Please fix the errors in the form.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }

    const request: UpdateMultipleProductVariationsRequestDto = {
      variations: this.variationsFormArray.value.map((item: any) => ({
        id: item.id,
        quantityInStock: item.quantityInStock,
        productId: item.productId,
        sizeOptionId: item.sizeOptionId
      }))
    };

    this.productService.updateProductVariationBatch(request).subscribe({
     next: () => {
          this.router.navigate(['/admin/details-product'], {
            queryParams: { productId: this.productId }
          });
      },
      error: (error) => {
        let errorMessage = 'An unknown error occurred.';
          switch (error.status) {
            case 404:
              errorMessage = error?.error?.message || 'Cannot find product to update.';
              break;
            default:
              errorMessage = error?.error?.message || 'Unexpected error occurred.';
              break;
          }
          console.error('Update of product failed:', error);
          this.snackBar.open(errorMessage, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
      }
    });
  }

  onBack(productId:number) : void 
  {
      this.router.navigate(['/admin/details-product'], {
        queryParams: {productId:productId}
      });
  }

}
