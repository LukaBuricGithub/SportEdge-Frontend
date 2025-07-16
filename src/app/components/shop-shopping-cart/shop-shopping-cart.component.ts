import { Component, OnInit } from '@angular/core';
import { CartDTO } from '../../models/CartDTO';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { CartItemDTO } from '../../models/CartItemDTO';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AppConstants } from '../../shared-files/app-constants';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-shop-shopping-cart',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './shop-shopping-cart.component.html',
  styleUrl: './shop-shopping-cart.component.scss'
})
export class ShopShoppingCartComponent implements OnInit {


  cart!: CartDTO;
  userId!:number;

  quantityOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  imageBaseUrl = AppConstants.imageBaseUrl;
  emptyImage = AppConstants.defaultProductImage;

  loading = true;





  constructor(private cartService: ShoppingCartService, private authService: AuthService,
    private router:Router,private userService:UserService,private route:ActivatedRoute,private dialog:MatDialog,
  private snackBar:MatSnackBar, private orderService:OrderService, private productService:ProductService) { }

  ngOnInit(): void {
     const id = this.authService.getUserId();
      if (id === null) 
      {
        this.router.navigate(['/shop']);
      } 
      else 
      {
        this.userId = id;
        this.loadCart();
      }   
  }

  loadCart(): void {
  this.loading = true;
  this.cartService.getCart(this.userId).subscribe({
    next: (data) => {
      this.cart = data;

      const imagePromises = this.cart.cartItems.map(item => {
        if (item.productId) {
          return this.productService.getProductById(item.productId).toPromise().then(product => {
            if (product && product.imageFilenames && product.imageFilenames.length > 0) {
              const filename = product.imageFilenames[0];
              item.imageUrl = `${this.imageBaseUrl}${filename}`;
            } else {
              item.imageUrl = this.emptyImage;
            }
          }).catch(() => {
            item.imageUrl = this.emptyImage;
          });
        } else {
          item.imageUrl = this.emptyImage;
          return Promise.resolve();
        }
      });

      Promise.all(imagePromises).then(() => {
        this.loading = false;
      });
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}



//   loadCart(): void {
//   this.loading = true;
//   this.cartService.getCart(this.userId).subscribe({
//     next: (data) => {
//       this.cart = data;
//       const imagePromises = this.cart.cartItems.map(item => {
//         if (item.productId) {
//           return this.productService.getProductById(item.productId).toPromise().then(product => {
//             const filename = product.imageFilenames[0];
//             item.imageUrl = filename ? `${this.imageBaseUrl}${filename}` : this.emptyImage;
//           });
//         } else {
//           item.imageUrl = this.emptyImage;
//           return Promise.resolve();
//         }
//       });
//       Promise.all(imagePromises).then(() => {
//         this.loading = false;
//       });
//     },
//     error: (err) => {
//       console.error(err);
//       this.loading = false;
//     }
//   });
// }

//   loadCart(): void {
//   this.cartService.getCart(this.userId).subscribe({
//     next: (data) => {
//       this.cart = data;

//       this.cart.cartItems.forEach(item => {
//         if (item.productId) { // Assuming you have added productId to DTO
//           this.productService.getProductById(item.productId).subscribe(product => {
//             const filename = product.imageFilenames[0];
//             item.imageUrl = filename 
//               ? `${this.imageBaseUrl}${filename}`
//               : this.emptyImage;
//           });
//         } else {
//           item.imageUrl = this.emptyImage;
//         }
//       });
//     },
//     error: (err) => console.error(err)
//   });
// }



//   loadCart(): void {
//   this.loading = true;
//   this.cartService.getCart(this.userId).subscribe({
//     next: (data) => {
//       this.cart = data;

//       this.cart.cartItems.forEach(item => {
//         if (item.productId) { // Assuming you have added productId to DTO
//           this.productService.getProductById(item.productId).subscribe(product => {
//             const filename = product.imageFilenames[0];
//             item.imageUrl = filename 
//               ? `${this.imageBaseUrl}${filename}`
//               : this.emptyImage;
//           });
//         } else {
//           item.imageUrl = this.emptyImage;
//         }
//       });
//     },
//     error: (err) => console.error(err)
//   });
// }


  clearCart(): void 
  {
    this.cartService.clearCart(this.userId).subscribe({
    })
  }

  updateQuantity(item: CartItemDTO, quantity: number): void {
    const newQty = quantity;
    if (newQty <= 0) {
      this.removeItem(item);
      return;
    }

    this.cartService.updateItem(this.userId, item.productVariationId, newQty).subscribe({
      // next: () => this.loadCart(),
      next: () => 
        {
          item.quantity = quantity;
        },
      error: (err) => {
      console.error(err);
          this.snackBar.open('Selected quantity exceeds the amount in storage', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      this.loadCart(); 
      }
    });
  }

  removeItem(item: CartItemDTO): void {
    this.cartService.removeItem(this.userId, item.productVariationId).subscribe({
      // next: () => this.loadCart(),
      next: () => {
      this.cart.cartItems = this.cart.cartItems.filter(i => i.productVariationId !== item.productVariationId);
    },
      error: (err) => console.error(err)
    });
  }

  getQuantityOptions(): number[] {
    return Array.from({ length: 9 }, (_, i) => i + 1); // Example: 1–20
  }

  calculateTotal(): number {
    return this.cart?.cartItems.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0) || 0;
  }

onQuantityChange(event: MatSelectChange, item: CartItemDTO) {
  const newQuantity = event.value;
  this.updateQuantity(item, newQuantity);
}


getCartTotal(): number {
  return this.cart?.cartItems.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0) || 0;
}

}
