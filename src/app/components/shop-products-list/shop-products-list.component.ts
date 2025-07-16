import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../models/UserDTO';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { filter, Subscription } from 'rxjs';
import { FilteredProductsResultDto } from '../../models/FilteredProductsResultDto';

@Component({
  selector: 'app-shop-products-list',
  standalone: true,
  imports: [...MaterialModules, RouterModule, RouterLink, RouterOutlet, CommonModule, ShopProductsFilterComponent],
  templateUrl: './shop-products-list.component.html',
  styleUrl: './shop-products-list.component.scss'
})

export class ShopProductsListComponent implements OnInit {

  products: ProductDTO[] = [];
  selectedSortOption = 'nameAsc';
  pageSize = 10;
  totalProducts = 0;
  currentPage = 0;

  //categoryIdFromParams: number | null = null;

  //genderTypeFromParams: number | null = null;

  private routeSub: Subscription | undefined;
  currentSearchText: string | null = null;

  currentFilters: ProductFilterDto =
    {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'name_asc',
      categoryIds: null,
      genderId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      searchText:null
    };

  defaultImage = 'images/no-image-svgrepo-com.svg';
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {
  this.routeSub = this.route.queryParams.subscribe(params => {
    const categoryId = +params['categoryId'];
    const genderType = params['genderType'];
    const searchText = params['searchText'];

    this.currentFilters = {
      pageNumber: 1,
      pageSize: this.pageSize,
      sortBy: 'name_asc',
      categoryIds: null,
      genderId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      searchText: null
    };

    if (searchText) {
      this.currentSearchText = searchText;
      this.currentFilters.searchText = searchText;
    }

    if (categoryId) {
      this.currentFilters.categoryIds = [categoryId];
    }

    if (genderType) {
      this.productService.getGenderIdByGenderName(genderType).subscribe(z => {
        //this.currentFilters.genderId = z;
        this.currentFilters = {
          ...this.currentFilters,
          genderId: z
          };
      this.loadProducts();

      });
      return; // wait for genderId lookup, don't call loadProducts twice
    }

    this.loadProducts();
  });
}

loadProducts() {
  this.currentFilters.pageNumber = this.currentPage + 1;
  this.currentFilters.pageSize = this.pageSize;
  //this.currentFilters.sortBy = this.selectedSortOption;

  this.productService.getFilteredProducts(this.currentFilters).subscribe(res => {
    this.products = res.products;
    this.totalProducts = res.totalCount;
  });
}

  viewProductDetails(productId: number): void {
     this.router.navigate(['/shop/product-details'], {
        queryParams: {productId:productId}
      });
    // this.router.navigate(['/shop/details-product'], {
    //   queryParams: { productId }
    // });
    //return;
  }

  getFirstImage(product: ProductDTO): string {
    if (product.imageFilenames && product.imageFilenames.length > 0) {
      return AppConstants.imageBaseUrl + product.imageFilenames[0];
    }
    return AppConstants.defaultProductImage;
  }

  hasImage(product: ProductDTO): boolean {
    return product.imageFilenames && product.imageFilenames.length > 0;
  }

applyFilters(filters: any, drawer?: any) {
  if (filters.closeDrawer && drawer) {
    drawer.close();
  }

  this.currentFilters = {
    categoryIds: filters.categories && filters.categories.length > 0 ? filters.categories : null,
    genderId: filters.gender !== undefined ? filters.gender : null,
    brandId: filters.brand !== undefined ? filters.brand : null,
    minPrice: filters.priceRange && filters.priceRange.length > 0 ? filters.priceRange[0] : null,
    maxPrice: filters.priceRange && filters.priceRange.length > 1 ? filters.priceRange[1] : null,
    pageNumber: 1,
    pageSize: this.pageSize,
    sortBy: this.selectedSortOption,
    searchText: null
    //searchText: this.currentFilters.searchText // keep search term if active
  };
  this.currentSearchText = null;
  this.currentPage = 0; // reset paginator
  this.loadProducts();
}

  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    const discount = 100 - Math.round((discountedPrice / originalPrice) * 100);
    return discount;
  }

  onSortOptionChanged() {
  switch (this.selectedSortOption) {
    case 'nameAsc':
      this.currentFilters.sortBy = 'name_asc';
      break;
    case 'nameDesc':
      this.currentFilters.sortBy = 'name_desc';
      break;
    case 'priceLow':
      this.currentFilters.sortBy = 'price_asc';
      break;
    case 'priceHigh':
      this.currentFilters.sortBy = 'price_desc';
      break;
    default:
      this.currentFilters.sortBy = 'name_asc';
  }
  this.currentFilters.pageNumber = 1;
  this.currentPage = 0;
  this.loadProducts();
}

onPageChange(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex;
  this.loadProducts();
}


  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}