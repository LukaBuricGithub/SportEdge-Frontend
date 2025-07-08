import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { BrandDTO } from '../../models/BrandDTO';
import { CategoryDTO } from '../../models/CategoryDTO';
import { ProductDTO } from '../../models/ProductDTO';
import { UpdateProductRequestDTO } from '../../models/UpdateProductRequestDTO';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-product',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterOutlet,ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {

  updateProductForm!: FormGroup;
  productId!: number;
  product!: ProductDTO;
  categories: { id: number; displayName: string }[] = [];
  brands: BrandDTO[] = [];

  constructor( private fb: FormBuilder, private productService: ProductService, private brandService: BrandService, private categoryService: CategoryService,
    private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {}



/**
 *   constructor(private router:Router,private productService:ProductService,private route:ActivatedRoute,private dialog:MatDialog,
  private snackBar:MatSnackBar) {}
  
  productId!:number;
  product!:ProductDTO;


  ngOnInit(): void 
  {
      this.route.queryParams.subscribe(params => {
      this.productId = +params['productId'];
      console.log('Received productId:', this.productId);

      this.productService.getProductById(this.productId).subscribe((x:ProductDTO) => {
        this.product = x
      });
    });

  }
 * 
 */


  ngOnInit(): void 
  {
    this.updateProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      shortDescription: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
      price: [null, [Validators.required, Validators.min(1), Validators.max(10000)]],
      discountedPrice: [null],
      brandId: [null, Validators.required],
      categoryIds: [[], Validators.required]
    });

    this.updateProductForm.valueChanges.subscribe(() => {
      this.discountedPriceValidator()(this.updateProductForm);
    });

    this.route.queryParams.subscribe(params => {
      this.productId = +params['productId'];
      console.log('Received productId:', this.productId);
      this.loadData();

    });
  }

  loadData(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = this.buildHierarchyLabels(categories);
    });

    this.brandService.getAllBrands().subscribe(brands => {
      this.brands = brands;
    });

    this.productService.getProductById(this.productId).subscribe(product => {
      this.product = product;
      this.patchForm(product);
    });
  }

  patchForm(product: ProductDTO): void {
    this.updateProductForm.patchValue({
      name: product.name,
      shortDescription: product.shortDescription,
      price: product.price,
      discountedPrice: product.discountedPrice,
      brandId: product.brandId,
      categoryIds: product.categoryIds
    });
  }

  discountedPriceValidator() {
    return (form: AbstractControl) => {
      const priceControl = form.get('price');
      const discountedPriceControl = form.get('discountedPrice');

      if (!priceControl || !discountedPriceControl) return null;

      const price = priceControl.value;
      const discountedPrice = discountedPriceControl.value;

      const errors = discountedPriceControl.errors || {};
      delete errors['discountedPriceInvalid'];

      if (discountedPrice !== null && discountedPrice !== undefined && discountedPrice !== '') {
        if (discountedPrice <= 0 || discountedPrice >= price) {
          discountedPriceControl.setErrors({ ...errors, discountedPriceInvalid: true });
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

  buildHierarchyLabels(categories: CategoryDTO[]): { id: number; displayName: string }[] {
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
      if (this.updateProductForm.invalid) {
        this.snackBar.open('Please fix the errors in the form.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }
  
      const formValue = this.updateProductForm.value;
      const payload : UpdateProductRequestDTO = {
        name: formValue.name,
        shortDescription: formValue.shortDescription,
        price: formValue.price,
        discountedPrice: formValue.discountedPrice,
        brandId: formValue.brandId,
        categoryIds: formValue.categoryIds
      };

      this.productService.updateProduct(this.productId,payload).subscribe({
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
