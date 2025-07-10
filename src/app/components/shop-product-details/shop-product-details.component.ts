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



@Component({
  selector: 'app-shop-product-details',
  standalone:true,
  imports: [...MaterialModules,RouterModule, RouterLink, RouterOutlet, CommonModule, ShopProductsFilterComponent,FormsModule,CarouselModule],
  templateUrl: './shop-product-details.component.html',
  styleUrl: './shop-product-details.component.scss'
})
export class ShopProductDetailsComponent implements OnInit {
 
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
    nav: true,
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

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute) { }

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.productId = +params['productId'];
    this.productService.getProductById(this.productId).subscribe((x: ProductDTO) => {
      this.product = x;

      this.images = this.product.imageFilenames.map(filename => this.imageBaseUrl + filename);

      this.filteredVariations = this.product.variations.filter(v => v.quantityInStock > 0);

      const firstAvailable = this.filteredVariations[0];
      this.selectedVariationId = firstAvailable ? firstAvailable.id : null;
    });
  });
}


  addToCart() {
    const variation = this.product.variations.find(v => v.id === this.selectedVariationId);
    if (variation) {
      console.log('Adding to cart:', {
        productId: this.product.id,
        variationId: variation.id,
        size: variation.sizeOptionName,
      });
      // You can call your cart service here
    }
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
