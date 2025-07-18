import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../models/UserDTO';
import { ProductService } from '../../services/product.service';
import { ShopProductsFilterComponent } from "../shop-products-filter/shop-products-filter.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from '../../services/AuthenticationServices/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shop-checkout',
  standalone: true,
  imports: [...MaterialModules,RouterModule, RouterLink, RouterOutlet, CommonModule, ShopProductsFilterComponent,ReactiveFormsModule,
    FormsModule,CarouselModule],
  templateUrl: './shop-checkout.component.html',
  styleUrl: './shop-checkout.component.scss'
})

export class ShopCheckoutComponent implements OnInit {

  
  @ViewChild('paypalContainer', { static: false }) paypalContainerRef!: ElementRef;

  user!: UserDTO;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private cartService: ShoppingCartService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (userId === null) {
      this.router.navigate(['/shop/access-denied']);
      return;
    }
  }
}