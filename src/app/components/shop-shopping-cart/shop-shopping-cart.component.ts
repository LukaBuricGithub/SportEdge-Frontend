import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDTO } from '../../models/UserDTO';
import { StepperSelectionEvent } from '@angular/cdk/stepper';



declare var paypal: any;

@Component({
  selector: 'app-shop-shopping-cart',
  standalone: true,
  imports: [...MaterialModules, RouterModule, RouterLink, RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './shop-shopping-cart.component.html',
  styleUrl: './shop-shopping-cart.component.scss'
})
export class ShopShoppingCartComponent implements OnInit{

  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';

  paypalRendered = false;

  @ViewChild('paypalContainer', { static: false }) paypalContainer!: ElementRef;

  cart!: CartDTO;
  userId!: number;

  quantityOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  imageBaseUrl = AppConstants.imageBaseUrl;
  emptyImage = AppConstants.defaultProductImage;

  loading = true;

  cartForm!: FormGroup;
  user!: UserDTO;
  checkoutForm!: FormGroup;
  payementForm!: FormGroup;


  constructor(private cartService: ShoppingCartService, private authService: AuthService,
    private router: Router, private userService: UserService, private route: ActivatedRoute, private dialog: MatDialog,
    private snackBar: MatSnackBar, private orderService: OrderService, private productService: ProductService,
    private fb: FormBuilder) { }




  ngOnInit(): void {
    this.updateStepperOrientation(window.innerWidth);
    const id = this.authService.getUserId();
    if (id === null) {
      this.router.navigate(['/shop']);
    }
    else {
      this.userId = id;
      this.loadCart();
      this.cartForm = this.fb.group({ dummy: [''] });


      this.checkoutForm = this.fb.group({
        address: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        country: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        city: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      });

      this.userService.getUserById(id).subscribe((user) => {
        this.user = user;
        this.checkoutForm.patchValue({
          address: user.address,
          country: user.country,
          city: user.city
        });
      });
      this.payementForm = this.fb.group({});
    }
  }


    @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateStepperOrientation(event.target.innerWidth);
  }

  private updateStepperOrientation(width: number) {
    this.stepperOrientation = width < 768 ? 'vertical' : 'horizontal';
  }


 ngAfterViewInit(): void {
    const interval = setInterval(() => {
      if (this.checkoutForm && this.checkoutForm.valid && !this.paypalRendered) {
        this.renderPayPalButton();
        clearInterval(interval);
      }
    }, 500);
  }


  renderPayPalButton(): void {
    if (!this.paypalContainer || this.paypalRendered) return;

    const paypalLib = (window as any).paypal;
    if (!paypalLib) return;

    paypalLib.Buttons({
       style: 
       {
         tagline:false,
         layout: 'horizontal',
         color: 'blue',
         shape: 'rect',
         label: 'paypal'
       },
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.getCartTotal().toFixed(2),
              currency_code: 'EUR'
            }
          }]
        });
      },
      onApprove: (_data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('Transaction completed by ' + details.payer.name.given_name);
          // Place order logic here
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
      }
    }).render(this.paypalContainer.nativeElement);

    this.paypalRendered = true;
  }

// renderPayPalButton() {
//   if (!this.paypalContainer || this.paypalRendered) return;

//   const paypal = (window as any).paypal;
//   if (!paypal) return;

//   paypal.Buttons({
//     createOrder: (data: any, actions: any) => {
//       return actions.order.create({
//         purchase_units: [{
//           amount: {
//             value: this.getCartTotal().toString(),
//             currency_code: 'EUR'
//           }
//         }]
//       });
//     },
//     onApprove: (data: any, actions: any) => {
//       return actions.order.capture().then((details: any) => {
//         alert('Transaction completed by ' + details.payer.name.given_name);
//       });
//     },
//     onError: (err: any) => {
//       console.error('PayPal error:', err);
//     }
//   }).render(this.paypalContainer.nativeElement);

//   this.paypalRendered = true;
// }

// onStepChange(event: StepperSelectionEvent) {
//   const index = event.selectedIndex;
  
//   if (index === 2 && this.checkoutForm.valid) {
//     setTimeout(() => this.renderPayPalButton(), 0);
//   }

//   // Reset if user goes back
//   if (index !== 2) {
//     this.paypalRendered = false;
//   }
// }

onStepChange(event: StepperSelectionEvent): void {
  const currentIndex = event.selectedIndex;

  const paymentStepIndex = 2;

  if (currentIndex !== paymentStepIndex) {
    this.clearPayPalButton();
  } else {
    setTimeout(() => {
      if (this.checkoutForm.valid && !this.paypalRendered) {
        this.renderPayPalButton();
      }
    }, 100);
  }
}

clearPayPalButton(): void {
  if (this.paypalContainer?.nativeElement) {
    this.paypalContainer.nativeElement.innerHTML = '';
    this.paypalRendered = false;
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


  clearCart(): void {
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
      next: () => {
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
