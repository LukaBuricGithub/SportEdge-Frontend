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
import { CreateOrderRequestDto } from '../../models/CreateOrderRequestDto';
import { OrderDTO } from '../../models/OrderDTO';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserSendReceiptDTO } from '../../models/UserSendReceiptDTO';



declare var paypal: any;

@Component({
  selector: 'app-shop-shopping-cart',
  standalone: true,
  imports: [...MaterialModules, RouterModule, RouterLink, RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './shop-shopping-cart.component.html',
  styleUrl: './shop-shopping-cart.component.scss'
})
export class ShopShoppingCartComponent implements OnInit {

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
        tagline: false,
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
          console.log(details);
          if (details.status === 'COMPLETED') {
            this.placeOrder();
          }
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        this.snackBar.open('An error occured while processing a payement. Please try later.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    }).render(this.paypalContainer.nativeElement);

    this.paypalRendered = true;
  }

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
    return Array.from({ length: 9 }, (_, i) => i + 1); 
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

  placeOrder(): void {
    const formValue = this.checkoutForm.value;
    const payload: CreateOrderRequestDto = {
      userCountry: formValue.country,
      userCity: formValue.city,
      userAddress: formValue.address
    };

    this.orderService.createOrder(payload).subscribe({
      next: (order: OrderDTO) => {
      this.generatePdfAsBase64(order, this.user, (pdfBase64: string) => {
        const receiptPayload: UserSendReceiptDTO = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          subject: "Your SportEdge Order Receipt",
          content: `Thank you for your order #${order.id}!`,
          pdfBase64: pdfBase64
        };

        this.userService.sendReceiptEmail(receiptPayload).subscribe({
          next: () => {
            if (this.userId !== null) 
            {
              this.cartService.updateItemCount(this.userId); 
            }
            this.router.navigate(['/customer/finished-order-message']);
          },
          error: (emailErr) => {
            console.error("Email sending failed:", emailErr);
            this.snackBar.open('Order placed, but failed to send receipt email.', 'Close', {
              duration: 6000,
              panelClass: ['warning-snackbar']
            });
            if (this.userId !== null) 
            {
              this.cartService.updateItemCount(this.userId); 
            }
            this.router.navigate(['/customer/finished-order-message']);
          }
        });
      });
      },
      error: (err) => {
        console.error('Order creation failed:', err);
        const message: string = err?.error;

        if (err.status === 400 && typeof message === 'string' && message.startsWith('Exceeded_quantity:')) {
          const cleanMessage = message.replace('Exceeded_quantity:', '').trim();
          this.snackBar.open(`${cleanMessage}`, 'Close', {
            duration: 6000,
            panelClass: ['error-snackbar']
          });

        } else if (err.status === 400 && typeof message === 'string') {
          this.snackBar.open(`Something went wrong. Please try again. If error persists contact us.`, 'Close', {
            duration: 6000,
            panelClass: ['error-snackbar']
          });

        } else if (err.status === 404 && typeof message === 'string') {
          this.snackBar.open(`Something went wrong. Please try again. If error persists contact us.`, 'Close', {
            duration: 6000,
            panelClass: ['error-snackbar']
          });

        } else if (err.status === 401) {
          this.snackBar.open('You are not authorized. Please log in again.', 'Close', {
            duration: 6000,
            panelClass: ['error-snackbar']
          });

        } else {
          this.snackBar.open('An unexpected error occurred while placing the order. Please try again.', 'Close', {
            duration: 6000,
            panelClass: ['error-snackbar']
          });
        }
      }
    });
  }

  generatePdfAsBase64(order: OrderDTO, user: UserDTO, callback: (base64: string) => void): void {
  const doc = new jsPDF();

  const img = new Image();
  img.src = "/images/SportEdge-Logo-PNG.png";

  img.onload = () => {
    doc.addImage(img, 'PNG', 14, 10, 60, 25);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Receipt', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    const formattedDate = new Date(order.createdAt).toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: ${order.id}`, 14, 55);
    doc.text(`Date: ${formattedDate}`, 14, 62);
    doc.text(`Customer: ${user.firstName} ${user.lastName}`, 14, 69);
    doc.text(`Customer email: ${user.email}`, 14, 76);
    doc.text(`Shipping Address: ${order.userAddress}, ${order.userCity}, ${order.userCountry}`, 14, 83);

    const itemRows = order.orderItems.map(item => [
      item.productName,
      item.sizeOptionName,
      item.quantity,
      `${item.unitPrice.toFixed(2)} €`,
      `${item.subtotalPrice.toFixed(2)} €`
    ]);

    autoTable(doc, {
      head: [['Product', 'Size', 'Qty', 'Unit Price', 'Subtotal']],
      body: itemRows,
      startY: 90,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { bottom: 30 },
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for your order with SportEdge!', doc.internal.pageSize.getWidth() / 2, pageHeight - 15, { align: 'center' });
        const pageNumber = doc.getNumberOfPages();
        doc.text(`Page ${pageNumber}`, doc.internal.pageSize.getWidth() - 20, pageHeight - 15);
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${order.totalPrice.toFixed(2)} €`, 14, finalY + 10);

    const pdfBase64 = doc.output('datauristring').split(',')[1];
    callback(pdfBase64);
  };
}


}
