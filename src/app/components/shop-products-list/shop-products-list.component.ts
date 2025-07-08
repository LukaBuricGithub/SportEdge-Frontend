import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
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
import { ShopProductsFilterComponent } from "../shop-products-filter/shop-products-filter.component";
import { MatDrawer } from '@angular/material/sidenav';
import { ProductFilterDto } from '../../models/ProductFilterDto';
import { filter } from 'rxjs';

@Component({
  selector: 'app-shop-products-list',
  standalone:true,
  imports: [...MaterialModules, RouterModule, RouterLink, RouterOutlet, CommonModule, ShopProductsFilterComponent],
  templateUrl: './shop-products-list.component.html',
  styleUrl: './shop-products-list.component.scss'
})
export class ShopProductsListComponent implements OnInit {

  products: ProductDTO[] = [];

  defaultImage = 'images/no-image-svgrepo-com.svg';

  @ViewChild('drawer') drawer!: MatDrawer;


  constructor(private productService: ProductService, private router: Router,private route:ActivatedRoute) {}
  
  ngOnInit(): void 
  {
    this.loadAllProducts();
  }

  loadAllProducts(): void 
  {

    this.route.queryParams.subscribe(params => {
    const categoryId = +params['categoryId'];
    const genderType = params['genderType'];
    if (categoryId) {
      this.productService.getProductsByCategory(categoryId).subscribe(x => {
      this.products = x;
      });
    }
  else if (genderType) 
  {
    this.productService.getProductsByGenderTypeName(genderType).subscribe(y => {
      this.products = y;
    });
  }
  else 
  {
   this.productService.getAllProducts().subscribe(products => {
      this.products = products;

    for (const product of this.products) {
      console.log('Image URL for product', product.name, ':', this.getFirstImage(product));
        }
      });
   }
  });
}


  viewProductDetails(productId: number): void 
  {
    // this.router.navigate(['/shop/details-product'], {
    //   queryParams: { productId }
    // });
    return;
  }

  //   getFirstImage(product: ProductDTO): string {
  //    return product.imageFilenames && product.imageFilenames.length > 0 
  //     ? product.imageFilenames[0] 
  //     : this.defaultImage;
  // }

    getFirstImage(product: ProductDTO): string {
    if (product.imageFilenames && product.imageFilenames.length > 0) {
      return AppConstants.imageBaseUrl + product.imageFilenames[0];
    }
    return AppConstants.defaultProductImage;
  }

  hasImage(product: ProductDTO): boolean 
  {
  return product.imageFilenames && product.imageFilenames.length > 0;
  }


  applyFilters(filters: any,drawer?:any) 
  {
    if (filters.closeDrawer && drawer) 
    {
      drawer.close();
    }

    const filterDto : ProductFilterDto = {
      categoryIds: filters.categories && filters.categories.length > 0 ? filters.categories : null,
      genderId: filters.gender !== undefined ? filters.gender : null,
      brandId: filters.brand !== undefined ? filters.brand : null,
      minPrice: filters.priceRange && filters.priceRange.length > 0 ? filters.priceRange[0] : null,
      maxPrice: filters.priceRange && filters.priceRange.length > 1 ? filters.priceRange[1] : null
    }

    this.productService.getProductsByFilter(filterDto).subscribe( (products:ProductDTO[]) => {
      this.products = products;
    });
  }

  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number 
  {
    const discount = 100 - Math.round((discountedPrice / originalPrice) * 100);
    return discount;
  }

}
