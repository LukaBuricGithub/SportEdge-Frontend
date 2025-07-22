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
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';




@Component({
  selector: 'app-shop-product-details',
  standalone:true,
  imports: [...MaterialModules,RouterModule, RouterLink, RouterOutlet, CommonModule, ShopProductsFilterComponent,FormsModule,CarouselModule],
  templateUrl: './shop-product-details.component.html',
  styleUrl: './shop-product-details.component.scss'
})
export class ShopProductDetailsComponent implements OnInit {
 
  isStacked = false;
  
  productId!:number;
  product!: ProductDTO;
  mainImageUrl!: string;
  selectedSize!: string;

  filteredVariations: any[] = [];



  imageBaseUrl = AppConstants.imageBaseUrl;
  selectedVariationId!: number | null;

  lightboxOpen = false;
  currentIndex = 0;
  images: string[] = []; 

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 10,
    nav: false,
    dots: true,
    autoplay: false,
    navText: [
    '<i class="material-icons">chevron_left</i>',
    '<i class="material-icons">chevron_right</i>',
    ],
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
  };

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver,
    private snackBar:MatSnackBar, private authService:AuthService, private cartService:ShoppingCartService) { }

ngOnInit() {

  this.breakpointObserver.observe(['(max-width: 767.98px)'])
      .subscribe((state: BreakpointState) => {
        this.isStacked = state.matches;
      });

  this.route.queryParams.subscribe(params => {
    this.productId = +params['productId'];
    this.productService.getProductById(this.productId).subscribe((x: ProductDTO) => {
      this.product = x;
      console.log(this.product);


      this.images = (this.product.imageFilenames && this.product.imageFilenames.length > 0)
  ? this.product.imageFilenames.map(filename => this.imageBaseUrl + filename)
  : [AppConstants.defaultProductImage]; 

      

      this.filteredVariations = this.product.variations.filter(v => v.quantityInStock > 0);

      const firstAvailable = this.filteredVariations[0];
      this.selectedVariationId = firstAvailable ? firstAvailable.id : null;
    });
  });
}


  addToCart() : void {

    const userId = this.authService.getUserId();
    console.log('User ID:', userId);
    if (userId === null) 
    {
        this.snackBar.open('To continue shopping please log in', 'Close', {
            duration: 4000,
      });
      return; 
    } 

    const variation = this.product.variations.find(v => v.id === this.selectedVariationId);
    if (variation) {
      console.log('Adding to cart:', {
        productId: this.product.id,
        variationId: variation.id,
        size: variation.sizeOptionName,
      });
      
    const quantity = 1;

    this.cartService.addItem(userId, variation.id, quantity).subscribe({
      next: () => {
        this.snackBar.open('Product successfully added to cart!', 'Close', {
        duration: 4000,
      });
    },
    error: (err) => {
  console.error('Error adding product to cart:', err);
  
  const message: string = err?.error;

  if (err.status === 400 && typeof message === 'string' && message.startsWith('Exceeded_quantity:')) {
    const cleanMessage = message.replace('Exceeded_quantity:', '').trim();
    this.snackBar.open(`Not enough stock: ${cleanMessage}`, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
  } else {
    this.snackBar.open('Error adding product to cart. Please try again.', 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
  }
}
  });
    }
  }

  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    const discount = 100 - Math.round((discountedPrice / originalPrice) * 100);
    return discount;
  }

  openLightbox(index: number) {
  this.currentIndex = index;
  this.lightboxOpen = true;
}

closeLightbox() {
  this.lightboxOpen = false;
}

prevImage(event: Event) {
  event.stopPropagation();
  this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
}

nextImage(event: Event) {
  event.stopPropagation();
  this.currentIndex = (this.currentIndex + 1) % this.images.length;
}

}
