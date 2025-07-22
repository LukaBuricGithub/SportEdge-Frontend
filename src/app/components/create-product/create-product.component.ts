
import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../services/brand.service';
import { CreateBrandRequestDTO } from '../../models/CreateBrandRequestDTO';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { BrandDTO } from '../../models/BrandDTO';
import { GenderDTO } from '../../models/GenderDTO';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CategoryDTO } from '../../models/CategoryDTO';
import { CreateProductRequestDTO } from '../../models/CreateProductRequestDTO';

@Component({
  selector: 'app-create-product',
  standalone:true,
  imports: [...MaterialModules,FormsModule,ReactiveFormsModule,CommonModule,RouterOutlet,RouterModule,RouterLink],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit {

  createProductForm!:FormGroup;
  categories: { id: number; displayName: string }[] = [];
  brands: BrandDTO[] = [];
  genders: GenderDTO[] = [];
  
  constructor(private fb:FormBuilder, private brandService:BrandService,private router:Router,private snackBar:MatSnackBar
      ,private authService:AuthService, private productService:ProductService,private categoryService:CategoryService) {}
  
  
  
  ngOnInit(): void 
  {
    this.createProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      shortDescription: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
      price: [null, [Validators.required, Validators.min(1),Validators.max(10000)]],
      discountedPrice: [null],
      brandId: [null, Validators.required],
      genderId: [null, Validators.required],
      categoryIds: [[], Validators.required]
    }
  );

    this.createProductForm.valueChanges.subscribe(() => {
    this.discountedPriceValidator()(this.createProductForm);
    });

  this.loadData();

  }

  loadData() {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = this.buildHierarchyLabels(categories);
    });

    this.brandService.getAllBrands().subscribe(brands => {
      this.brands = brands;
    });

    this.productService.getAllGendersCategory().subscribe(genders => {
      this.genders = genders;
    });
  }


discountedPriceValidator() {
  return (form: AbstractControl) => {
    const priceControl = form.get('price');
    const discountedPriceControl = form.get('discountedPrice');

    if (!priceControl || !discountedPriceControl) {
      return null;
    }

    const price = priceControl.value;
    const discountedPrice = discountedPriceControl.value;

    const errors = discountedPriceControl.errors || {};
    delete errors['discountedPriceInvalid'];

    if (
      discountedPrice !== null &&
      discountedPrice !== undefined &&
      discountedPrice !== ''
    ) {
      if (
        discountedPrice <= 0 || 
        discountedPrice >= price
      ) {
        discountedPriceControl.setErrors({
          ...errors,
          discountedPriceInvalid: true
        });
      } else if (Object.keys(errors).length === 0) {
        discountedPriceControl.setErrors(null);
      } else {
        discountedPriceControl.setErrors(errors);
      }
    } else if (Object.keys(errors).length === 0) {
      discountedPriceControl.setErrors(null);
    } else {
      discountedPriceControl.setErrors(errors);
    }

    return null;
  };
}




    private buildHierarchyLabels(categories: CategoryDTO[]): { id: number; displayName: string }[] {
    const map = new Map<number, CategoryDTO>();
    categories.forEach(c => map.set(c.id, c));

    const result: { id: number; displayName: string }[] = [];

    for (const category of categories) {
      const labelParts: string[] = [];
      let current: CategoryDTO | undefined = category;

      const visited = new Set<number>();
      while (current && current.parentCategoriesIDs.length > 0) {
        const parentId = current.parentCategoriesIDs[0];
        if (visited.has(parentId)) break;
        visited.add(parentId);

        const parent = map.get(parentId);
        if (parent) {
          labelParts.unshift(parent.name);
          current = parent;
        } else {
          break;
        }
      }

      labelParts.push(category.name);
      result.push({ id: category.id, displayName: labelParts.join(' → ') });
    }

    return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  onSubmit(): void {
    if (this.createProductForm.invalid) {
      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const formValue = this.createProductForm.value;
   
    const payload : CreateProductRequestDTO = {
        name:formValue.name,
        shortDescription:formValue.shortDescription,
        price:formValue.price,
        discountedPrice:formValue.discountedPrice,
        categoryIds:formValue.categoryIds,
        brandId:formValue.brandId,
        genderId:formValue.genderId
    };

    this.productService.createProduct(payload).subscribe({
      next:(response) => {
        console.log('Creation of product successful:', response);
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.log('Creation of product failed:', error);
        this.snackBar.open('Creation of product failed. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }



  onBack(): void {
    this.router.navigate(['/admin/products']);
  }

}
