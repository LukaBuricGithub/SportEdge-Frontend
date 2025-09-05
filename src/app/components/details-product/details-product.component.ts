import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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

@Component({
  selector: 'app-details-product',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './details-product.component.html',
  styleUrl: './details-product.component.scss'
})
export class DetailsProductComponent implements OnInit {
  
  constructor(private router:Router,private productService:ProductService,private route:ActivatedRoute,private dialog:MatDialog,
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


  onUpdate(productId:number)
  {
    this.router.navigate(['/admin/update-product'], {
        queryParams: {productId:productId}
      });
  }

  onBack() : void 
  {
    this.router.navigate(['/admin/products']);
  }

  onDelete(productId: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    } as ConfirmDialogData
  });


  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      this.productService.deleteProduct(productId).subscribe({
        next: (response) => {
          console.log('Product deleted successfully:',response);
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {

          let errorMessage = 'An unknown error occurred.';

          switch(error.status) 
          {
            case 400:
              errorMessage = error?.error?.message || 'Cannot delete product because it has related objects (order, cart etc.).';
              break;
            default:
               errorMessage = error?.error?.message || 'Unexpected error occurred.';
              break;
          }


          console.error('Failed to delete product:', error);
          this.snackBar.open(errorMessage, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
          });
        }

      });
    }
  });
}





  uploadImages(productId:number)
  {
    this.router.navigate(['/admin/upload-product-images'], {
        queryParams: {productId:productId}
      });
  }

  updateProductVariationQuantity(productId:number)
  {
    this.router.navigate(['/admin/update-product-variations'], {
        queryParams: {productId:productId}
      });
  }

  deleteImages(productId:number)
  {
     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Delete images',
      message: 'Are you sure you want to delete the images of this product?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    } as ConfirmDialogData
  });


  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      this.productService.deleteProductImages(productId).subscribe({
        next: (response) => {
          console.log('Product images deleted successfully:',response);

          this.productService.getProductById(this.productId).subscribe((updatedProduct:ProductDTO) => {
            this.product = updatedProduct;
          });

            this.snackBar.open('Images deleted successfully', 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar']
            });

        },
        error: (error) => {

          let errorMessage = 'An unknown error occurred.';

          switch(error.status) 
          {
            case 404:
              errorMessage = error?.error?.message || 'There are no images to delete.';
              break;
            default:
               errorMessage = error?.error?.message || 'Unexpected error occurred.';
              break;
          }


          console.error('Failed to delete product images:', error);
          this.snackBar.open(errorMessage, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
          });
          
        }

      });
    }
  });
  }
}
