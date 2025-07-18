import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../models/UserDTO';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDTO } from '../../models/OrderDTO';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { ProductDTO } from '../../models/ProductDTO';
import { AppConstants } from '../../shared-files/app-constants';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { BrandDTO } from '../../models/BrandDTO';
import { GenderDTO } from '../../models/GenderDTO';
import { CategoryDTO } from '../../models/CategoryDTO';
import { ProductFilterDto } from '../../models/ProductFilterDto';

@Component({
  selector: 'app-shop-products-filter',
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule,FormsModule],
  templateUrl: './shop-products-filter.component.html',
  styleUrl: './shop-products-filter.component.scss'
})
export class ShopProductsFilterComponent implements OnInit ,OnChanges  
{

  @Input() showTitle: boolean = false;

  @Input() selectedCategoryId: number | null = null;

  @Input() selectedGenderTypeId: number | null = null;

  @Input() filters!: ProductFilterDto;

  


  //@Input() categories: string[] = [];
  //@Input() brands: string[] = [];
  //@Input() genders: string[] = [];

  brands:BrandDTO[] = [];
  genders:GenderDTO[] = [];
  categories:CategoryDTO[] = [];


  constructor(private brandService:BrandService, private categoryService:CategoryService, private productService:ProductService)
  {}


  priceRange: number[] = [1, 500]; 
  selectedGender: number | null = null;
  selectedCategories: number[] = [];
  selectedBrand: number | null = null;

  @Output() applyFilters = new EventEmitter<any>();


  ngOnInit(): void 
  {
    this.brandService.getAllBrands().subscribe((x:BrandDTO[]) => {
      this.brands = x;
    });

    this.categoryService.getAllCategories().subscribe((y:CategoryDTO[]) => {
      this.categories = y;

        if (this.selectedCategoryId && !this.selectedCategories.includes(this.selectedCategoryId)) {
      this.selectedCategories.push(this.selectedCategoryId);
    }
    });
    
    this.productService.getAllGendersCategory().subscribe((z:GenderDTO[]) => {
      this.genders = z;

      if (this.selectedGenderTypeId) 
      {
        this.selectedGender = this.selectedGenderTypeId;
      }
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['selectedGenderTypeId'] && this.selectedGenderTypeId) {
  //     this.selectedGender = this.selectedGenderTypeId;
  //   }

  //   if (changes['selectedCategoryId'] && this.selectedCategoryId && !this.selectedCategories.includes(this.selectedCategoryId)) {
  //     this.selectedCategories.push(this.selectedCategoryId);
  //   }
  // }
  
  ngOnChanges(changes: SimpleChanges): void {
  if (changes['filters'] && this.filters) {
    this.selectedCategories = this.filters.categoryIds ? [...this.filters.categoryIds] : [];
    this.selectedGender = this.filters.genderId ?? null;
    this.selectedBrand = this.filters.brandId ?? null;
    this.priceRange = [
      this.filters.minPrice ?? 1,
      this.filters.maxPrice ?? 500
    ];
  }
}


  apply(closeDrawer: boolean = true): void {
    this.applyFilters.emit({
      gender: this.selectedGender,
      categories: this.selectedCategories,
      brand: this.selectedBrand,
      priceRange: this.priceRange,
      closeDrawer: closeDrawer
    });
  }

  clear(): void {
    this.selectedGender = null;
    this.selectedCategories = [];
    this.selectedBrand = null;
    this.priceRange = [1, 500];
    this.apply(false);
  }
}